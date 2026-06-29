import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../test/mocks/server';
import { renderWithProviders } from '../test/utils';
import SearchResultsPage from './SearchResultsPage';

describe('SearchResultsPage', () => {
  beforeEach(() =>
    window.history.pushState({}, '', '/search?search_query=react')
  );
  afterEach(() => window.history.pushState({}, '', '/'));

  it('prompts for a query when none is present', () => {
    window.history.pushState({}, '', '/search');
    renderWithProviders(<SearchResultsPage />);
    expect(
      screen.getByText(/please enter a search query/i)
    ).toBeInTheDocument();
  });

  it('shows an empty state when the API returns no results', async () => {
    server.use(
      http.get('/api/youtube/search', () => HttpResponse.json({ items: [] }))
    );
    renderWithProviders(<SearchResultsPage />);
    await waitFor(() =>
      expect(screen.getByText(/no results found/i)).toBeInTheDocument()
    );
  });

  it('surfaces the quota-exceeded banner with a retry on 403', async () => {
    server.use(
      http.get('/api/youtube/search', () =>
        HttpResponse.json(
          {
            error: { message: 'quota', errors: [{ reason: 'quotaExceeded' }] },
          },
          { status: 403 }
        )
      )
    );
    renderWithProviders(<SearchResultsPage />);
    await waitFor(() =>
      expect(screen.getByText(/daily api quota reached/i)).toBeInTheDocument()
    );
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });
});
