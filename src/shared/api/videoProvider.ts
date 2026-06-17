import { ChannelDetails, CommentData, PaginatedResponse, VideoDetails, VideoSummary } from '../types/api';

export interface IVideoProvider {
  getTrendingVideos(regionCode?: string, maxResults?: number, pageToken?: string): Promise<PaginatedResponse<VideoSummary>>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getSearchVideos(query: string, maxResults?: number, pageToken?: string): Promise<PaginatedResponse<VideoSummary>>;
  getVideoDetails(videoId: string): Promise<VideoDetails>;
  getChannelDetails(channelId: string): Promise<ChannelDetails>;
  getVideoComments(videoId: string, maxResults?: number, pageToken?: string): Promise<PaginatedResponse<CommentData>>;
}
