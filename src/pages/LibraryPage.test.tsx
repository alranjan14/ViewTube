import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LibraryPage from './LibraryPage';
import { login } from '@/app/slices/authSlice';
import { renderWithProviders } from '@/test/utils';

describe('LibraryPage', () => {
  afterEach(() => localStorage.clear());

  it('prompts anonymous visitors to sign in instead of showing a hardcoded identity', () => {
    renderWithProviders(<LibraryPage />);

    expect(
      screen.getByRole('heading', { name: /your library/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to see your channel/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('renders the signed-in user identity', () => {
    const { store } = renderWithProviders(<LibraryPage />);

    act(() => {
      store.dispatch(
        login({
          name: 'Jane Doe',
          email: 'jane@example.com',
          picture: 'https://example.com/jane.png',
        })
      );
    });

    expect(
      screen.getByRole('heading', { name: 'Jane Doe' })
    ).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /sign in/i })
    ).not.toBeInTheDocument();
  });

  it('shows empty states for history, watch later, and playlists', () => {
    renderWithProviders(<LibraryPage />);

    expect(
      screen.getByText(/keep track of what you watch/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/save videos for later/i)).toBeInTheDocument();
    expect(
      screen.getByText(/organize your favorite content/i)
    ).toBeInTheDocument();
  });
});
