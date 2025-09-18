
import React, { useState, useRef, useEffect } from 'react';
import { MODELS } from '../constants';

interface ModelSelectorProps {
  activeModelId: string;
  onModelChange: (modelId: string) => void;
  downloadedModels: Set<string>;
  t: (key: string) => string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ activeModelId, onModelChange, downloadedModels, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeModel = MODELS.find(m => m.id === activeModelId) || MODELS[0];

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/70 px-3 py-1.5 rounded-lg w-full justify-between"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="font-medium truncate">{activeModel.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1 max-h-72 overflow-y-auto" role="none">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={`${
                  activeModelId === model.id ? 'bg-orange-600 text-white' : 'text-gray-300'
                } group flex w-full items-center px-4 py-2 text-sm hover:bg-orange-500 hover:text-white text-left`}
                role="menuitem"
              >
                <div className="flex-1">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-xs opacity-80">{model.provider}</p>
                </div>
                {downloadedModels.has(model.id) && (
                    <span className="ml-2 text-xs bg-green-600 text-white font-bold py-0.5 px-2 rounded-full">
                        Offline
                    </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
