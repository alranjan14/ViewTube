import { screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { renderWithProviders } from '../test/utils';

describe('HomePage Integration', () => {
  it('renders loading skeletons initially, then trending videos', async () => {
    renderWithProviders(<HomePage />);

    // MSW will intercept the useTrendingVideos request and return the mock data
    await waitFor(() => {
      expect(screen.getAllByText('Mock Trending Video').length).toBeGreaterThan(0);
    });

    // Check if the mock channel title is rendered
    expect(screen.getAllByText('Mock Channel').length).toBeGreaterThan(0);
  });
});
