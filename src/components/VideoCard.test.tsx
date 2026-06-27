import { screen } from '@testing-library/react';
import { VideoSummary } from '../shared/types/api';
import { renderWithProviders } from '../test/utils';
import VideoCard from './VideoCard';

const mockVideo: VideoSummary = {
  id: 'test-video-1',
  title: 'Test Video Title',
  channelId: 'test-channel-1',
  channelTitle: 'Test Channel Name',
  thumbnailUrl: 'https://via.placeholder.com/320x180.png',
  viewCount: '1500000',
  publishedAt: '2026-06-01T00:00:00Z',
  duration: 'PT10M15S',
};

const renderVideoCard = () => renderWithProviders(<VideoCard info={mockVideo} />);

describe('VideoCard Component', () => {
  it('renders video details correctly', () => {
    renderVideoCard();
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
    expect(screen.getByText('Test Channel Name')).toBeInTheDocument();
    expect(screen.getByText('1.5M views')).toBeInTheDocument();
  });

  it('allows navigation to the channel', () => {
    renderVideoCard();
    const channelText = screen.getByText('Test Channel Name');
    expect(channelText).toHaveClass('cursor-pointer');
  });
});
