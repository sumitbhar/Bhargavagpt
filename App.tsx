
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ChatMessage, Chat, AiResponse, Attachment, CognitiveState } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import PersonaHeader from './components/PersonaHeader';
import ModelManagerModal from './components/ModelManagerModal';
import PromptLibraryModal from './components/PromptLibraryModal';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useModelManager } from './hooks/useModelManager';
import { runChat, runAnalysis } from './services/geminiService';
import { routeModel } from './services/modelRouter';
import { translations } from './translations';
import { getSystemInstruction } from './personas';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelManagerOpen, setIsModelManagerOpen] = useState(false);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [language, setLanguage] = useState<string>(localStorage.getItem('bhargava-gpt-language') || 'en-US');
  const [activeCognitiveState, setActiveCognitiveState] = useState<CognitiveState>('focused');
  const [analyzingMessageId, setAnalyzingMessageId] = useState<string | null>(null);

  const modelManager = useModelManager();

  const t = useCallback((key: string, params: Record<string, string> = {}) => {
      const langTranslations = translations[language] || translations['en-US'];
      const defaultTranslations = translations['en-US'];
      let text = langTranslations[key] || defaultTranslations[key];

      if (typeof text === 'string') {
        Object.keys(params).forEach(paramKey => {
            text = text.replace(`{{${paramKey}}}`, params[paramKey]);
        });
      }

      return text;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('bhargava-gpt-chats');
      const savedActiveId = localStorage.getItem('bhargava-gpt-active-id');

      if (savedChats) {
        setChats(JSON.parse(savedChats));
      }
      if (savedActiveId) {
        setActiveChatId(JSON.parse(savedActiveId));
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bhargava-gpt-chats', JSON.stringify(chats));
      localStorage.setItem('bhargava-gpt-active-id', JSON.stringify(activeChatId));
      localStorage.setItem('bhargava-gpt-language', language);
    } catch (error) {
      console.error("Failed to save to local storage:", error);
    }
  }, [chats, activeChatId, language]);

  const activeChat = useMemo(() => {
    return chats.find(c => c.id === activeChatId);
  }, [chats, activeChatId]);

  useEffect(() => {
    if (activeChat) {
        setActiveCognitiveState(activeChat.cognitiveState);
    } else {
        setActiveCognitiveState('focused');
    }
  }, [activeChat]);

  const handleCognitiveStateChange = useCallback((newState: CognitiveState) => {
    setActiveCognitiveState(newState);
    if (activeChatId) {
        setChats(prev => prev.map(c => c.id === activeChatId ? {...c, cognitiveState: newState} : c));
    }
  }, [activeChatId]);

  const handleModelChange = useCallback((modelId: string) => {
    if (activeChatId) {
        setChats(prev => prev.map(c => c.id === activeChatId ? {...c, modelId: modelId} : c));
    }
  }, [activeChatId]);

  const handleSendMessage = useCallback(async (
    text: string, 
    attachment: Attachment | null = null
  ) => {
    if (!text.trim() && !attachment) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      attachment: attachment || undefined,
    };
    
    let currentChatId = activeChatId;
    let historyForAPI: ChatMessage[] = [];
    let systemInstruction: string | undefined;
    let modelIdForApi: string;

    if (!currentChatId) {
      modelIdForApi = routeModel(text, attachment);
      currentChatId = Date.now().toString();
      const titleText = text.trim() || (attachment?.name ?? "Attachment");
      const newChat: Chat = {
        id: currentChatId,
        title: titleText.substring(0, 40) + (titleText.length > 40 ? '...' : ''),
        messages: [userMessage],
        modelId: modelIdForApi,
        cognitiveState: activeCognitiveState,
      };
      setChats(prev => [...prev, newChat]);
      setActiveChatId(currentChatId);
      systemInstruction = getSystemInstruction(newChat.personaId, newChat.customInstruction);
    } else {
      const currentChat = chats.find(c => c.id === currentChatId);
      if (!currentChat) return;
      historyForAPI = currentChat.messages || [];
      systemInstruction = getSystemInstruction(currentChat.personaId, currentChat.customInstruction);
      modelIdForApi = currentChat.modelId;
      setChats(prev =>
        prev.map(c =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, userMessage], cognitiveState: activeCognitiveState }
            : c
        )
      );
    }

    setIsLoading(true);

    try {
      const aiResponse: AiResponse = await runChat(
        text,
        historyForAPI,
        language,
        systemInstruction,
        modelIdForApi,
        modelManager.downloadedModels,
        activeCognitiveState,
        t,
        attachment || undefined
      );

      const aiMessage: ChatMessage = {
        id: `${Date.now()}-ai`,
        text: aiResponse.text,
        sender: 'ai',
        attachment: aiResponse.attachment,
        cognitiveState: activeCognitiveState,
        groundingChunks: aiResponse.groundingChunks,
      };

      setChats(prev =>
        prev.map(c =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    } catch (error) {
      console.error("Error during chat execution:", error);
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        text: t('error_app_general'),
        sender: 'ai',
      };
      setChats(prev =>
        prev.map(c =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, errorMessage] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, chats, language, modelManager.downloadedModels, activeCognitiveState, t]);

  const handleAnalyzeResponse = useCallback(async (messageId: string, lens: CognitiveState) => {
    if (!activeChat) return;

    const messageToAnalyze = activeChat.messages.find(m => m.id === messageId);
    if (!messageToAnalyze || messageToAnalyze.sender !== 'ai') {
        console.error(t('analysisError'));
        return;
    }

    setAnalyzingMessageId(messageId);
    setIsLoading(true);

    try {
        const analysisResponse = await runAnalysis(messageToAnalyze, lens, language, t);

        const analysisMessage: ChatMessage = {
            id: `${Date.now()}-analysis`,
            text: analysisResponse.text,
            sender: 'ai',
            isAnalysis: true,
            analysisForId: messageId,
            cognitiveState: lens,
        };

        setChats(prev => prev.map(c =>
            c.id === activeChat.id
                ? { ...c, messages: [...c.messages, analysisMessage] }
                : c
        ));
    } catch (error) {
        console.error("Error during analysis:", error);
    } finally {
        setIsLoading(false);
        setAnalyzingMessageId(null);
    }
}, [activeChat, language, t]);


  const voiceAssistant = useVoiceAssistant({
    onTranscriptReady: (transcript) => {
        handleSendMessage(transcript, null);
    },
    onError: (error) => {
        console.error("Voice assistant error:", error);
        if (activeChatId) {
            const errorMessage: ChatMessage = {
                id: `${Date.now()}-error`,
                text: error,
                sender: 'ai',
            };
            setChats(prev =>
                prev.map(c =>
                    c.id === activeChatId
                        ? { ...c, messages: [...c.messages, errorMessage] }
                        : c
                )
            );
        }
    },
    language: language,
    t: t,
  });

  const handleVoiceClick = () => {
      if (voiceAssistant.isListening) {
          voiceAssistant.stopListening();
      } else {
          voiceAssistant.startListening();
      }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const handleDeleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };
  
  const handleSettingsChange = useCallback((settings: { personaId?: string; customInstruction?: string; }) => {
    if (!activeChatId) return;

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const updatedChat = { ...c };
        if (settings.personaId !== undefined) {
          updatedChat.personaId = settings.personaId;
          updatedChat.customInstruction = undefined;
        }
        if (settings.customInstruction !== undefined) {
          updatedChat.customInstruction = settings.customInstruction;
          updatedChat.personaId = undefined;
        }
        return updatedChat;
      }
      return c;
    }));
  }, [activeChatId]);

  const handlePromptSelected = (prompt: string) => {
    setIsPromptLibraryOpen(false);
    handleSendMessage(prompt);
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onManageModels={() => setIsModelManagerOpen(true)}
        onPromptLibrary={() => setIsPromptLibraryOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        t={t}
      />
      <div className="flex-1 flex flex-col relative">
        <Header 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            language={language}
            onLanguageChange={handleLanguageChange}
            t={t}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              <PersonaHeader 
                chat={activeChat}
                onSettingsChange={handleSettingsChange}
                onModelChange={handleModelChange}
                downloadedModels={modelManager.downloadedModels}
                t={t}
              />
              <ChatWindow 
                messages={activeChat.messages} 
                isLoading={isLoading}
                loadingState={activeCognitiveState}
                onAnalyze={handleAnalyzeResponse}
                analyzingMessageId={analyzingMessageId}
                t={t}
              />
            </>
          ) : (
            <WelcomeScreen 
              onPromptClick={handleSendMessage} 
              onLibraryClick={() => setIsPromptLibraryOpen(true)}
              t={t} 
            />
          )}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            isListening={voiceAssistant.isListening}
            onVoiceClick={handleVoiceClick}
            transcript={voiceAssistant.transcript}
            cognitiveState={activeCognitiveState}
            onCognitiveStateChange={handleCognitiveStateChange}
            t={t}
          />
        </main>
      </div>
      {isModelManagerOpen && (
        <ModelManagerModal 
            isOpen={isModelManagerOpen}
            onClose={() => setIsModelManagerOpen(false)}
            modelManager={modelManager}
            t={t}
        />
      )}
      {isPromptLibraryOpen && (
        <PromptLibraryModal
            isOpen={isPromptLibraryOpen}
            onClose={() => setIsPromptLibraryOpen(false)}
            onSelectPrompt={handlePromptSelected}
            t={t}
        />
      )}
    </div>
  );
};

export default App;
