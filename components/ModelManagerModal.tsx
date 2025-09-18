import React from 'react';
import { MODELS } from '../constants';
import type { useModelManager } from '../hooks/useModelManager';
import type { LlmModel } from '../types';

type ModelManager = ReturnType<typeof useModelManager>;

interface ModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelManager: ModelManager;
  t: (key: string) => string;
}

const ModelManagerModal: React.FC<ModelManagerModalProps> = ({ isOpen, onClose, modelManager, t }) => {
    if (!isOpen) return null;

    const { downloadedModels, downloadingModels, cancelingModels, downloadModel, deleteModel, cancelDownload, downloadErrors } = modelManager;

    const getModelStatus = (modelId: string) => {
        if (downloadErrors.has(modelId)) return 'error';
        if (cancelingModels.has(modelId)) return 'canceling';
        if (downloadedModels.has(modelId)) return 'downloaded';
        if (downloadingModels.has(modelId)) return 'downloading';
        return 'not-downloaded';
    };

    const handleExportModel = (model: LlmModel) => {
        const modelData = JSON.stringify({
            id: model.id,
            name: t(model.name),
            provider: t(model.provider),
            exportedAt: new Date().toISOString(),
        }, null, 2);

        const blob = new Blob([modelData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${model.id.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h2 className="text-xl font-bold text-white">{t('manageModelsTitle')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('close')}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {MODELS.map(model => {
                        const status = getModelStatus(model.id);
                        const progress = downloadingModels.get(model.id) || 0;
                        const error = downloadErrors.get(model.id);
                        
                        return (
                            <div key={model.id} className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        {t(model.name)}
                                        {status === 'downloaded' && (
                                            <span className="text-xs bg-green-600 text-white font-bold py-0.5 px-2 rounded-full">
                                                {t('modelStatusOffline')}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-400">{t(model.provider)}</p>
                                </div>
                                <div className="min-w-[12rem] flex justify-end items-center">
                                    {!model.isDownloadable ? (
                                        <span className="text-sm text-gray-500 italic">{t('modelStatusOnlineOnly')}</span>
                                    ) : (
                                        <>
                                            {status === 'not-downloaded' && (
                                                <button 
                                                    onClick={() => downloadModel(model.id)}
                                                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    {t('modelActionDownload')}
                                                </button>
                                            )}
                                            {status === 'downloading' && (
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="flex-grow">
                                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                            <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-mono w-9 text-right">{progress}%</span>
                                                    <button 
                                                        onClick={() => cancelDownload(model.id)}
                                                        className="p-1 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
                                                        aria-label={t('modelActionCancelDownload')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            {status === 'canceling' && (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-400 italic">{t('modelStatusCanceling')}</p>
                                                </div>
                                            )}
                                            {status === 'downloaded' && (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleExportModel(model)}
                                                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2"
                                                        title={t('modelActionExport')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        {t('modelActionExport')}
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteModel(model.id)}
                                                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        {t('modelActionDelete')}
                                                    </button>
                                                </div>
                                            )}
                                            {status === 'error' && (
                                                <div className="flex items-center justify-end gap-2 text-right">
                                                    <span className="text-sm text-red-400">{error && t(error)}</span>
                                                    <button 
                                                        onClick={() => downloadModel(model.id)}
                                                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-500 text-white transition-colors flex items-center gap-1 shrink-0"
                                                        aria-label={t('modelActionRetry')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M5.29 19.71A8.962 8.962 0 0112 3c4.97 0 9 4.03 9 9s-4.03 9-9 9a8.962 8.962 0 01-6.71-3.29" /></svg>
                                                        {t('modelActionRetry')}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-5 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors">{t('close')}</button>
                </div>
            </div>
        </div>
    );
};

export default ModelManagerModal;