import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import PlaylistPage from './PlaylistPage';
import { STORAGE_KEYS } from '@/shared/config/storage';
import type { LocalPlaylist } from '@/shared/hooks/usePlaylists';
import { renderWithProviders } from '@/test/utils';

const seed = (playlists: LocalPlaylist[]) =>
  localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists));

const renderAt = (id: string) => {
  window.history.pushState({}, '', `/playlist/${id}`);
  return renderWithProviders(
    <Routes>
      <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
    </Routes>
  );
};

describe('PlaylistPage', () => {
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('shows a not-found state for an unknown playlist', () => {
    renderAt('missing');

    expect(screen.getByText(/playlist not found/i)).toBeInTheDocument();
  });

  it('renders an empty playlist', () => {
    seed([
      {
        id: 'pl-1',
        title: 'My Mix',
        createdAt: '2026-06-01T00:00:00Z',
        videos: [],
      },
    ]);
    renderAt('pl-1');

    expect(screen.getByRole('heading', { name: 'My Mix' })).toBeInTheDocument();
    expect(screen.getByText('0 videos')).toBeInTheDocument();
    expect(
      screen.getByText(/no videos in this playlist yet/i)
    ).toBeInTheDocument();
  });

  it('lists videos and can remove one', async () => {
    const user = userEvent.setup();
    seed([
      {
        id: 'pl-1',
        title: 'My Mix',
        createdAt: '2026-06-01T00:00:00Z',
        videos: [
          {
            id: 'vid-1',
            title: 'Seeded Video',
            channelId: 'mock-channel-1',
            channelTitle: 'Mock Channel',
            thumbnailUrl: 'https://i.ytimg.com/x.jpg',
            publishedAt: '2026-06-01T00:00:00Z',
          },
        ],
      },
    ]);
    renderAt('pl-1');

    expect(screen.getByText('1 videos')).toBeInTheDocument();
    expect(screen.getByText('Seeded Video')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /remove from playlist/i })
    );

    expect(screen.getByText('0 videos')).toBeInTheDocument();
    expect(
      screen.getByText(/no videos in this playlist yet/i)
    ).toBeInTheDocument();
  });
});
