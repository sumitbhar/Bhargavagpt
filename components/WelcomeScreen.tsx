
import React from 'react';
import Logo from './Logo';

interface WelcomeScreenProps {
    onPromptClick: (prompt: string) => void;
    onLibraryClick: () => void;
    t: (key: string, params?: Record<string, string>) => any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick, onLibraryClick, t }) => {
    const prompts: {title: string; description: string; promptKey: string}[] = t('prompts');

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 overflow-y-auto">
            <Logo className="w-16 h-16 mb-4 shrink-0 shadow-lg" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-2">
                {t('welcomeMessage')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">{t('welcomeSubtitle')}</p>

            <button
                onClick={onLibraryClick}
                className="w-full max-w-sm mb-8 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t('explorePromptLibrary')}
            </button>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                {prompts.map(prompt => (
                    <button
                        key={prompt.title}
                        onClick={() => onPromptClick(t(prompt.promptKey))}
                        className="bg-gray-800/60 p-4 rounded-lg text-left border border-gray-700/50 hover:border-orange-500/80 hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        aria-label={t('startChatAbout', { title: t(prompt.promptKey)})}
                    >
                        <p className="font-semibold text-gray-200">{t(prompt.title)}</p>
                        <p className="text-sm text-gray-400 mt-1">{t(prompt.description)}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WelcomeScreen;
