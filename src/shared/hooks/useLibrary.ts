import { useCallback } from "react";
import { VideoSummary } from "../types/api";
import { useLocalStorage } from "./useLocalStorage";

export const useLibrary = () => {
  const [history, setHistory] = useLocalStorage<VideoSummary[]>("yt_clone_history", []);
  const [watchLater, setWatchLater] = useLocalStorage<VideoSummary[]>("yt_clone_watch_later", []);

  const addToHistory = useCallback(
    (video: VideoSummary) => {
      setHistory((prev) => {
        // Remove if already exists to put it at the top
        const filtered = prev.filter((v) => v.id !== video.id);
        return [video, ...filtered].slice(0, 50); // Keep last 50
      });
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const addToWatchLater = useCallback(
    (video: VideoSummary) => {
      setWatchLater((prev) => {
        if (prev.some((v) => v.id === video.id)) return prev;
        return [video, ...prev];
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

  const isWatchLater = useCallback((videoId: string) => watchLater.some((v) => v.id === videoId), [watchLater]);

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
