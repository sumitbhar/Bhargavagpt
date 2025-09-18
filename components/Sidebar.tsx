import React, { useState } from 'react';
import type { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onManageModels: () => void;
  onPromptLibrary: () => void;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    chats, 
    activeChatId, 
    onNewChat, 
    onSelectChat, 
    onDeleteChat, 
    onManageModels, 
    onPromptLibrary,
    isOpen, 
    onClose, 
    t 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectChat from firing
    if(window.confirm(t('deleteConfirmation'))) {
        onDeleteChat(id);
    }
  }
  
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            aria-label={t('close')}
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
        <div className="p-2 border-t border-b border-gray-700/80">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchChats')}
                    className="w-full bg-gray-800/80 border border-gray-600/80 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    aria-label={t('searchChats')}
                />
            </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.slice().reverse().map((chat) => (
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
                aria-label={t('deleteChat', { title: chat.title })}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
              </button>
            </a>
          ))}
        </nav>

        <div className="p-2 mt-auto border-t border-gray-700/80 space-y-2">
          <button
            onClick={onPromptLibrary}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700/80 rounded-md hover:bg-gray-600/80 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t('promptLibrary')}
          </button>
          <button
            onClick={onManageModels}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700/80 rounded-md hover:bg-gray-600/80 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('manageModels')}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;