import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import Head from '@/widgets/Head';

describe('Head Component', () => {
  it('renders logo text and search input', () => {
    renderWithProviders(<Head />);
    expect(screen.getByText('ViewTube')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^search$/i })
    ).toBeInTheDocument();
  });
});
