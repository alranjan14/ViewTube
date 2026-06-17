import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://youtube.googleapis.com/youtube/v3/videos', ({ request }) => {
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
              thumbnails: { medium: { url: 'https://via.placeholder.com/320x180.png' } },
              publishedAt: '2026-06-01T00:00:00Z',
            },
            statistics: { viewCount: '1000000' },
            contentDetails: { duration: 'PT10M' }
          }
        ],
        nextPageToken: 'mock-next-page'
      });
    }

    return HttpResponse.json({ items: [] });
  }),
  
  http.get('https://youtube.googleapis.com/youtube/v3/search', () => {
    return HttpResponse.json({
      items: [
        {
          id: { videoId: 'mock-search-1' },
          snippet: {
            title: 'Mock Search Result',
            channelId: 'mock-channel-1',
            channelTitle: 'Mock Channel',
            thumbnails: { medium: { url: 'https://via.placeholder.com/320x180.png' } },
            publishedAt: '2026-06-01T00:00:00Z',
          }
        }
      ],
      nextPageToken: 'mock-search-next-page'
    });
  })
];
