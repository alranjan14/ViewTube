import { CommentData, VideoDetails, VideoSummary } from '../types/api';

export interface IVideoProvider {
  getTrendingVideos(regionCode?: string, maxResults?: number): Promise<VideoSummary[]>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getSearchVideos(query: string, maxResults?: number): Promise<VideoSummary[]>;
  getVideoDetails(videoId: string): Promise<VideoDetails>;
  getVideoComments(videoId: string, maxResults?: number): Promise<CommentData[]>;
}
