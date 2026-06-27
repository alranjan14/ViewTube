import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Plus,
  CircleUser,
  Check,
  Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import CommentsContainer from '../components/CommentsContainer';
import LiveChat from '../components/LiveChat';
import RelatedVideos from '../components/RelatedVideos';
import { useVideoDetails, useChannelDetails } from '../shared/hooks/queries';
import { useLibrary } from '../shared/hooks/useLibrary';
import { usePlaylists } from '../shared/hooks/usePlaylists';
import { useWatchLater } from '../shared/hooks/useWatchLater';
import Button from '../shared/ui/Button';
import { Modal } from '../shared/ui/Modal';
import Skeleton from '../shared/ui/Skeleton';
import { useToast } from '../shared/ui/Toast';
import { closeMenu } from '../utils/appSlice';

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const rawVideoId = searchParams.get('v');
  const videoId =
    rawVideoId && YOUTUBE_ID_PATTERN.test(rawVideoId) ? rawVideoId : null;
  const [showFullDesc, setShowFullDesc] = useState(false);

  const dispatch = useDispatch();
  const { data: videoDetails, isLoading } = useVideoDetails(videoId || '');
  const { data: channelDetails } = useChannelDetails(
    videoDetails?.channelId || ''
  );
  const { addToHistory } = useLibrary();
  const { isSaved, toggleSave } = useWatchLater();
  const { playlists, createPlaylist, addVideoToPlaylist } = usePlaylists();
  const toast = useToast();
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('Favorites');

  const handleConfirmPlaylist = () => {
    const name = playlistName.trim();
    if (!videoDetails || !name) return;

    let playlist = playlists.find(
      (p) => p.title.toLowerCase() === name.toLowerCase()
    );
    if (!playlist) {
      playlist = createPlaylist(name);
    }

    // Convert to VideoSummary
    addVideoToPlaylist(playlist.id, {
      id: videoDetails.id,
      title: videoDetails.title,
      channelId: videoDetails.channelId,
      channelTitle: videoDetails.channelTitle,
      thumbnailUrl: videoDetails.thumbnailUrl,
      viewCount: videoDetails.viewCount,
      publishedAt: videoDetails.publishedAt,
      duration: videoDetails.duration,
    });
    toast.success(`Added to "${playlist.title}"`);
    setPlaylistModalOpen(false);
  };

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [videoId]);

  useEffect(() => {
    if (videoDetails) {
      addToHistory(videoDetails);
    }
  }, [videoDetails, addToHistory]);

  if (!videoId) {
    return (
      <div className="p-6 text-sm text-red-700 bg-red-50 m-4 rounded-xl border border-red-100">
        Missing or invalid video id.
      </div>
    );
  }

  // Format numbers
  const formatCompact = (val?: string | number) => {
    if (!val) return '0';
    const num = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(num)) return '0';

    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 w-full max-w-[1800px] mx-auto">
      {/* Left Column: Player & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={videoDetails?.title || 'YouTube video player'}
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Metadata Section */}
        {isLoading ? (
          <div className="mt-4 flex flex-col gap-3">
            <Skeleton className="w-3/4 h-8" />
            <div className="flex justify-between mt-2">
              <Skeleton className="w-48 h-10 rounded-full" />
              <Skeleton className="w-48 h-10 rounded-full" />
            </div>
          </div>
        ) : videoDetails ? (
          <div className="mt-4 flex flex-col gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {videoDetails.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Channel Info */}
              <div className="flex items-center gap-4">
                <Link
                  to={`/channel/${videoDetails.channelId}`}
                  className="flex items-center gap-3 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {channelDetails?.thumbnailUrl ? (
                    <img
                      src={channelDetails.thumbnailUrl}
                      alt={channelDetails.title}
                      className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-blue-500 transition-all"
                    />
                  ) : (
                    <CircleUser
                      size={40}
                      strokeWidth={1}
                      className="text-slate-400 group-hover:text-slate-600 transition-colors"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {channelDetails?.title || videoDetails.channelTitle}
                    </span>
                    <span className="text-xs text-slate-500">
                      {channelDetails?.subscriberCount
                        ? formatCompact(channelDetails.subscriberCount) +
                          ' subscribers'
                        : 'Loading...'}
                    </span>
                  </div>
                </Link>
                <Button variant="primary" className="ml-2">
                  Subscribe
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                <div className="flex items-center bg-slate-100 rounded-full">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 transition-colors rounded-l-full border-r border-slate-300">
                    <ThumbsUp size={18} />
                    <span className="text-sm font-medium">
                      {formatCompact(videoDetails.likeCount)}
                    </span>
                  </button>
                  <button className="px-4 py-2 hover:bg-slate-200 transition-colors rounded-r-full">
                    <ThumbsDown size={18} />
                  </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full font-medium text-sm">
                  <Share2 size={18} />
                  Share
                </button>

                <button
                  onClick={() => toggleSave(videoDetails)}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-slate-200 transition-colors rounded-full font-medium text-sm ${isSaved(videoDetails.id) ? 'bg-slate-200 text-slate-900' : 'bg-slate-100'}`}
                >
                  {isSaved(videoDetails.id) ? (
                    <Check size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                  {isSaved(videoDetails.id) ? 'Saved' : 'Watch Later'}
                </button>

                <button
                  onClick={() => setPlaylistModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full font-medium text-sm"
                >
                  <Plus size={18} />
                  Save
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div
              role="button"
              tabIndex={0}
              aria-expanded={showFullDesc}
              className={`mt-4 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl p-4 text-sm cursor-pointer text-left ${!showFullDesc ? 'cursor-s-resize' : ''}`}
              onClick={() => setShowFullDesc(!showFullDesc)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowFullDesc(!showFullDesc);
                }
              }}
            >
              <div className="font-semibold mb-1">
                {formatCompact(videoDetails.viewCount)} views •{' '}
                {new Date(videoDetails.publishedAt || '').toLocaleDateString()}
              </div>
              <p
                className={`whitespace-pre-wrap text-slate-700 ${!showFullDesc ? 'line-clamp-3' : ''}`}
              >
                {videoDetails.description || 'No description provided.'}
              </p>
              {!showFullDesc && (
                <div className="font-semibold mt-2">Show more</div>
              )}
            </div>
          </div>
        ) : null}

        <CommentsContainer videoId={videoId} />
      </div>

      {/* Right Column: Live Chat & Up Next */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4">
        {videoDetails?.liveStreaming?.isLive && <LiveChat />}
        {/* Related videos rail */}
        {!videoDetails?.liveStreaming?.isLive && (
          <RelatedVideos title={videoDetails?.title} />
        )}
      </div>

      <Modal
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        title="Save to playlist"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmPlaylist();
          }}
        >
          <label
            htmlFor="playlist-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Playlist name
          </label>
          <input
            id="playlist-name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="e.g. Favorites"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPlaylistModalOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playlistName.trim()}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Add to playlist
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WatchPage;
