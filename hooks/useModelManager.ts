import { useState, useEffect, useCallback, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'bhargava-gpt-downloaded-models';

export const useModelManager = () => {
  const [downloadedModels, setDownloadedModels] = useState<Set<string>>(new Set());
  const [downloadingModels, setDownloadingModels] = useState<Map<string, number>>(new Map());
  const [cancelingModels, setCancelingModels] = useState<Set<string>>(new Set());
  const [downloadErrors, setDownloadErrors] = useState<Map<string, string>>(new Map());
  const downloadIntervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const downloadAttemptsRef = useRef<Map<string, number>>(new Map());

  // Load downloaded models from local storage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setDownloadedModels(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error("Failed to load downloaded models from local storage:", error);
    }
    // Cleanup any running intervals on component unmount
    return () => {
        downloadIntervalsRef.current.forEach(intervalId => clearInterval(intervalId));
    };
  }, []);

  // Persist downloaded models to local storage whenever they change
  const persistDownloadedModels = (models: Set<string>) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(models)));
    } catch (error) {
      console.error("Failed to save downloaded models to local storage:", error);
    }
  };

  const downloadModel = useCallback((modelId: string) => {
    if (downloadedModels.has(modelId) || downloadingModels.has(modelId)) {
      return;
    }
    
    // Increment attempt counter for retry logic; failures become less likely on retries.
    const attempt = (downloadAttemptsRef.current.get(modelId) || 0) + 1;
    downloadAttemptsRef.current.set(modelId, attempt);

    // Clear previous errors for this model on new download attempt
    setDownloadErrors(prev => {
        const newMap = new Map(prev);
        if (newMap.has(modelId)) {
            newMap.delete(modelId);
            return newMap;
        }
        return prev;
    });

    // Simulate download progress
    let progress = 0;
    setDownloadingModels(prev => new Map(prev).set(modelId, progress));

    const interval = setInterval(() => {
      // Simulate random failure - less likely on subsequent retries.
      const failureChance = 0.3 / attempt; // 30% on 1st try, 15% on 2nd, etc.
      if (progress > 20 && Math.random() < failureChance) {
        clearInterval(interval);
        downloadIntervalsRef.current.delete(modelId);
        
        setDownloadingModels(prev => {
          const newMap = new Map(prev);
          newMap.delete(modelId);
          return newMap;
        });
        
        setDownloadErrors(prev => new Map(prev).set(modelId, 'modelStatusFailed'));
        return;
      }

      progress += 20; // Simulate 20% progress every 500ms
      if (progress <= 100) {
        setDownloadingModels(prev => new Map(prev).set(modelId, progress));
      }

      if (progress >= 100) {
        clearInterval(interval);
        downloadIntervalsRef.current.delete(modelId);
        downloadAttemptsRef.current.delete(modelId); // Reset on success
        
        // Finalize download
        setDownloadingModels(prev => {
          const newMap = new Map(prev);
          newMap.delete(modelId);
          return newMap;
        });
        
        setDownloadedModels(prev => {
          const newSet = new Set(prev);
          newSet.add(modelId);
          persistDownloadedModels(newSet);
          return newSet;
        });
      }
    }, 500);

    downloadIntervalsRef.current.set(modelId, interval);
  }, [downloadedModels, downloadingModels]);

  const cancelDownload = useCallback((modelId: string) => {
    // Show the canceling state in the UI
    setCancelingModels(prev => new Set(prev).add(modelId));
    
    // Stop the download interval
    const intervalId = downloadIntervalsRef.current.get(modelId);
    if (intervalId) {
        clearInterval(intervalId);
        downloadIntervalsRef.current.delete(modelId);
    }

    // Reset download attempts for this model
    downloadAttemptsRef.current.delete(modelId);

    // Remove the model from the list of downloading models
    setDownloadingModels(prev => {
        const newMap = new Map(prev);
        newMap.delete(modelId);
        return newMap;
    });

    // Remove from the canceling state after a short delay for UI feedback
    setTimeout(() => {
        setCancelingModels(prev => {
            const newSet = new Set(prev);
            newSet.delete(modelId);
            return newSet;
        });
    }, 1000);
  }, []);

  const deleteModel = useCallback((modelId: string) => {
    setDownloadedModels(prev => {
      const newSet = new Set(prev);
      newSet.delete(modelId);
      persistDownloadedModels(newSet);
      return newSet;
    });
    // Also clear any stored attempts for the deleted model
    downloadAttemptsRef.current.delete(modelId);
  }, []);

  return {
    downloadedModels,
    downloadingModels,
    cancelingModels,
    downloadErrors,
    downloadModel,
    deleteModel,
    cancelDownload,
  };
};
