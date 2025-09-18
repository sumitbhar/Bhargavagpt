import React, { useState, useMemo } from 'react';
import { PROMPT_LIBRARY, PromptCategory } from '../prompts';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  t: (key: string) => string;
}

const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({ isOpen, onClose, onSelectPrompt, t }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<PromptCategory | 'all'>('all');

    const categories = useMemo(() => {
        return ['all', ...Object.values(PromptCategory)];
    }, []);
    
    const filteredPrompts = useMemo(() => {
        return PROMPT_LIBRARY.filter(prompt => {
            const matchesCategory = activeCategory === 'all' || prompt.category === activeCategory;
            const matchesSearch = 
                t(prompt.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
                t(prompt.description).toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory, t]);

    if (!isOpen) return null;

    const handleSelect = (promptTemplateKey: string) => {
        onSelectPrompt(t(promptTemplateKey));
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[85vh] animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700/50 shrink-0">
                    <h2 className="text-xl font-bold text-white">{t('promptLibrary')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('close')}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-700/50 shrink-0">
                    <div className="relative mb-3">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPrompts')}
                            className="w-full bg-gray-900/70 border border-gray-600/80 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            aria-label={t('searchPrompts')}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category as any)}
                                className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap transition-colors shrink-0 ${
                                    activeCategory === category
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                }`}
                            >
                                {category === 'all' ? t('allCategories') : t(category)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prompt List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPrompts.map(prompt => (
                            <button
                                key={prompt.id}
                                onClick={() => handleSelect(prompt.template)}
                                className="bg-gray-900/50 p-4 rounded-lg text-left border border-gray-700/50 hover:border-orange-500/80 hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 flex flex-col justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-gray-100">{t(prompt.title)}</p>
                                    <p className="text-sm text-gray-400 mt-1">{t(prompt.description)}</p>
                                </div>
                                <span className="mt-3 text-xs font-semibold uppercase text-pink-400">{t(prompt.category)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptLibraryModal;