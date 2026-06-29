import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChannelDetails, useChannelVideos } from '../shared/hooks/queries';
import { useIntersectionObserver } from '../shared/hooks/useIntersectionObserver';
import Button from '../shared/ui/Button';
import Skeleton from '../shared/ui/Skeleton';
import VideoCard from '@/entities/video/VideoCard';

const ChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [activeTab, setActiveTab] = useState<'VIDEOS' | 'ABOUT'>('VIDEOS');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    data: channel,
    isLoading: isChannelLoading,
    error: channelError,
  } = useChannelDetails(channelId!);

  const {
    data: videosData,
    isLoading: isVideosLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChannelVideos(channelId!);

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    { enabled: hasNextPage && !isFetchingNextPage }
  );

  if (isChannelLoading) {
    return (
      <div className="w-full h-full flex flex-col animate-pulse">
        <div className="w-full h-32 md:h-48 lg:h-64 bg-slate-200"></div>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-slate-200 flex-shrink-0"></div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="h-6 sm:h-8 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (channelError || !channel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Channel not found
        </h2>
        <p className="text-slate-500 mt-2">
          The channel you are looking for does not exist or an error occurred.
        </p>
      </div>
    );
  }

  // Format numbers
  const formatCount = (val?: string) => {
    if (!val) return '0';
    const num = parseInt(val, 10);
    if (isNaN(num)) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return `${num}`;
  };

  const videos = videosData?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="w-full pb-10">
      {/* Banner */}
      <div className="w-full h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-blue-100 to-red-100 relative overflow-hidden">
        {channel.bannerImageUrl && (
          <img
            src={channel.bannerImageUrl}
            alt={`${channel.title} banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
          <img
            src={channel.thumbnailUrl}
            alt={channel.title}
            className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {channel.title}
            </h1>
            <div className="flex items-center text-sm sm:text-base text-slate-600 mt-1 gap-2">
              <span className="font-medium text-slate-800">
                @{channel.title.replace(/\s+/g, '').toLowerCase()}
              </span>
              <span>•</span>
              <span>{formatCount(channel.subscriberCount)} subscribers</span>
              <span>•</span>
              <span>{formatCount(channel.videoCount)} videos</span>
            </div>
            {channel.description && (
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 max-w-2xl">
                {channel.description}
              </p>
            )}
          </div>
          <div className="mt-2 sm:mt-0">
            <Button
              variant={isSubscribed ? 'secondary' : 'primary'}
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={isSubscribed ? '' : 'bg-slate-900 hover:bg-slate-800'}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 border-b border-slate-200 mt-6 sm:mt-8">
          <button
            onClick={() => setActiveTab('VIDEOS')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'VIDEOS'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            VIDEOS
            {activeTab === 'VIDEOS' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-t"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'ABOUT'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            ABOUT
            {activeTab === 'ABOUT' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-t"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'VIDEOS' && (
          <div>
            {isVideosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {Array(10)
                  .fill('')
                  .map((_, i) => (
                    <Skeleton key={i} />
                  ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                This channel has no videos.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                  {videos.map((video) => (
                    <VideoCard key={video.id} info={video} />
                  ))}
                </div>
                {/* Intersection Observer Target */}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="w-full h-20 flex items-center justify-center mt-4"
                  >
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
                        Loading more videos...
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'ABOUT' && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Description
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
              {channel.description ||
                'No description available for this channel.'}
            </p>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Stats</h2>
              <ul className="flex flex-col gap-3 text-sm text-slate-600">
                <li className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span>Joined</span>
                  <span className="font-medium text-slate-800">Unknown</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span>Views</span>
                  <span className="font-medium text-slate-800">
                    {formatCount(channel.viewCount)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
