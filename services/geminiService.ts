
import { GoogleGenAI, type Content, type Part, Modality } from "@google/genai";
import type { ChatMessage, AiResponse, Attachment, CognitiveState } from '../types';
import { LANGUAGES } from "../translations";
import { DEFAULT_SYSTEM_INSTRUCTION } from "../personas";
import { MODELS } from "../constants";

const getCognitiveStateInstruction = (state: CognitiveState): string => {
    switch (state) {
        case 'creative':
            return "You are in a creative and expansive mindset. Your goal is to brainstorm, explore tangential ideas, and provide imaginative, novel responses. Prioritize originality and divergent thinking.";
        case 'critical':
            return "You are in a critical and analytical mindset. Your goal is to identify flaws, challenge assumptions, play devil's advocate, and provide a skeptical analysis. Prioritize logic, evidence, and identifying potential weaknesses.";
        case 'synthetic':
            return "You are in a synthetic and integrative mindset. Your goal is to connect disparate concepts, find hidden patterns, and synthesize information from multiple domains into a cohesive, holistic perspective. Prioritize seeing the bigger picture and creating novel connections.";
        case 'focused':
        default:
            return "You are in a focused and efficient mindset. Your goal is to provide direct, clear, and concise answers to the user's query. Prioritize accuracy and relevance.";
    }
};

const shouldUseGoogleSearch = (prompt: string): boolean => {
  const lowerCasePrompt = prompt.toLowerCase();
  
  const searchKeywords = [
    'latest', 'current', 'news', 'stock price', 'weather', 'who won', 
    'today', 'yesterday', 'this week', 'recent', 'live score'
  ];
  
  if (searchKeywords.some(keyword => lowerCasePrompt.includes(keyword))) {
    return true;
  }

  const searchPatterns = [
    /^who is .+\?$/,
    /^what is the .+\?$/,
    /^when did .+ happen\?$/,
    /^how recent is .+$/,
    /^what are the specs for .+$/,
  ];

  if (searchPatterns.some(pattern => pattern.test(lowerCasePrompt))) {
    return true;
  }

  return false;
};


export const runChat = async (
  message: string,
  history: ChatMessage[],
  language: string,
  systemInstruction: string | undefined,
  modelId: string,
  downloadedModels: Set<string>,
  cognitiveState: CognitiveState,
  t: (key: string, params?: Record<string, string>) => string,
  attachment?: Attachment
): Promise<AiResponse> => {
  const selectedModel = MODELS.find(m => m.id === modelId);

  if (!navigator.onLine) {
    const modelName = selectedModel ? t(selectedModel.name) : t('unknown_model');
    const offlineText = selectedModel && downloadedModels.has(selectedModel.id)
      ? t('offline_response_downloaded', { modelName })
      : t('offline_response_not_downloaded', { modelName });
    return { text: offlineText };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const languageName = LANGUAGES[language]?.name || 'English';
    
    const cognitiveInstruction = getCognitiveStateInstruction(cognitiveState);
    const baseInstruction = systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;
    const finalInstruction = `${cognitiveInstruction}\n\n${baseInstruction}\n\nYour responses should be visually appealing and well-structured. You must respond in ${languageName}.`;

    let responsePrefix = '';
    if (selectedModel?.isExternal) {
        const modelName = selectedModel ? t(selectedModel.name) : modelId;
        responsePrefix = `*(This response is a simulation of **${modelName}**. The request was processed by Google Gemini.)*\n\n`;
    }

    const geminiHistory: Content[] = history.map(msg => {
      const parts: Part[] = [];
      if (msg.attachment) {
        parts.push({
          inlineData: {
            mimeType: msg.attachment.mimeType,
            data: msg.attachment.data,
          },
        });
      }
      if (msg.text) {
        parts.push({ text: msg.text });
      }

      return {
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: parts
      };
    });

    const currentUserParts: Part[] = [];
    if (attachment) {
      currentUserParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      });
    }
    if (message) {
      currentUserParts.push({ text: message });
    }

    const contents: Content[] = [...geminiHistory, { role: 'user', parts: currentUserParts }];
    
    const apiModelId = selectedModel && !selectedModel.isExternal ? selectedModel.id : 'gemini-2.5-flash';

    if (modelId === 'gemini-2.5-flash-image-preview') {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: contents,
            config: {
                systemInstruction: finalInstruction,
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let responseText = '';
        let responseAttachment: AiResponse['attachment'];

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                responseText += part.text;
            } else if (part.inlineData && !responseAttachment) {
                responseAttachment = {
                    data: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                    name: 'generated-image.png'
                };
            }
        }
        return { text: responsePrefix + responseText, attachment: responseAttachment };
    }

    const useSearch = shouldUseGoogleSearch(message);
    const config: any = {
        systemInstruction: finalInstruction,
    };

    if (useSearch) {
        config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
        model: apiModelId,
        contents: contents,
        config: config,
    });

    let responseText = response.text;

    const groundingChunks: AiResponse['groundingChunks'] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
        (chunk: any) => ({
          uri: chunk.web?.uri || '',
          title: chunk.web?.title || 'Untitled Source',
        })
    ).filter(chunk => chunk.uri);


    if (!responseText || responseText.trim() === '') {
        console.warn("Gemini API returned an empty response, possibly due to safety filters.");
        responseText = t('error_gemini_api_empty');
    }

    return { text: responsePrefix + responseText, groundingChunks };
  } catch (error) {
    console.error("Error in API call:", error);
    let errorText = t('error_gemini_api_general');
    if (error instanceof Error && error.message.includes('API key not valid')) {
       errorText = t('error_gemini_api_key');
    }
    return { text: errorText };
  }
};

export const runAnalysis = async (
    messageToAnalyze: ChatMessage,
    analysisLens: CognitiveState,
    language: string,
    t: (key: string) => string
): Promise<AiResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const languageName = LANGUAGES[language]?.name || 'English';

        const analysisInstruction = getCognitiveStateInstruction(analysisLens);
        
        const systemInstruction = `You are a meta-cognition expert. Your task is to analyze a previous AI response through a specific cognitive lens.
The user will provide you with a previous response. You must analyze it according to the provided lens.

Your current analysis lens is: **${analysisLens.toUpperCase()}**.
${analysisInstruction}

Structure your analysis clearly with markdown. Your analysis must be in ${languageName}.
Begin your response with a clear header acknowledging the analysis.`;

        const userPrompt = `Please analyze the following response using the ${analysisLens} lens:\n\n---\n\n${messageToAnalyze.text}\n\n---`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction,
            },
        });
        
        return { text: response.text };

    } catch (error) {
        console.error("Error in analysis API call:", error);
        return { text: t('error_analysis_api') };
    }
};
