import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/youtube/v3/videos', () => {
    return HttpResponse.json({
      items: [
        {
          id: 'mock-1',
          snippet: {
            title: 'Mock-Video',
            channelTitle: 'Mock Channel',
            thumbnails: { medium: { url: 'https://via.placeholder.com/320x180' } },
            publishedAt: new Date().toISOString(),
          },
          statistics: { viewCount: '1000' },
        },
      ],
    });
  }),
];
