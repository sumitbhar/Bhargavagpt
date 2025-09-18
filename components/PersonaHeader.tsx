
import React, { useState, useMemo } from 'react';
import type { Chat } from '../types';
import { PERSONAS, DEFAULT_PERSONA_ID } from '../personas';
import PersonaModal from './PersonaModal';
import ModelDisplay from './ModelDisplay';

interface PersonaHeaderProps {
    chat: Chat;
    onSettingsChange: (settings: { personaId?: string; customInstruction?: string }) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const PersonaHeader: React.FC<PersonaHeaderProps> = ({ chat, onSettingsChange, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentPersona = useMemo(() => {
        if (chat.customInstruction) {
            return {
                id: 'custom',
                name: t('customInstruction'),
                icon: '🛠️'
            };
        }
        return PERSONAS.find(p => p.id === (chat.personaId || DEFAULT_PERSONA_ID)) || PERSONAS[0];
    }, [chat.personaId, chat.customInstruction, t]);
    
    const handlePersonaSave = (personaId?: string, customInstruction?: string) => {
        onSettingsChange({ personaId, customInstruction });
    };
    
    const cognitiveStateInfo = {
        focused: { icon: '🎯', name: t('cognitiveState_focused') },
        creative: { icon: '✨', name: t('cognitiveState_creative') },
        critical: { icon: '🧐', name: t('cognitiveState_critical') },
        synthetic: { icon: '🔄', name: t('cognitiveState_synthetic') },
    }[chat.cognitiveState];


    return (
        <>
            <div className="p-3 border-b border-gray-700/50 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center gap-3 text-sm z-10">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/70 px-3 py-1.5 rounded-lg"
                    aria-label={t('currentPersona', { name: t(currentPersona.name) })}
                >
                    <span className="text-lg">{currentPersona.icon}</span>
                    <span className="font-medium">{t(currentPersona.name)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                 <div
                    className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg cursor-default"
                    title={`${t('cognitiveState')}: ${cognitiveStateInfo.name}`}
                 >
                    <span className="text-lg">{cognitiveStateInfo.icon}</span>
                    <span className="font-medium">{cognitiveStateInfo.name}</span>
                </div>

                <ModelDisplay 
                    activeModelId={chat.modelId}
                />
            </div>
            {isModalOpen && (
                <PersonaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handlePersonaSave}
                    currentPersonaId={chat.personaId}
                    currentCustomInstruction={chat.customInstruction}
                    t={t}
                />
            )}
        </>
    );
};

export default PersonaHeader;
