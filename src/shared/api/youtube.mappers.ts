import {
  ChannelDetails,
  CommentData,
  VideoDetails,
  VideoSummary,
} from '../types/api';
import {
  RawChannelItem,
  RawCommentThread,
  RawSearchItem,
  RawVideoItem,
} from './youtube.schemas';

/**
 * Pure functions mapping validated raw YouTube payloads to our domain types.
 * Kept free of I/O so they are trivially unit-testable in isolation.
 */

export const mapVideoSummary = (item: RawVideoItem): VideoSummary => ({
  id: item.id,
  title: item.snippet.title,
  channelId: item.snippet.channelId,
  channelTitle: item.snippet.channelTitle,
  thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? '',
  viewCount: item.statistics?.viewCount,
  publishedAt: item.snippet.publishedAt,
  duration: item.contentDetails?.duration,
});

export const mapVideoDetails = (item: RawVideoItem): VideoDetails => ({
  ...mapVideoSummary(item),
  description: item.snippet.description,
  likeCount: item.statistics?.likeCount,
  commentCount: item.statistics?.commentCount,
  tags: item.snippet.tags,
  categoryId: item.snippet.categoryId,
  liveStreaming: item.liveStreamingDetails
    ? {
        isLive: Boolean(item.liveStreamingDetails.concurrentViewers),
        concurrentViewers: item.liveStreamingDetails.concurrentViewers,
        liveChatId: item.liveStreamingDetails.activeLiveChatId,
      }
    : undefined,
});

export const mapSearchResult = (item: RawSearchItem): VideoSummary => ({
  id: item.id.videoId,
  title: item.snippet.title,
  channelId: item.snippet.channelId,
  channelTitle: item.snippet.channelTitle,
  thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? '',
  publishedAt: item.snippet.publishedAt,
});

export const mapChannelDetails = (item: RawChannelItem): ChannelDetails => ({
  id: item.id,
  title: item.snippet.title,
  description: item.snippet.description,
  thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? '',
  subscriberCount: item.statistics?.subscriberCount,
  videoCount: item.statistics?.videoCount,
  viewCount: item.statistics?.viewCount,
  bannerImageUrl: item.brandingSettings?.image?.bannerExternalUrl,
});

export const mapCommentThread = (item: RawCommentThread): CommentData => {
  const top = item.snippet.topLevelComment.snippet;
  return {
    id: item.id,
    name: top.authorDisplayName,
    text: top.textOriginal,
    publishedAt: top.publishedAt,
    authorProfileImageUrl: top.authorProfileImageUrl,
    replies: (item.replies?.comments ?? []).map((reply) => ({
      id: reply.id,
      name: reply.snippet.authorDisplayName,
      text: reply.snippet.textOriginal,
      publishedAt: reply.snippet.publishedAt,
      authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
      replies: [],
    })),
  };
};
