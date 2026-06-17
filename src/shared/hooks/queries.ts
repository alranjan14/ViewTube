import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiProvider } from '../api';
import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary, SearchFilters } from '../types/api';

export const useTrendingVideos = (regionCode = 'IN', maxResults = 50, videoCategoryId?: string) => {
  return useInfiniteQuery<PaginatedResponse<VideoSummary>, Error>({
    queryKey: ['trendingVideos', regionCode, maxResults, videoCategoryId],
    queryFn: ({ pageParam, signal }) => apiProvider.getTrendingVideos(regionCode, maxResults, pageParam as string | undefined, videoCategoryId, signal),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery<string[], Error>({
    queryKey: ['searchSuggestions', query],
    queryFn: ({ signal }) => apiProvider.getSearchSuggestions(query, signal),
    enabled: !!query.trim(), // only run if query is not empty
    staleTime: 1000 * 60 * 30, // 30 minutes for search suggestions
  });
};

export const useSearchVideos = (query: string, maxResults = 25, filters?: SearchFilters) => {
  return useInfiniteQuery<PaginatedResponse<VideoSummary>, Error>({
    queryKey: ['searchVideos', query, maxResults, filters],
    queryFn: ({ pageParam, signal }) => apiProvider.getSearchVideos(query, maxResults, pageParam as string | undefined, filters, signal),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useChannelVideos = (channelId: string, maxResults = 25) => {
  return useInfiniteQuery<PaginatedResponse<VideoSummary>, Error>({
    queryKey: ['channelVideos', channelId, maxResults],
    queryFn: ({ pageParam, signal }) => apiProvider.getChannelVideos(channelId, maxResults, pageParam as string | undefined, signal),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVideoDetails = (videoId: string) => {
  return useQuery<VideoDetails, Error>({
    queryKey: ['videoDetails', videoId],
    queryFn: ({ signal }) => apiProvider.getVideoDetails(videoId, signal),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useChannelDetails = (channelId: string) => {
  return useQuery<ChannelDetails, Error>({
    queryKey: ['channelDetails', channelId],
    queryFn: ({ signal }) => apiProvider.getChannelDetails(channelId, signal),
    enabled: !!channelId,
    staleTime: 1000 * 60 * 30, // 30 minutes for channel details
  });
};

export const useVideoComments = (videoId: string, maxResults = 20) => {
  return useInfiniteQuery<PaginatedResponse<CommentData>, Error>({
    queryKey: ['videoComments', videoId, maxResults],
    queryFn: ({ pageParam, signal }) => apiProvider.getVideoComments(videoId, maxResults, pageParam as string | undefined, signal),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: undefined,
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });
};
