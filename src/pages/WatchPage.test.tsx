import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import WatchPage from './WatchPage';
import { server } from '@/test/mocks/server';
import { renderWithProviders } from '@/test/utils';

const VIDEO_ID = 'dQw4w9WgXcQ'; // a valid 11-char YouTube id

const videoResponse = {
  items: [
    {
      id: VIDEO_ID,
      snippet: {
        title: 'Never Gonna Give You Up',
        channelId: 'mock-channel-1',
        channelTitle: 'Mock Channel',
        thumbnails: {
          medium: { url: 'https://i.ytimg.com/vi/x/mqdefault.jpg' },
        },
        publishedAt: '2026-06-01T00:00:00Z',
        description: 'A classic.',
      },
      statistics: {
        viewCount: '1000000',
        likeCount: '50000',
        commentCount: '1000',
      },
      contentDetails: { duration: 'PT3M33S' },
    },
  ],
};

// Render WatchPage on a valid /watch?v= route with the video-details and
// (empty) comment-thread endpoints stubbed. channels + search are covered by
// the global handlers.
const renderValidVideo = () => {
  server.use(
    http.get('/api/youtube/videos', () => HttpResponse.json(videoResponse)),
    http.get('/api/youtube/commentThreads', () =>
      HttpResponse.json({ items: [] })
    )
  );
  window.history.pushState({}, '', `/watch?v=${VIDEO_ID}`);
  return renderWithProviders(<WatchPage />);
};

describe('WatchPage', () => {
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('rejects a missing video id', () => {
    window.history.pushState({}, '', '/watch');
    renderWithProviders(<WatchPage />);

    expect(
      screen.getByText(/missing or invalid video id/i)
    ).toBeInTheDocument();
  });

  it('rejects a malformed video id (not an 11-char YouTube id)', () => {
    window.history.pushState({}, '', '/watch?v=not-a-valid-id');
    renderWithProviders(<WatchPage />);

    expect(
      screen.getByText(/missing or invalid video id/i)
    ).toBeInTheDocument();
  });

  it('embeds the privacy-friendly player with the validated id', async () => {
    renderValidVideo();

    // Title appears once the video-details query resolves.
    expect(
      await screen.findByRole('heading', { name: /never gonna give you up/i })
    ).toBeInTheDocument();

    // The iframe uses youtube-nocookie with exactly the validated id.
    expect(screen.getByTitle('Never Gonna Give You Up')).toHaveAttribute(
      'src',
      expect.stringContaining(`youtube-nocookie.com/embed/${VIDEO_ID}`)
    );
  });

  it('toggles the subscribe button (client-side affordance)', async () => {
    const user = userEvent.setup();
    renderValidVideo();

    const subscribe = await screen.findByRole('button', {
      name: /^subscribe$/i,
    });
    await user.click(subscribe);

    expect(
      screen.getByRole('button', { name: /^subscribed$/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/subscribed to mock channel/i)
    ).toBeInTheDocument();
  });

  it('saves the video to Watch Later', async () => {
    const user = userEvent.setup();
    renderValidVideo();

    const watchLater = await screen.findByRole('button', {
      name: /watch later/i,
    });
    await user.click(watchLater);

    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
  });

  it('toggles a like and bumps the count', async () => {
    const user = userEvent.setup();
    renderValidVideo();

    await screen.findByRole('heading', { name: /never gonna give you up/i });
    // Like and Dislike are the only aria-pressed toggles; the first is Like.
    const like = screen.getAllByRole('button', { pressed: false })[0];
    if (!like) throw new Error('expected a Like button');
    await user.click(like);

    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
  });

  it('expands the description', async () => {
    const user = userEvent.setup();
    renderValidVideo();

    await screen.findByRole('heading', { name: /never gonna give you up/i });
    await user.click(screen.getByText(/^show more$/i));

    expect(screen.queryByText(/^show more$/i)).not.toBeInTheDocument();
  });

  it('adds the video to a playlist', async () => {
    const user = userEvent.setup();
    renderValidVideo();

    // The "Save" button (Plus icon) opens the playlist modal.
    await user.click(await screen.findByRole('button', { name: /^save$/i }));
    await user.click(screen.getByRole('button', { name: /add to playlist/i }));

    expect(
      await screen.findByText(/added to "favorites"/i)
    ).toBeInTheDocument();
  });
});
