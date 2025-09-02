import React from 'react';
import type { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onClose, t }) => {

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectChat from firing
    if(window.confirm(t('deleteConfirmation'))) {
        onDeleteChat(id);
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <aside className={`absolute md:relative z-40 flex flex-col w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 text-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-gray-700/80 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('chatHistory')}</h2>
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-700"
            aria-label="Close menu"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>
        <div className="p-2">
            <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700/80 rounded-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-all"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('newChat')}
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.slice().reverse().map((chat) => (
            <a
              key={chat.id}
              href="#"
              onClick={(e) => {
                  e.preventDefault();
                  onSelectChat(chat.id)
              }}
              className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md transition-colors ${
                activeChatId === chat.id
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="truncate">{chat.title}</span>
              <button
                onClick={(e) => handleDelete(e, chat.id)} 
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-opacity"
                aria-label={`Delete chat: ${chat.title}`}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
              </button>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;