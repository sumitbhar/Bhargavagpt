import React, { useState, useRef, useEffect } from 'react';

// Icon components for different voice states
const IdleIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const ListeningIcon = () => (
    <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
);
const SpeakingIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8V6c0-2.21 1.79-4 4-4s4 1.79 4 4v2h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1zm4-2c-1.1 0-2 .9-2 2v2h4V8c0-1.1-.9-2-2-2zm4 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
);
const LoadingIcon = () => (
    <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceLoading: boolean;
  onVoiceClick: () => void;
  t: (key: string) => string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  isListening,
  isSpeaking,
  isVoiceLoading,
  onVoiceClick,
  t,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  let voiceIcon;
  let voiceButtonClass = '';
  let voiceAriaLabel = '';
  const isVoiceDisabled = isLoading || isSpeaking || isVoiceLoading;

  if (isListening) {
    voiceIcon = <ListeningIcon />;
    voiceAriaLabel = t('stopListening');
    voiceButtonClass = 'bg-red-600 hover:bg-red-500';
  } else if (isVoiceLoading) {
    voiceIcon = <LoadingIcon />;
    voiceAriaLabel = t('thinking');
    voiceButtonClass = 'bg-blue-600';
  } else if (isSpeaking) {
    voiceIcon = <SpeakingIcon />;
    voiceAriaLabel = t('speaking');
    voiceButtonClass = 'bg-green-600';
  } else {
    voiceIcon = <IdleIcon />;
    voiceAriaLabel = t('tapToSpeak');
    voiceButtonClass = 'bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90';
  }


  return (
    <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t('typeYourMessage')}
          rows={1}
          className="flex-1 bg-gray-800/80 border border-gray-600/80 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none max-h-40"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button
          type="button"
          onClick={onVoiceClick}
          className={`text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-lg ${voiceButtonClass}`}
          disabled={isVoiceDisabled}
          aria-label={voiceAriaLabel}
        >
          {voiceIcon}
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shrink-0 shadow-lg"
          disabled={isLoading || !input.trim()}
          aria-label={t('sendMessage')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      <p className="text-center text-xs text-gray-500 mt-2">
        {t('disclaimer')}
      </p>
      <p className="text-center text-xs text-gray-500 mt-1">
        {t('developedBy')}
      </p>
    </div>
  );
};

export default ChatInput;