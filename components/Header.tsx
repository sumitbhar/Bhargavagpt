import React from 'react';
import { APP_NAME } from '../constants';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
    onMenuClick: () => void;
    language: string;
    onLanguageChange: (languageCode: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, language, onLanguageChange }) => {
  return (
    <header className="p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm flex justify-between items-center z-20 shrink-0">
      <div className="flex items-center space-x-3">
        <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
            aria-label="Toggle menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
            B
        </div>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
            {APP_NAME}
        </h1>
      </div>
      <div className="flex items-center">
        <LanguageSelector selectedLanguage={language} onSelectLanguage={onLanguageChange} />
      </div>
    </header>
  );
};

export default Header;