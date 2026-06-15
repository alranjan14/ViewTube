import { useQuery } from '@tanstack/react-query';
import { apiProvider } from '../api';
import { CommentData, VideoDetails, VideoSummary } from '../types/api';

export const useTrendingVideos = (regionCode = 'IN', maxResults = 50) => {
  return useQuery<VideoSummary[], Error>({
    queryKey: ['trendingVideos', regionCode, maxResults],
    queryFn: () => apiProvider.getTrendingVideos(regionCode, maxResults),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery<string[], Error>({
    queryKey: ['searchSuggestions', query],
    queryFn: () => apiProvider.getSearchSuggestions(query),
    enabled: !!query.trim(), // only run if query is not empty
    staleTime: 1000 * 60 * 30, // 30 minutes for search suggestions
  });
};

export const useSearchVideos = (query: string, maxResults = 25) => {
  return useQuery<VideoSummary[], Error>({
    queryKey: ['searchVideos', query, maxResults],
    queryFn: () => apiProvider.getSearchVideos(query, maxResults),
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useVideoDetails = (videoId: string) => {
  return useQuery<VideoDetails, Error>({
    queryKey: ['videoDetails', videoId],
    queryFn: () => apiProvider.getVideoDetails(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVideoComments = (videoId: string, maxResults = 20) => {
  return useQuery<CommentData[], Error>({
    queryKey: ['videoComments', videoId, maxResults],
    queryFn: () => apiProvider.getVideoComments(videoId, maxResults),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });
};
