import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import ChannelPage from './ChannelPage';
import { renderWithProviders } from '@/test/utils';

// channelId 'mock-channel-1' is served by the global MSW /channels + /search
// handlers (channel details + channel videos).
const renderAt = (id = 'mock-channel-1') => {
  window.history.pushState({}, '', `/channel/${id}`);
  return renderWithProviders(
    <Routes>
      <Route path="/channel/:channelId" element={<ChannelPage />} />
    </Routes>
  );
};

describe('ChannelPage', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the channel header once details load', async () => {
    renderAt();

    expect(
      await screen.findByRole('heading', { name: 'Mock Channel' })
    ).toBeInTheDocument();
    expect(screen.getByText(/1\.0M subscribers/i)).toBeInTheDocument();
  });

  it('toggles the subscribe button', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(
      await screen.findByRole('button', { name: /^subscribe$/i })
    );

    expect(
      screen.getByRole('button', { name: /^subscribed$/i })
    ).toBeInTheDocument();
  });

  it('switches to the ABOUT tab', async () => {
    const user = userEvent.setup();
    renderAt();

    await screen.findByRole('heading', { name: 'Mock Channel' });
    await user.click(screen.getByRole('button', { name: 'ABOUT' }));

    // "Description" and "Stats" headings only exist on the ABOUT tab.
    expect(
      screen.getByRole('heading', { name: /description/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /stats/i })).toBeInTheDocument();
  });
});
