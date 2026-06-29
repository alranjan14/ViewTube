import { useCallback } from 'react';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../config/storage';
import { VideoSummary } from '../types/api';
import { useLocalStorage } from './useLocalStorage';

export const useLibrary = () => {
  const [history, setHistory] = useLocalStorage<VideoSummary[]>(
    STORAGE_KEYS.history,
    []
  );
  const [watchLater, setWatchLater] = useLocalStorage<VideoSummary[]>(
    STORAGE_KEYS.watchLater,
    []
  );

  const addToHistory = useCallback(
    (video: VideoSummary) => {
      setHistory((prev) => {
        // Remove if already exists to put it at the top
        const filtered = prev.filter((v) => v.id !== video.id);
        return [video, ...filtered].slice(0, STORAGE_LIMITS.history);
      });
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const addToWatchLater = useCallback(
    (video: VideoSummary) => {
      setWatchLater((prev) => {
        if (prev.some((v) => v.id === video.id)) return prev;
        return [video, ...prev].slice(0, STORAGE_LIMITS.watchLater);
      });
    },
    [setWatchLater]
  );

  const removeFromWatchLater = useCallback(
    (videoId: string) => {
      setWatchLater((prev) => prev.filter((v) => v.id !== videoId));
    },
    [setWatchLater]
  );

  const isWatchLater = useCallback(
    (videoId: string) => watchLater.some((v) => v.id === videoId),
    [watchLater]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    watchLater,
    addToWatchLater,
    removeFromWatchLater,
    isWatchLater,
  };
};
