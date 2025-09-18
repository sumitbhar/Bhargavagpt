import React from 'react';
import { MODELS } from '../constants';

interface ModelDisplayProps {
  activeModelId: string;
  t: (key: string, params?: Record<string, string>) => string;
}

const ModelDisplay: React.FC<ModelDisplayProps> = ({ activeModelId, t }) => {
  const activeModel = MODELS.find(m => m.id === activeModelId) || MODELS[0];

  return (
    <div
      className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg cursor-default"
      title={t('title_model_tooltip', { modelName: t(activeModel.name) })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
      <span className="font-medium truncate">{t(activeModel.name)}</span>
    </div>
  );
};

export default ModelDisplay;