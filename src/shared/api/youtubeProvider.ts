import { config } from '../config/env';
import { logger } from '../lib/logger';
import {
  ChannelDetails,
  CommentData,
  PaginatedResponse,
  VideoDetails,
  VideoSummary,
} from '../types/api';
import { httpClient } from './httpClient';
import {
  ChannelDetailsParams,
  ChannelVideosParams,
  IVideoProvider,
  SearchSuggestionsParams,
  SearchVideosParams,
  TrendingVideosParams,
  VideoCommentsParams,
  VideoDetailsParams,
} from './videoProvider';
import {
  mapChannelDetails,
  mapCommentThread,
  mapSearchResult,
  mapVideoDetails,
  mapVideoSummary,
} from './youtube.mappers';
import {
  ChannelListResponseSchema,
  CommentThreadListResponseSchema,
  SearchListResponseSchema,
  SuggestResponseSchema,
  VideoListResponseSchema,
} from './youtube.schemas';

// All requests go through the same-origin BFF proxy, which injects the API key
// server-side. No API key is ever present in the browser.
const API_BASE_URL = config.youtube.apiBaseUrl;

export const youtubeProvider: IVideoProvider = {
  async getTrendingVideos({
    regionCode = config.youtube.defaultRegion,
    maxResults = 50,
    pageToken,
    videoCategoryId,
    signal,
  }: TrendingVideosParams = {}): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      maxResults: String(maxResults),
      regionCode,
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (videoCategoryId) params.append('videoCategoryId', videoCategoryId);

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/videos?${params.toString()}`,
      { signal }
    );
    const data = VideoListResponseSchema.parse(raw);
    return {
      items: data.items.map(mapVideoSummary),
      nextPageToken: data.nextPageToken,
    };
  },

  async getSearchSuggestions({
    query,
    signal,
  }: SearchSuggestionsParams): Promise<string[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // Route through the proxy and parse JSON — no <script> injection / JSONP.
    // Suggestions are best-effort: a failure should never break the search box.
    try {
      const raw = await httpClient<unknown>(
        `${config.youtube.suggestUrl}?q=${encodeURIComponent(trimmed)}`,
        { signal }
      );
      const [, suggestions] = SuggestResponseSchema.parse(raw);
      return suggestions;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      logger.warn('Failed to fetch search suggestions', { error });
      return [];
    }
  },

  async getSearchVideos({
    query,
    maxResults = 25,
    pageToken,
    filters,
    signal,
  }: SearchVideosParams): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: String(maxResults),
      type: 'video',
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.publishedAfter)
      params.append('publishedAfter', filters.publishedAfter);

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/search?${params.toString()}`,
      { signal }
    );
    const data = SearchListResponseSchema.parse(raw);
    return {
      items: data.items.map(mapSearchResult),
      nextPageToken: data.nextPageToken,
    };
  },

  async getChannelVideos({
    channelId,
    maxResults = 25,
    pageToken,
    signal,
  }: ChannelVideosParams): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      maxResults: String(maxResults),
      order: 'date',
      type: 'video',
    });
    if (pageToken) params.append('pageToken', pageToken);

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/search?${params.toString()}`,
      { signal }
    );
    const data = SearchListResponseSchema.parse(raw);
    return {
      items: data.items.map(mapSearchResult),
      nextPageToken: data.nextPageToken,
    };
  },

  async getVideoDetails({
    videoId,
    signal,
  }: VideoDetailsParams): Promise<VideoDetails> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics,liveStreamingDetails',
      id: videoId,
    });

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/videos?${params.toString()}`,
      { signal }
    );
    const data = VideoListResponseSchema.parse(raw);
    const item = data.items[0];
    if (!item) throw new Error('Video not found');
    return mapVideoDetails(item);
  },

  async getChannelDetails({
    channelId,
    signal,
  }: ChannelDetailsParams): Promise<ChannelDetails> {
    const params = new URLSearchParams({
      part: 'snippet,statistics,brandingSettings',
      id: channelId,
    });

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/channels?${params.toString()}`,
      { signal }
    );
    const data = ChannelListResponseSchema.parse(raw);
    const item = data.items[0];
    if (!item) throw new Error('Channel not found');
    return mapChannelDetails(item);
  },

  async getVideoComments({
    videoId,
    maxResults = 20,
    pageToken,
    signal,
  }: VideoCommentsParams): Promise<PaginatedResponse<CommentData>> {
    const params = new URLSearchParams({
      part: 'snippet,replies',
      videoId,
      maxResults: String(maxResults),
    });
    if (pageToken) params.append('pageToken', pageToken);

    const raw = await httpClient<unknown>(
      `${API_BASE_URL}/commentThreads?${params.toString()}`,
      { signal }
    );
    const data = CommentThreadListResponseSchema.parse(raw);
    return {
      items: data.items.map(mapCommentThread),
      nextPageToken: data.nextPageToken,
    };
  },
};
