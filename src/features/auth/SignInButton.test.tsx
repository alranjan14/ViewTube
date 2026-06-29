import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SignInButton } from './SignInButton';
import { renderWithProviders } from '@/test/utils';

// In the test env VITE_GOOGLE_CLIENT_ID is unset, so SignInButton resolves to
// the graceful fallback — clicking it explains login isn't configured rather
// than throwing or silently doing nothing.
describe('SignInButton (fallback when no client id)', () => {
  it('renders a Sign in button', () => {
    renderWithProviders(<SignInButton />);
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('shows a "not configured" toast on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInButton />);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/not configured/i)).toBeInTheDocument()
    );
  });
});
