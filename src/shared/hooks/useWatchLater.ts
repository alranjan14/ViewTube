import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { VideoDetails, VideoSummary } from '../types/api';

export function useWatchLater() {
  const [savedVideos, setSavedVideos] = useLocalStorage<VideoSummary[]>('yt_clone_watch_later', []);

  const isSaved = useCallback((videoId: string) => {
    return savedVideos.some(v => v.id === videoId);
  }, [savedVideos]);

  const toggleSave = useCallback((video: VideoDetails | VideoSummary) => {
    setSavedVideos(prev => {
      const exists = prev.some(v => v.id === video.id);
      if (exists) {
        return prev.filter(v => v.id !== video.id);
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
      
      return [summary, ...prev];
    });
  }, [setSavedVideos]);

  return {
    savedVideos,
    isSaved,
    toggleSave
  };
}
