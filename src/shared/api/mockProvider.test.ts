import { describe, expect, it } from 'vitest';
import { mockProvider } from './mockProvider';

// Must match WatchPage's guard so mock videos are actually playable.
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

describe('mockProvider produces YouTube-shaped video ids', () => {
  it('trending ids pass the 11-char guard and are unique within a page', async () => {
    const { items } = await mockProvider.getTrendingVideos({ maxResults: 8 });

    expect(items).toHaveLength(8);
    for (const video of items) {
      expect(video.id).toMatch(YOUTUBE_ID);
    }
    expect(new Set(items.map((v) => v.id)).size).toBe(items.length);
  });

  it('search and channel video ids pass the guard', async () => {
    const search = await mockProvider.getSearchVideos({
      query: 'react',
      maxResults: 3,
    });
    const channel = await mockProvider.getChannelVideos({
      channelId: 'c1',
      maxResults: 3,
    });

    for (const video of [...search.items, ...channel.items]) {
      expect(video.id).toMatch(YOUTUBE_ID);
    }
  });

  it('getVideoDetails echoes the requested id (so the watch page resolves)', async () => {
    const details = await mockProvider.getVideoDetails({
      videoId: 'abcdefghijk',
    });

    expect(details.id).toBe('abcdefghijk');
  });
});
