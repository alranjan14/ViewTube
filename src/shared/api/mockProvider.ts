/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary } from '../types/api';
import { IVideoProvider } from './videoProvider';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockVideoSummary: VideoSummary = {
  id: 'mock-video-1',
  title: 'Mock Video: Building a YouTube Clone with React and Vite',
  channelId: 'mock-channel-1',
  channelTitle: 'Frontend Master',
  thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  viewCount: '1500000',
  publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  duration: 'PT15M33S',
};

export const mockProvider: IVideoProvider = {
  async getTrendingVideos(_regionCode = 'IN', maxResults = 50, _pageToken?: string, _signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>> {
    await delay(500);
    const items = Array(maxResults).fill(null).map((_, i) => ({
      ...mockVideoSummary,
      id: `trending-video-${i}-${Date.now()}`,
      title: `Trending Video #${i + 1}`,
    }));
    return { items, nextPageToken: 'mock-next-page-token' };
  },

  async getSearchSuggestions(query: string, _signal?: AbortSignal): Promise<string[]> {
    await delay(200);
    if (!query.trim()) return [];
    return [
      `${query} react`,
      `${query} tutorial`,
      `${query} vs angular`,
      `${query} 2024`,
      `${query} crash course`,
    ];
  },

  async getSearchVideos(query: string, maxResults = 25, _pageToken?: string, _signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>> {
    await delay(500);
    const items = Array(maxResults).fill(null).map((_, i) => ({
      ...mockVideoSummary,
      id: `search-video-${i}-${Date.now()}`,
      title: `${query} - Result #${i + 1}`,
    }));
    return { items, nextPageToken: 'mock-search-next-token' };
  },

  async getVideoDetails(videoId: string, _signal?: AbortSignal): Promise<VideoDetails> {
    await delay(300);
    return {
      ...mockVideoSummary,
      id: videoId,
      description: 'This is a mock description for the video.\n\nIt supports multiple lines and simulates the data you would get from the real YouTube API.\n\nSubscribe for more content!',
      likeCount: '45000',
      commentCount: '1200',
      tags: ['react', 'vite', 'frontend', 'tutorial'],
      categoryId: '27',
    };
  },

  async getChannelDetails(channelId: string, _signal?: AbortSignal): Promise<ChannelDetails> {
    await delay(300);
    return {
      id: channelId,
      title: 'Frontend Master',
      description: 'The best frontend channel on the mock web.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      subscriberCount: '1250000',
      videoCount: '342',
      viewCount: '150000000',
      bannerImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80',
    };
  },

  async getVideoComments(videoId: string, maxResults = 20, _pageToken?: string, _signal?: AbortSignal): Promise<PaginatedResponse<CommentData>> {
    await delay(400);
    const items = Array(maxResults).fill(null).map((_, i) => ({
      id: `comment-${i}`,
      name: `User ${i + 1}`,
      text: `This is mock comment #${i + 1} for video ${videoId}. It looks incredibly realistic!`,
      publishedAt: new Date(Date.now() - 3600000 * i).toISOString(),
      authorProfileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      replies: i % 3 === 0 ? [
        {
          id: `reply-${i}-1`,
          name: 'Channel Owner',
          text: 'Thanks for the comment!',
          publishedAt: new Date(Date.now() - 1800000 * i).toISOString(),
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
          replies: [],
        }
      ] : [],
    }));
    return { items, nextPageToken: 'mock-comments-next' };
  },
};
