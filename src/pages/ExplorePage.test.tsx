import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ExplorePage from './ExplorePage';
import { renderWithProviders } from '@/test/utils';

describe('ExplorePage', () => {
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('renders the category grid and trending list by default', async () => {
    window.history.pushState({}, '', '/explore');
    renderWithProviders(<ExplorePage />);

    expect(
      screen.getByRole('heading', { name: 'Explore' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /music/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /trending now/i })
    ).toBeInTheDocument();
    // Trending grid is fed by the global /videos (chart=mostPopular) handler.
    expect(await screen.findByText('Mock Trending Video')).toBeInTheDocument();
  });

  it('reflects the selected category from the query string', () => {
    window.history.pushState({}, '', '/explore?category=10');
    renderWithProviders(<ExplorePage />);

    expect(screen.getByRole('heading', { name: 'Music' })).toBeInTheDocument();
  });
});
