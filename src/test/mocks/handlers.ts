import { http, HttpResponse } from 'msw';

// The client talks to the same-origin BFF proxy, so handlers match the proxy
// paths (`/api/youtube/*`, `/api/suggest`) rather than googleapis.com directly.
export const handlers = [
  http.get('/api/youtube/videos', ({ request }) => {
    const url = new URL(request.url);
    const chart = url.searchParams.get('chart');

    if (chart === 'mostPopular') {
      return HttpResponse.json({
        items: [
          {
            id: 'mock-video-1',
            snippet: {
              title: 'Mock Trending Video',
              channelId: 'mock-channel-1',
              channelTitle: 'Mock Channel',
              thumbnails: {
                medium: { url: 'https://via.placeholder.com/320x180.png' },
              },
              publishedAt: '2026-06-01T00:00:00Z',
            },
            statistics: { viewCount: '1000000' },
            contentDetails: { duration: 'PT10M' },
          },
        ],
        nextPageToken: 'mock-next-page',
      });
    }

    return HttpResponse.json({ items: [] });
  }),

  http.get('/api/youtube/search', () => {
    return HttpResponse.json({
      items: [
        {
          id: { videoId: 'mock-search-1' },
          snippet: {
            title: 'Mock Search Result',
            channelId: 'mock-channel-1',
            channelTitle: 'Mock Channel',
            thumbnails: {
              medium: { url: 'https://via.placeholder.com/320x180.png' },
            },
            publishedAt: '2026-06-01T00:00:00Z',
          },
        },
      ],
      nextPageToken: 'mock-search-next-page',
    });
  }),

  http.get('/api/youtube/channels', () => {
    return HttpResponse.json({
      items: [
        {
          id: 'mock-channel-1',
          snippet: {
            title: 'Mock Channel',
            description: 'A mock channel for tests',
            thumbnails: {
              medium: { url: 'https://via.placeholder.com/100x100.png' },
            },
          },
          statistics: {
            subscriberCount: '1000000',
            videoCount: '100',
            viewCount: '50000000',
          },
          brandingSettings: {
            image: {
              bannerExternalUrl: 'https://via.placeholder.com/1600x400.png',
            },
          },
        },
      ],
    });
  }),

  http.get('/api/suggest', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q') ?? '';
    return HttpResponse.json([q, [`${q} tutorial`, `${q} explained`]]);
  }),
];
