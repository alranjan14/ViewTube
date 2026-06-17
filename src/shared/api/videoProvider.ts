import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary } from '../types/api';

export interface IVideoProvider {
  getTrendingVideos(regionCode?: string, maxResults?: number, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>>;
  getSearchSuggestions(query: string, signal?: AbortSignal): Promise<string[]>;
  getSearchVideos(query: string, maxResults?: number, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>>;
  getChannelVideos(channelId: string, maxResults?: number, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<VideoSummary>>;
  getVideoDetails(videoId: string, signal?: AbortSignal): Promise<VideoDetails>;
  getChannelDetails(channelId: string, signal?: AbortSignal): Promise<ChannelDetails>;
  getVideoComments(videoId: string, maxResults?: number, pageToken?: string, signal?: AbortSignal): Promise<PaginatedResponse<CommentData>>;
}
