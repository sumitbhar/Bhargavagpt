
import React, { useRef, useEffect } from 'react';
import type { CognitiveState } from '../types';

interface AnalysisPopoverProps {
  onSelect: (lens: CognitiveState) => void;
  onClose: () => void;
  t: (key: string) => string;
}

const lenses: { id: CognitiveState; icon: string; }[] = [
    { id: 'focused', icon: '🎯' },
    { id: 'creative', icon: '✨' },
    { id: 'critical', icon: '🧐' },
    { id: 'synthetic', icon: '🔄' },
];

const AnalysisPopover: React.FC<AnalysisPopoverProps> = ({ onSelect, onClose, t }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-2 z-20 animate-fade-in-up"
      role="dialog"
      aria-labelledby="analysis-popover-title"
    >
      <h3 id="analysis-popover-title" className="px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">{t('selectAnalysisLens')}</h3>
      <div className="mt-1 space-y-1">
        {lenses.map(lens => (
          <button
            key={lens.id}
            onClick={() => onSelect(lens.id)}
            className="w-full flex items-center gap-3 text-left px-2 py-1.5 text-sm text-gray-200 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
          >
            <span className="text-lg">{lens.icon}</span>
            <div className="flex-1">
                <p className="font-semibold">{t(`cognitiveState_${lens.id}`)}</p>
                <p className="text-xs text-gray-400">{t(`cognitiveState_${lens.id}_desc`)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPopover;
