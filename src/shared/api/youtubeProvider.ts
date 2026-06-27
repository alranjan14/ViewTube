import { config } from '../config/env';
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
  VideoListResponseSchema,
} from './youtube.schemas';

const YOUTUBE_API_BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const YOUTUBE_SUGGESTIONS_API_URL =
  'https://suggestqueries.google.com/complete/search';

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
      key: config.youtube.apiKey,
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (videoCategoryId) params.append('videoCategoryId', videoCategoryId);

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`,
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

    const params = new URLSearchParams({
      client: 'youtube',
      ds: 'yt',
      q: trimmed,
    });

    return new Promise<string[]>((resolve, reject) => {
      const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
      params.append('jsonp', callbackName);

      const script = document.createElement('script');
      script.src = `${YOUTUBE_SUGGESTIONS_API_URL}?${params.toString()}`;

      // The JSONP global is keyed by a random callback name; type it without `any`.
      const w = window as unknown as Record<
        string,
        ((data: unknown) => void) | undefined
      >;

      const cleanup = () => {
        delete w[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      if (signal) {
        signal.addEventListener('abort', () => {
          cleanup();
          reject(new Error('Aborted'));
        });
      }

      w[callbackName] = (data: unknown) => {
        cleanup();
        // Response shape: [query, [[suggestion, ...meta], ...], ...]
        const entries =
          Array.isArray(data) && Array.isArray(data[1])
            ? (data[1] as unknown[])
            : [];
        resolve(
          entries
            .map((entry) => (Array.isArray(entry) ? String(entry[0]) : ''))
            .filter(Boolean)
        );
      };

      script.onerror = () => {
        cleanup();
        resolve([]); // Fail gracefully to avoid crashing suggestions
      };

      document.body.appendChild(script);
    });
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
      key: config.youtube.apiKey,
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.publishedAfter)
      params.append('publishedAfter', filters.publishedAfter);

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/search?${params.toString()}`,
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
      key: config.youtube.apiKey,
    });
    if (pageToken) params.append('pageToken', pageToken);

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/search?${params.toString()}`,
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
      key: config.youtube.apiKey,
    });

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`,
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
      key: config.youtube.apiKey,
    });

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/channels?${params.toString()}`,
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
      key: config.youtube.apiKey,
    });
    if (pageToken) params.append('pageToken', pageToken);

    const raw = await httpClient<unknown>(
      `${YOUTUBE_API_BASE_URL}/commentThreads?${params.toString()}`,
      { signal }
    );
    const data = CommentThreadListResponseSchema.parse(raw);
    return {
      items: data.items.map(mapCommentThread),
      nextPageToken: data.nextPageToken,
    };
  },
};
