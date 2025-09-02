import React from 'react';

interface WelcomeScreenProps {
    onPromptClick: (prompt: string) => void;
    t: (key: string) => any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick, t }) => {
    const prompts: {title: string; description: string}[] = t('prompts');

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-3xl mb-4 shrink-0 shadow-lg">
                B
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-8">
                {t('welcomeMessage')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                {prompts.map(prompt => (
                    <button
                        key={prompt.title}
                        onClick={() => onPromptClick(`${prompt.title} ${prompt.description}`)}
                        className="bg-gray-800/60 p-4 rounded-lg text-left border border-gray-700/50 hover:border-orange-500/80 hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        aria-label={`Start chat about: ${prompt.title} ${prompt.description}`}
                    >
                        <p className="font-semibold text-gray-200">{prompt.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{prompt.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WelcomeScreen;