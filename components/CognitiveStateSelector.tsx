
import React from 'react';
import type { CognitiveState } from '../types';

interface CognitiveStateSelectorProps {
  currentState: CognitiveState;
  onChange: (state: CognitiveState) => void;
  t: (key: string) => string;
}

const states: { id: CognitiveState; icon: string; }[] = [
    { id: 'focused', icon: '🎯' },
    { id: 'creative', icon: '✨' },
    { id: 'critical', icon: '🧐' },
    { id: 'synthetic', icon: '🔄' },
];

const CognitiveStateSelector: React.FC<CognitiveStateSelectorProps> = ({ currentState, onChange, t }) => {
  return (
    <div className="flex flex-col items-center mb-3">
        <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{t('cognitiveState')}</label>
        <div className="p-1 bg-gray-900/50 rounded-lg flex space-x-1 w-full max-w-sm mx-auto">
            {states.map(state => (
                <button
                    key={state.id}
                    onClick={() => onChange(state.id)}
                    className={`group relative px-4 py-2 text-sm font-medium rounded-md flex-1 transition-all duration-300 ease-in-out focus:outline-none ${
                        currentState === state.id 
                            ? 'bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white' 
                            : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
                    }`}
                    aria-pressed={currentState === state.id}
                >
                    <span className="flex items-center justify-center gap-2">
                        <span>{state.icon}</span>
                        <span className="hidden sm:inline">{t(`cognitiveState_${state.id}`)}</span>
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-semibold text-white bg-gray-900/80 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 backdrop-blur-sm">
                        <p className="font-bold text-sm">{t(`cognitiveState_${state.id}`)}</p>
                        <p className="text-gray-300">{t(`cognitiveState_${state.id}_desc`)}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default CognitiveStateSelector;
