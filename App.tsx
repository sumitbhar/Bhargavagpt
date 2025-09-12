
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ChatMessage, Chat } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import PersonaHeader from './components/PersonaHeader';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { runChat } from './services/geminiService';
import { translations } from './translations';
import { PERSONAS, DEFAULT_PERSONA_ID, getSystemInstruction } from './personas';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<string>(localStorage.getItem('bhargava-gpt-language') || 'en-US');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Helper function for translations with a fallback to English
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

  // Load speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    // The 'voiceschanged' event is fired when the list of supported voices is ready
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // For browsers that load voices instantly

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);


  // Load chats from local storage on initial render
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
      console.error("Failed to load chats from local storage:", error);
    }
  }, []);

  // Save chats and language to local storage whenever they change
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

  const baseSpeak = useCallback((text: string, lang: string, onEnd: () => void = () => {}) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis API is not supported in this browser.');
        onEnd();
        return;
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = onEnd;
      utterance.onerror = (event) => {
          if (event.error === 'interrupted') {
            console.log("Speech synthesis was interrupted.");
          } else {
            console.error('Speech synthesis error:', event.error);
          }
          onEnd();
      };

      // Find a suitable female voice
      const femaleVoices = voices.filter(voice => {
          const name = voice.name.toLowerCase();
          // Common keywords for female voices across different platforms
          return name.includes('female') || name.includes('samantha') || name.includes('zira') || name.includes('femenino');
      });

      // 1. Try to find a female voice for the specific language (e.g., 'en-US')
      let selectedVoice = femaleVoices.find(voice => voice.lang === lang);

      // 2. If not found, try for the base language (e.g., 'en' for 'en-US')
      if (!selectedVoice) {
          const baseLang = lang.split('-')[0];
          selectedVoice = femaleVoices.find(voice => voice.lang.startsWith(baseLang));
      }

      // 3. If still not found, pick the first available English female voice as a fallback
      if (!selectedVoice) {
          selectedVoice = femaleVoices.find(voice => voice.lang.startsWith('en'));
      }
      
      // 4. Finally, just pick the first available female voice if no English one is found
      if (!selectedVoice) {
          selectedVoice = femaleVoices[0];
      }

      if (selectedVoice) {
          utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
  }, [voices]);

  const handleSendMessage = useCallback(async (text: string, speakCallback: (text: string, onEnd?: () => void) => void) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
    };
    
    let currentChatId = activeChatId;
    let historyForAPI: ChatMessage[] = [];
    let systemInstruction = getSystemInstruction(DEFAULT_PERSONA_ID);

    // If it's a new conversation, create it
    if (!currentChatId) {
      currentChatId = Date.now().toString();
      const newChat: Chat = {
        id: currentChatId,
        title: text.substring(0, 40) + (text.length > 40 ? '...' : ''),
        messages: [userMessage],
        personaId: DEFAULT_PERSONA_ID,
      };
      setChats(prev => [...prev, newChat]);
      setActiveChatId(currentChatId);
    } else { // Add to existing conversation
      const currentChat = chats.find(c => c.id === currentChatId);
      historyForAPI = currentChat?.messages || [];
      systemInstruction = getSystemInstruction(currentChat?.personaId, currentChat?.customInstruction);

      setChats(prev => prev.map(c => 
        c.id === currentChatId ? { ...c, messages: [...c.messages, userMessage] } : c
      ));
    }

    setIsLoading(true);

    let aiResponseText = '';
    try {
        aiResponseText = await runChat(text.trim(), historyForAPI, language, systemInstruction);
    } catch (error) {
        console.error("Error calling runChat:", error);
        aiResponseText = "An error occurred while getting a response. Please check the console for details."
    }
    
    // Immediately add the AI message to the chat so it's visible while speaking
    const aiMessage: ChatMessage = {
      id: `${Date.now()}-ai`,
      text: aiResponseText,
      sender: 'ai',
    };

    setChats(prev => prev.map(c => 
      c.id === currentChatId ? { ...c, messages: [...c.messages, aiMessage] } : c
    ));
    setIsLoading(false);
    
    // Use the callback to speak the text. isLoading is already false.
    speakCallback(aiResponseText);

  }, [activeChatId, chats, language]);

  const handleVoiceError = useCallback((errorText: string) => {
      const errorMessage: ChatMessage = {
          id: `${Date.now()}-error`,
          text: `Voice Assistant Error: ${errorText}`,
          sender: 'ai',
      };
       if (activeChatId) {
          setChats(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, messages: [...c.messages, errorMessage] } : c
          ));
       }
  }, [activeChatId]);

  const { isListening, isSpeaking, startListening, stopListening, speak } = useVoiceAssistant({
    onTranscriptReady: (transcript) => handleSendMessage(transcript, speak),
    onError: handleVoiceError,
    speak: (text, onEnd) => baseSpeak(text, language, onEnd),
    language,
  });

  const handleTextSendMessage = (text: string) => {
    // When sending text, we don't want the AI response to be spoken aloud.
    // So we pass a dummy speak function that does nothing.
    // FIX: The previous implementation called baseSpeak with incorrect arguments and
    // contradicted this comment. It's now fixed to pass a function that does nothing,
    // preventing the AI response from being spoken for text-based messages.
    handleSendMessage(text, () => {});
  };
  
  const handleNewChat = () => {
    setActiveChatId(null);
    setIsSidebarOpen(false); // Close sidebar on mobile after starting new chat
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };
  
  const handleDeleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
        setActiveChatId(null);
    }
  };

  const handleUpdateChatPersona = (personaId?: string, customInstruction?: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
            return {
                ...c,
                personaId: personaId,
                // Ensure custom instruction is cleared if a persona is selected
                customInstruction: personaId ? undefined : customInstruction
            };
        }
        return c;
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-transparent text-white font-sans">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        language={language}
        onLanguageChange={setLanguage}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            t={t}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              <PersonaHeader 
                chat={activeChat}
                onPersonaChange={handleUpdateChatPersona}
                t={t}
              />
              <ChatWindow messages={activeChat.messages} isLoading={isLoading} />
            </>
          ) : (
            <WelcomeScreen onPromptClick={handleTextSendMessage} t={t} />
          )}
          <ChatInput
            onSendMessage={handleTextSendMessage}
            isLoading={isLoading}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isVoiceLoading={isLoading && !isListening && !isSpeaking}
            onVoiceClick={() => isListening ? stopListening() : startListening()}
            t={t}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
