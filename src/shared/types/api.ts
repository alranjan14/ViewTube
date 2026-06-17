export interface PaginatedResponse<T> {
  items: T[];
  nextPageToken?: string;
}

export interface ChannelDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  bannerImageUrl?: string;
}

export interface VideoSummary {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl: string;
  viewCount?: string;
  publishedAt: string;
  duration?: string;
}

export interface VideoDetails extends VideoSummary {
  description?: string;
  likeCount?: string;
  commentCount?: string;
  tags?: string[];
  categoryId?: string;
  liveStreaming?: {
    isLive: boolean;
    concurrentViewers?: string;
    liveChatId?: string;
  };
}

export interface CommentData {
  id: string;
  name: string;
  text: string;
  publishedAt: string;
  authorProfileImageUrl: string;
  replies: CommentData[];
}

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  thumbnailUrl: string;
  bannerUrl?: string;
}
