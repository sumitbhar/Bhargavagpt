
import React, { useState, useRef, useEffect } from 'react';
import type { Attachment, CognitiveState } from '../types';
import CognitiveStateSelector from './CognitiveStateSelector';

const IdleIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const ListeningIcon = () => (
    <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
);

const AttachmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);
const GenericFileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

interface ChatInputProps {
  onSendMessage: (message: string, attachment: Attachment | null) => void;
  isLoading: boolean;
  isListening: boolean;
  onVoiceClick: () => void;
  t: (key: string) => string;
  transcript?: string;
  cognitiveState: CognitiveState;
  onCognitiveStateChange: (state: CognitiveState) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  isListening,
  onVoiceClick,
  t,
  transcript,
  cognitiveState,
  onCognitiveStateChange,
}) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isListening && transcript !== undefined) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setAttachment({
          data: base64String,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachment) && !isLoading) {
      onSendMessage(input.trim(), attachment);
      setInput('');
      handleRemoveAttachment();
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

  if (isListening) {
    voiceIcon = <ListeningIcon />;
    voiceAriaLabel = t('stopListening');
    voiceButtonClass = 'bg-red-600 hover:bg-red-500';
  } else {
    voiceIcon = <IdleIcon />;
    voiceAriaLabel = t('tapToSpeak');
    voiceButtonClass = 'bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90';
  }

  return (
    <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <CognitiveStateSelector
            currentState={cognitiveState}
            onChange={onCognitiveStateChange}
            t={t}
        />
        {attachment && (
          <div className="mt-3 p-2 bg-gray-700/60 rounded-lg flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-2 overflow-hidden">
              {attachment.mimeType.startsWith('image/') ? (
                <img src={`data:${attachment.mimeType};base64,${attachment.data}`} alt={attachment.name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded">
                  <GenericFileIcon />
                </div>
              )}
              <span className="text-sm text-gray-200 truncate">{attachment.name}</span>
            </div>
            <button 
              onClick={handleRemoveAttachment} 
              className="p-1 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white"
              aria-label={t('removeAttachment')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end space-x-3 mt-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800/80 hover:bg-gray-700/90 transition-all duration-200 shrink-0 shadow-lg"
              disabled={isLoading}
              aria-label={t('attachFile')}
          >
              <AttachmentIcon />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('typeYourMessage')}
            rows={1}
            className="flex-1 bg-gray-800/80 border border-gray-600/80 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none max-h-40"
            disabled={isLoading}
            aria-label={t('chatInput')}
          />
          <button
            type="button"
            onClick={onVoiceClick}
            className={`text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-lg ${voiceButtonClass}`}
            disabled={isLoading}
            aria-label={voiceAriaLabel}
          >
            {voiceIcon}
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shrink-0 shadow-lg"
            disabled={isLoading || (!input.trim() && !attachment)}
            aria-label={t('sendMessage')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
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
