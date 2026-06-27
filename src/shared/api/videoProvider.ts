import {
  ChannelDetails,
  CommentData,
  PaginatedResponse,
  SearchFilters,
  VideoDetails,
  VideoSummary,
} from '../types/api';

/** Shared request concerns every provider call may receive. */
export interface RequestContext {
  signal?: AbortSignal;
}

/** Cursor-based pagination params (YouTube uses opaque page tokens). */
export interface PageParams {
  maxResults?: number;
  pageToken?: string;
}

export interface TrendingVideosParams extends PageParams, RequestContext {
  regionCode?: string;
  videoCategoryId?: string;
}

export interface SearchSuggestionsParams extends RequestContext {
  query: string;
}

export interface SearchVideosParams extends PageParams, RequestContext {
  query: string;
  filters?: SearchFilters;
}

export interface ChannelVideosParams extends PageParams, RequestContext {
  channelId: string;
}

export interface VideoDetailsParams extends RequestContext {
  videoId: string;
}

export interface ChannelDetailsParams extends RequestContext {
  channelId: string;
}

export interface VideoCommentsParams extends PageParams, RequestContext {
  videoId: string;
}

/**
 * The seam between the UI and any video backend. Every method takes a single
 * options object so call sites are self-documenting and argument order can
 * never be transposed.
 */
export interface IVideoProvider {
  getTrendingVideos(
    params?: TrendingVideosParams
  ): Promise<PaginatedResponse<VideoSummary>>;
  getSearchSuggestions(params: SearchSuggestionsParams): Promise<string[]>;
  getSearchVideos(
    params: SearchVideosParams
  ): Promise<PaginatedResponse<VideoSummary>>;
  getChannelVideos(
    params: ChannelVideosParams
  ): Promise<PaginatedResponse<VideoSummary>>;
  getVideoDetails(params: VideoDetailsParams): Promise<VideoDetails>;
  getChannelDetails(params: ChannelDetailsParams): Promise<ChannelDetails>;
  getVideoComments(
    params: VideoCommentsParams
  ): Promise<PaginatedResponse<CommentData>>;
}
