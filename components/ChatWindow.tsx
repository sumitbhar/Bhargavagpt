
import React, { useEffect, useRef } from 'react';
import type { ChatMessage, CognitiveState } from '../types';
import Message from './Message';
import CognitiveFlow from './CognitiveFlow';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  loadingState: CognitiveState;
  t: (key: string, params?: Record<string, string>) => string;
  onAnalyze: (messageId: string, lens: CognitiveState) => void;
  analyzingMessageId: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, loadingState, t, onAnalyze, analyzingMessageId }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
        {messages.map((msg) => (
            <Message 
              key={msg.id} 
              message={msg} 
              t={t}
              onAnalyze={onAnalyze}
              isAnalyzing={analyzingMessageId === msg.id}
            />
        ))}
        {isLoading && !analyzingMessageId && (
            <CognitiveFlow state={loadingState} t={t} />
        )}
        <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
