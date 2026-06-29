import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../test/mocks/server';
import { QuotaExceededError } from './httpClient';
import { youtubeProvider } from './youtubeProvider';

// The provider hits the same-origin BFF proxy, not googleapis.com directly.
const BASE = '/api/youtube';

describe('youtubeProvider (schema parse + map + httpClient)', () => {
  it('getTrendingVideos validates and maps the videos payload', async () => {
    server.use(
      http.get(`${BASE}/videos`, () =>
        HttpResponse.json({
          items: [
            {
              id: 'v1',
              snippet: {
                title: 'T',
                channelId: 'c',
                channelTitle: 'C',
                thumbnails: { medium: { url: 'u' } },
                publishedAt: 'p',
              },
              statistics: { viewCount: '5' },
              contentDetails: { duration: 'PT1M' },
            },
          ],
          nextPageToken: 'NEXT',
        })
      )
    );

    const res = await youtubeProvider.getTrendingVideos({
      regionCode: 'US',
      maxResults: 1,
    });
    expect(res.nextPageToken).toBe('NEXT');
    expect(res.items).toHaveLength(1);
    expect(res.items[0]).toMatchObject({
      id: 'v1',
      title: 'T',
      thumbnailUrl: 'u',
      viewCount: '5',
      duration: 'PT1M',
    });
  });

  it('getVideoDetails throws when the response has no items', async () => {
    server.use(
      http.get(`${BASE}/videos`, () => HttpResponse.json({ items: [] }))
    );
    await expect(
      youtubeProvider.getVideoDetails({ videoId: 'x' })
    ).rejects.toThrow('Video not found');
  });

  it('maps a 403 quotaExceeded response to QuotaExceededError', async () => {
    server.use(
      http.get(`${BASE}/videos`, () =>
        HttpResponse.json(
          {
            error: { message: 'quota', errors: [{ reason: 'quotaExceeded' }] },
          },
          { status: 403 }
        )
      )
    );
    await expect(youtubeProvider.getTrendingVideos()).rejects.toBeInstanceOf(
      QuotaExceededError
    );
  });

  it('rejects when the payload shape is invalid (Zod boundary)', async () => {
    server.use(
      http.get(`${BASE}/videos`, () =>
        // snippet is missing required channelId/channelTitle/publishedAt
        HttpResponse.json({
          items: [{ id: 'v1', snippet: { title: 'incomplete' } }],
        })
      )
    );
    await expect(youtubeProvider.getTrendingVideos()).rejects.toThrow();
  });

  it('getChannelDetails validates and maps the channels payload', async () => {
    server.use(
      http.get(`${BASE}/channels`, () =>
        HttpResponse.json({
          items: [
            {
              id: 'ch',
              snippet: {
                title: 'Chan',
                description: 'd',
                thumbnails: { medium: { url: 'a' } },
              },
              statistics: { subscriberCount: '1000' },
            },
          ],
        })
      )
    );
    const ch = await youtubeProvider.getChannelDetails({ channelId: 'ch' });
    expect(ch).toMatchObject({
      id: 'ch',
      title: 'Chan',
      thumbnailUrl: 'a',
      subscriberCount: '1000',
    });
  });

  it('getSearchVideos validates and maps the search payload', async () => {
    server.use(
      http.get(`${BASE}/search`, () =>
        HttpResponse.json({
          items: [
            {
              id: { videoId: 'sv1' },
              snippet: {
                title: 'Search Result',
                channelId: 'c',
                channelTitle: 'C',
                thumbnails: { medium: { url: 'u' } },
                publishedAt: 'p',
              },
            },
          ],
          nextPageToken: 'S_NEXT',
        })
      )
    );
    const res = await youtubeProvider.getSearchVideos({
      query: 'react',
      maxResults: 1,
    });
    expect(res.nextPageToken).toBe('S_NEXT');
    expect(res.items[0]).toMatchObject({
      id: 'sv1',
      title: 'Search Result',
      thumbnailUrl: 'u',
    });
  });

  it('getVideoComments validates and maps comment threads with replies', async () => {
    server.use(
      http.get(`${BASE}/commentThreads`, () =>
        HttpResponse.json({
          items: [
            {
              id: 'ct1',
              snippet: {
                topLevelComment: {
                  snippet: {
                    authorDisplayName: 'Ada',
                    textOriginal: 'great video',
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
                      authorDisplayName: 'Bob',
                      textOriginal: 'agreed',
                      publishedAt: 'p2',
                      authorProfileImageUrl: 'img2',
                    },
                  },
                ],
              },
            },
          ],
        })
      )
    );
    const res = await youtubeProvider.getVideoComments({ videoId: 'v1' });
    const firstComment = res.items[0];
    expect(firstComment).toMatchObject({
      id: 'ct1',
      name: 'Ada',
      text: 'great video',
    });
    expect(firstComment?.replies[0]).toMatchObject({ id: 'r1', name: 'Bob' });
  });

  it('getSearchSuggestions parses the proxy JSON tuple into a string list', async () => {
    server.use(
      http.get('/api/suggest', () =>
        HttpResponse.json(['re', ['react', 'redux'], { meta: 'ignored' }])
      )
    );
    const suggestions = await youtubeProvider.getSearchSuggestions({
      query: 're',
    });
    expect(suggestions).toEqual(['react', 'redux']);
  });

  it('getSearchSuggestions fails soft (returns []) on a proxy error', async () => {
    server.use(
      http.get('/api/suggest', () =>
        HttpResponse.json({ error: { message: 'boom' } }, { status: 500 })
      )
    );
    await expect(
      youtubeProvider.getSearchSuggestions({ query: 'x' })
    ).resolves.toEqual([]);
  });

  it('getSearchSuggestions returns [] for a blank query without a request', async () => {
    await expect(
      youtubeProvider.getSearchSuggestions({ query: '   ' })
    ).resolves.toEqual([]);
  });
});
