import { z } from 'zod';

/**
 * Zod schemas for the *raw* YouTube Data API v3 payloads we consume. Parsing
 * responses through these at the network boundary means a shape change or a
 * partial/error payload throws a typed, catchable error here — instead of an
 * `undefined is not an object` deep inside render. Domain types are produced
 * from these by the mappers in `youtube.mappers.ts`.
 */

const ThumbnailUrlSchema = z.object({ url: z.string() });

const ThumbnailsSchema = z
  .object({
    default: ThumbnailUrlSchema.optional(),
    medium: ThumbnailUrlSchema.optional(),
    high: ThumbnailUrlSchema.optional(),
    standard: ThumbnailUrlSchema.optional(),
    maxres: ThumbnailUrlSchema.optional(),
  })
  .optional();

export const RawVideoItemSchema = z.object({
  id: z.string(),
  snippet: z.object({
    title: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    thumbnails: ThumbnailsSchema,
    publishedAt: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
  }),
  statistics: z
    .object({
      viewCount: z.string().optional(),
      likeCount: z.string().optional(),
      commentCount: z.string().optional(),
    })
    .optional(),
  contentDetails: z.object({ duration: z.string().optional() }).optional(),
  liveStreamingDetails: z
    .object({
      concurrentViewers: z.string().optional(),
      activeLiveChatId: z.string().optional(),
    })
    .optional(),
});
export type RawVideoItem = z.infer<typeof RawVideoItemSchema>;

export const VideoListResponseSchema = z.object({
  items: z.array(RawVideoItemSchema).default([]),
  nextPageToken: z.string().optional(),
});

export const RawSearchItemSchema = z.object({
  id: z.object({ videoId: z.string() }),
  snippet: z.object({
    title: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    thumbnails: ThumbnailsSchema,
    publishedAt: z.string(),
  }),
});
export type RawSearchItem = z.infer<typeof RawSearchItemSchema>;

export const SearchListResponseSchema = z.object({
  items: z.array(RawSearchItemSchema).default([]),
  nextPageToken: z.string().optional(),
});

export const RawChannelItemSchema = z.object({
  id: z.string(),
  snippet: z.object({
    title: z.string(),
    description: z.string().default(''),
    thumbnails: ThumbnailsSchema,
  }),
  statistics: z
    .object({
      subscriberCount: z.string().optional(),
      videoCount: z.string().optional(),
      viewCount: z.string().optional(),
    })
    .optional(),
  brandingSettings: z
    .object({
      image: z.object({ bannerExternalUrl: z.string().optional() }).optional(),
    })
    .optional(),
});
export type RawChannelItem = z.infer<typeof RawChannelItemSchema>;

export const ChannelListResponseSchema = z.object({
  items: z.array(RawChannelItemSchema).default([]),
});

const RawCommentSnippetSchema = z.object({
  authorDisplayName: z.string(),
  textOriginal: z.string().default(''),
  publishedAt: z.string(),
  authorProfileImageUrl: z.string().default(''),
});

export const RawCommentThreadSchema = z.object({
  id: z.string(),
  snippet: z.object({
    topLevelComment: z.object({ snippet: RawCommentSnippetSchema }),
  }),
  replies: z
    .object({
      comments: z
        .array(z.object({ id: z.string(), snippet: RawCommentSnippetSchema }))
        .default([]),
    })
    .optional(),
});
export type RawCommentThread = z.infer<typeof RawCommentThreadSchema>;

export const CommentThreadListResponseSchema = z.object({
  items: z.array(RawCommentThreadSchema).default([]),
  nextPageToken: z.string().optional(),
});

/**
 * Search-suggestion payload from the proxy (`/api/suggest`). The upstream
 * Google "firefox" client returns `[query, [suggestion, ...]]` with optional
 * trailing metadata, so we accept extra tuple elements.
 */
export const SuggestResponseSchema = z
  .tuple([z.string(), z.array(z.string())])
  .rest(z.unknown());
