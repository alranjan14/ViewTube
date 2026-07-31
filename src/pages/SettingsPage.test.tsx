import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SettingsPage from './SettingsPage';
import { STORAGE_KEYS } from '@/shared/config/storage';

describe('SettingsPage', () => {
  afterEach(() => localStorage.clear());

  it('renders the Region and Autoplay preferences', () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole('heading', { name: /region location/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^autoplay$/i })
    ).toBeInTheDocument();
  });

  it('no longer renders the non-functional Language and Theme controls', () => {
    render(<SettingsPage />);

    expect(
      screen.queryByRole('heading', { name: /language/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /theme/i })
    ).not.toBeInTheDocument();
    // Region is now the only <select> on the page.
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
  });

  it('persists the chosen region to localStorage', () => {
    render(<SettingsPage />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'US' },
    });

    expect(localStorage.getItem(STORAGE_KEYS.region)).toBe(
      JSON.stringify('US')
    );
  });

  it('shows the app version sourced from package.json', () => {
    render(<SettingsPage />);

    expect(screen.getByText(`v${__APP_VERSION__}`)).toBeInTheDocument();
  });
});
