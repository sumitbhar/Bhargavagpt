
import React from 'react';
import { APP_NAME } from '../constants';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';

interface HeaderProps {
    onMenuClick: () => void;
    language: string;
    onLanguageChange: (languageCode: string) => void;
    t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, language, onLanguageChange, t }) => {
  return (
    <header className="p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm flex justify-between items-center z-20 shrink-0">
      <div className="flex items-center space-x-3">
        <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
            aria-label={t('toggleMenu')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <Logo className="w-8 h-8" />
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
            {APP_NAME}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <LanguageSelector selectedLanguage={language} onSelectLanguage={onLanguageChange} t={t} />
      </div>
    </header>
  );
};

export default Header;