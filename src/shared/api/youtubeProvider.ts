/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary, SearchFilters } from '../types/api';
import { httpClient } from './httpClient';
import { IVideoProvider } from './videoProvider';

const YOUTUBE_API_BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const YOUTUBE_SUGGESTIONS_API_URL = 'https://suggestqueries.google.com/complete/search';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

export const youtubeProvider: IVideoProvider = {
  async getTrendingVideos(regionCode = 'IN', maxResults = 50, pageToken?: string, videoCategoryId?: string, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      maxResults: String(maxResults),
      regionCode,
      key: YOUTUBE_API_KEY,
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (videoCategoryId) params.append('videoCategoryId', videoCategoryId);

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`, { signal });

    return {
      items: (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
        viewCount: item.statistics?.viewCount,
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails?.duration,
      })),
      nextPageToken: data.nextPageToken,
    };
  },

  async getSearchSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
      client: 'youtube',
      ds: 'yt',
      q: query.trim(),
    });

    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      params.append('jsonp', callbackName);
      
      const script = document.createElement('script');
      script.src = `${YOUTUBE_SUGGESTIONS_API_URL}?${params.toString()}`;
      
      if (signal) {
        signal.addEventListener('abort', () => {
          cleanup();
          reject(new Error('Aborted'));
        });
      }

      const cleanup = () => {
        delete (window as any)[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        resolve(Array.isArray(data?.[1]) ? data[1].map((item: any) => item[0]) : []);
      };

      script.onerror = () => {
        cleanup();
        resolve([]); // Fail gracefully to avoid crashing suggestions
      };

      document.body.appendChild(script);
    });
  },

  async getSearchVideos(query: string, maxResults = 25, pageToken?: string, filters?: SearchFilters, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: String(maxResults),
      type: 'video',
      key: YOUTUBE_API_KEY,
    });
    if (pageToken) params.append('pageToken', pageToken);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.publishedAfter) params.append('publishedAfter', filters.publishedAfter);

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`, { signal });

    return {
      items: (data.items || []).map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: data.nextPageToken,
    };
  },

  async getChannelVideos(channelId: string, maxResults = 25, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>> {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      maxResults: String(maxResults),
      order: 'date',
      type: 'video',
      key: YOUTUBE_API_KEY,
    });
    if (pageToken) params.append('pageToken', pageToken);

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`, { signal });

    return {
      items: (data.items || []).map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: data.nextPageToken,
    };
  },

  async getVideoDetails(videoId: string, signal?: AbortSignal): Promise<VideoDetails> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics,liveStreamingDetails',
      id: videoId,
      key: YOUTUBE_API_KEY,
    });

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`, { signal });
    if (!data.items?.length) throw new Error('Video not found');

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
      viewCount: item.statistics?.viewCount,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails?.duration,
      description: item.snippet.description,
      likeCount: item.statistics?.likeCount,
      commentCount: item.statistics?.commentCount,
      tags: item.snippet.tags,
      categoryId: item.snippet.categoryId,
      liveStreaming: item.liveStreamingDetails ? {
        isLive: !!item.liveStreamingDetails.concurrentViewers,
        concurrentViewers: item.liveStreamingDetails.concurrentViewers,
        liveChatId: item.liveStreamingDetails.activeLiveChatId,
      } : undefined,
    };
  },

  async getChannelDetails(channelId: string, signal?: AbortSignal): Promise<ChannelDetails> {
    const params = new URLSearchParams({
      part: 'snippet,statistics,brandingSettings',
      id: channelId,
      key: YOUTUBE_API_KEY,
    });

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/channels?${params.toString()}`, { signal });
    if (!data.items?.length) throw new Error('Channel not found');

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
      subscriberCount: item.statistics?.subscriberCount,
      videoCount: item.statistics?.videoCount,
      viewCount: item.statistics?.viewCount,
      bannerImageUrl: item.brandingSettings?.image?.bannerExternalUrl,
    };
  },

  async getVideoComments(videoId: string, maxResults = 20, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<CommentData>> {
    const params = new URLSearchParams({
      part: 'snippet,replies',
      videoId,
      maxResults: String(maxResults),
      key: YOUTUBE_API_KEY,
    });
    if (pageToken) params.append('pageToken', pageToken);

    const data = await httpClient<any>(`${YOUTUBE_API_BASE_URL}/commentThreads?${params.toString()}`, { signal });

    return {
      items: (data.items || []).map((item: any) => {
        const topLevel = item.snippet.topLevelComment.snippet;
        return {
          id: item.id,
          name: topLevel.authorDisplayName,
          text: topLevel.textOriginal,
          publishedAt: topLevel.publishedAt,
          authorProfileImageUrl: topLevel.authorProfileImageUrl,
          replies: (item.replies?.comments || []).map((reply: any) => ({
            id: reply.id,
            name: reply.snippet.authorDisplayName,
            text: reply.snippet.textOriginal,
            publishedAt: reply.snippet.publishedAt,
            authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
            replies: [],
          })),
        };
      }),
      nextPageToken: data.nextPageToken,
    };
  },
};
