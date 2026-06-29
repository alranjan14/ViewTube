import { useCallback } from 'react';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../config/storage';
import { VideoDetails, VideoSummary } from '../types/api';
import { useLocalStorage } from './useLocalStorage';

export function useWatchLater() {
  const [savedVideos, setSavedVideos] = useLocalStorage<VideoSummary[]>(
    STORAGE_KEYS.watchLater,
    []
  );

  const isSaved = useCallback(
    (videoId: string) => {
      return savedVideos.some((v) => v.id === videoId);
    },
    [savedVideos]
  );

  const toggleSave = useCallback(
    (video: VideoDetails | VideoSummary) => {
      setSavedVideos((prev) => {
        const exists = prev.some((v) => v.id === video.id);
        if (exists) {
          return prev.filter((v) => v.id !== video.id);
        }

        // Map VideoDetails to VideoSummary if necessary
        const summary: VideoSummary = {
          id: video.id,
          title: video.title,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          thumbnailUrl: video.thumbnailUrl,
          viewCount: video.viewCount,
          publishedAt: video.publishedAt,
          duration: video.duration,
        };

        return [summary, ...prev].slice(0, STORAGE_LIMITS.watchLater);
      });
    },
    [setSavedVideos]
  );

  return {
    savedVideos,
    isSaved,
    toggleSave,
  };
}
