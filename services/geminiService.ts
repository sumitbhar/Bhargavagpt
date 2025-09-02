
import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';
import { LANGUAGES } from "../translations";
import { DEFAULT_SYSTEM_INSTRUCTION } from "../personas";

export const runChat = async (message: string, history: ChatMessage[], language: string, systemInstruction?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const languageName = LANGUAGES[language]?.name || 'English';
    
    // Convert the app's message history to the format required by the Gemini API.
    const geminiHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const baseInstruction = systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;
    const finalInstruction = `${baseInstruction} Your responses should be visually appealing and well-structured. You must respond in ${languageName}.`;

    // Create a new chat session with the full history for each new message.
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: geminiHistory,
        config: {
            systemInstruction: finalInstruction,
        },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    return "Sorry, I encountered an error. Please check your API key and network connection and try again.";
  }
};