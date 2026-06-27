import { describe, expect, it } from 'vitest';
import {
  mapChannelDetails,
  mapCommentThread,
  mapSearchResult,
  mapVideoDetails,
  mapVideoSummary,
} from './youtube.mappers';
import type {
  RawChannelItem,
  RawCommentThread,
  RawSearchItem,
  RawVideoItem,
} from './youtube.schemas';

const rawVideo: RawVideoItem = {
  id: 'vid1',
  snippet: {
    title: 'Title',
    channelId: 'chan1',
    channelTitle: 'Chan',
    thumbnails: { medium: { url: 'http://thumb/medium.jpg' } },
    publishedAt: '2026-01-01T00:00:00Z',
    description: 'desc',
    tags: ['a', 'b'],
    categoryId: '27',
  },
  statistics: { viewCount: '100', likeCount: '10', commentCount: '5' },
  contentDetails: { duration: 'PT5M' },
  liveStreamingDetails: { concurrentViewers: '42', activeLiveChatId: 'live1' },
};

describe('youtube mappers', () => {
  it('mapVideoSummary maps core fields and prefers the medium thumbnail', () => {
    expect(mapVideoSummary(rawVideo)).toEqual({
      id: 'vid1',
      title: 'Title',
      channelId: 'chan1',
      channelTitle: 'Chan',
      thumbnailUrl: 'http://thumb/medium.jpg',
      viewCount: '100',
      publishedAt: '2026-01-01T00:00:00Z',
      duration: 'PT5M',
    });
  });

  it('mapVideoSummary falls back to an empty thumbnail when none is present', () => {
    const noThumb: RawVideoItem = {
      ...rawVideo,
      snippet: { ...rawVideo.snippet, thumbnails: undefined },
    };
    expect(mapVideoSummary(noThumb).thumbnailUrl).toBe('');
  });

  it('mapVideoDetails includes description, stats, tags and the live flag', () => {
    const d = mapVideoDetails(rawVideo);
    expect(d.description).toBe('desc');
    expect(d.likeCount).toBe('10');
    expect(d.commentCount).toBe('5');
    expect(d.tags).toEqual(['a', 'b']);
    expect(d.liveStreaming).toEqual({
      isLive: true,
      concurrentViewers: '42',
      liveChatId: 'live1',
    });
  });

  it('mapVideoDetails leaves liveStreaming undefined for a normal video', () => {
    const notLive: RawVideoItem = {
      ...rawVideo,
      liveStreamingDetails: undefined,
    };
    expect(mapVideoDetails(notLive).liveStreaming).toBeUndefined();
  });

  it('mapSearchResult reads the nested videoId', () => {
    const rawSearch: RawSearchItem = {
      id: { videoId: 'svid' },
      snippet: {
        title: 'S',
        channelId: 'c',
        channelTitle: 'C',
        thumbnails: { medium: { url: 'u' } },
        publishedAt: 'p',
      },
    };
    const r = mapSearchResult(rawSearch);
    expect(r.id).toBe('svid');
    expect(r.thumbnailUrl).toBe('u');
  });

  it('mapChannelDetails maps statistics and the banner image', () => {
    const rawChan: RawChannelItem = {
      id: 'chan1',
      snippet: {
        title: 'Chan',
        description: 'about',
        thumbnails: { medium: { url: 'avatar' } },
      },
      statistics: {
        subscriberCount: '1000',
        videoCount: '10',
        viewCount: '99',
      },
      brandingSettings: { image: { bannerExternalUrl: 'banner' } },
    };
    expect(mapChannelDetails(rawChan)).toEqual({
      id: 'chan1',
      title: 'Chan',
      description: 'about',
      thumbnailUrl: 'avatar',
      subscriberCount: '1000',
      videoCount: '10',
      viewCount: '99',
      bannerImageUrl: 'banner',
    });
  });

  it('mapCommentThread flattens the top-level comment and its replies', () => {
    const rawThread: RawCommentThread = {
      id: 't1',
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: 'A',
            textOriginal: 'hi',
            publishedAt: 'p',
            authorProfileImageUrl: 'img',
          },
        },
      },
      replies: {
        comments: [
          {
            id: 'r1',
            snippet: {
              authorDisplayName: 'B',
              textOriginal: 're',
              publishedAt: 'p2',
              authorProfileImageUrl: 'img2',
            },
          },
        ],
      },
    };
    const c = mapCommentThread(rawThread);
    expect(c).toMatchObject({
      id: 't1',
      name: 'A',
      text: 'hi',
      authorProfileImageUrl: 'img',
    });
    expect(c.replies).toHaveLength(1);
    expect(c.replies[0]).toMatchObject({
      id: 'r1',
      name: 'B',
      text: 're',
      replies: [],
    });
  });

  it('mapCommentThread returns an empty replies array when there are none', () => {
    const rawThread: RawCommentThread = {
      id: 't2',
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: 'A',
            textOriginal: 'x',
            publishedAt: 'p',
            authorProfileImageUrl: 'i',
          },
        },
      },
    };
    expect(mapCommentThread(rawThread).replies).toEqual([]);
  });
});
