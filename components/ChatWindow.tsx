
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
        {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-3 my-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="max-w-2xl px-4 py-3 rounded-lg bg-gray-700 text-gray-200 self-start">
                    <LoadingSpinner />
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;