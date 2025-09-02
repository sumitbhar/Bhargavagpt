import React, { useState, useEffect } from 'react';
import { PERSONAS } from '../personas';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personaId?: string, customInstruction?: string) => void;
  currentPersonaId?: string;
  currentCustomInstruction?: string;
  t: (key: string) => string;
}

type ActiveTab = 'presets' | 'custom';

const PersonaModal: React.FC<PersonaModalProps> = ({ isOpen, onClose, onSave, currentPersonaId, currentCustomInstruction, t }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('presets');
    const [selectedPersonaId, setSelectedPersonaId] = useState<string | undefined>(currentPersonaId);
    const [customInstruction, setCustomInstruction] = useState<string>(currentCustomInstruction || '');

    useEffect(() => {
        if (currentCustomInstruction) {
            setActiveTab('custom');
            setSelectedPersonaId(undefined);
        } else {
            setActiveTab('presets');
            setSelectedPersonaId(currentPersonaId);
        }
        setCustomInstruction(currentCustomInstruction || '');
    }, [isOpen, currentPersonaId, currentCustomInstruction]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (activeTab === 'presets') {
            onSave(selectedPersonaId, undefined);
        } else {
            onSave(undefined, customInstruction);
        }
        onClose();
    };

    const tabButtonClasses = (tab: ActiveTab) => 
      `px-4 py-2 text-sm font-medium rounded-md flex-1 transition-colors ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
      }`;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 animate-fade-in-up flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('personaModalTitle')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="mb-4 p-1 bg-gray-900/50 rounded-lg flex space-x-1">
                    <button onClick={() => setActiveTab('presets')} className={tabButtonClasses('presets')}>{t('personaPresets')}</button>
                    <button onClick={() => setActiveTab('custom')} className={tabButtonClasses('custom')}>{t('personaCustom')}</button>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
                    {activeTab === 'presets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PERSONAS.map(persona => (
                                <button
                                    key={persona.id}
                                    onClick={() => setSelectedPersonaId(persona.id)}
                                    className={`p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedPersonaId === persona.id 
                                            ? 'border-pink-500 bg-gray-700/50 shadow-lg' 
                                            : 'border-gray-700/80 bg-gray-800/50 hover:border-orange-500/50'
                                    }`}
                                >
                                    <p className="font-semibold text-gray-100 text-lg">
                                        <span className="mr-3">{persona.icon}</span>{t(persona.name)}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">{t(persona.description)}</p>
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'custom' && (
                        <div>
                            <textarea
                                value={customInstruction}
                                onChange={(e) => setCustomInstruction(e.target.value)}
                                placeholder={t('customInstructionPlaceholder')}
                                rows={8}
                                className="w-full bg-gray-900/70 border border-gray-600/80 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-y"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
                    <button onClick={onClose} className="px-5 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors">{t('cancel')}</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-md bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 transition-opacity">{t('save')}</button>
                </div>
            </div>
        </div>
    );
};

export default PersonaModal;
