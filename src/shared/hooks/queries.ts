import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiProvider } from '../api';
import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary } from '../types/api';

export const useTrendingVideos = (regionCode = 'IN', maxResults = 50) => {
  return useInfiniteQuery<PaginatedResponse<VideoSummary>, Error>({
    queryKey: ['trendingVideos', regionCode, maxResults],
    queryFn: ({ pageParam }) => apiProvider.getTrendingVideos(regionCode, maxResults, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
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
  return useInfiniteQuery<PaginatedResponse<VideoSummary>, Error>({
    queryKey: ['searchVideos', query, maxResults],
    queryFn: ({ pageParam }) => apiProvider.getSearchVideos(query, maxResults, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
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

export const useChannelDetails = (channelId: string) => {
  return useQuery<ChannelDetails, Error>({
    queryKey: ['channelDetails', channelId],
    queryFn: () => apiProvider.getChannelDetails(channelId),
    enabled: !!channelId,
    staleTime: 1000 * 60 * 30, // 30 minutes for channel details
  });
};

export const useVideoComments = (videoId: string, maxResults = 20) => {
  return useInfiniteQuery<PaginatedResponse<CommentData>, Error>({
    queryKey: ['videoComments', videoId, maxResults],
    queryFn: ({ pageParam }) => apiProvider.getVideoComments(videoId, maxResults, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });
};
