import { History, Clock, ListVideo, Trash2, UserCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLibrary } from '../shared/hooks/useLibrary';
import { usePlaylists } from '../shared/hooks/usePlaylists';
import { useWatchLater } from '../shared/hooks/useWatchLater';
import VideoCard from '@/entities/video/VideoCard';

const LibraryPage = () => {
  const { history, clearHistory } = useLibrary();
  const { savedVideos } = useWatchLater();
  const { playlists, deletePlaylist } = usePlaylists();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // slight delay to ensure render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="flex flex-col p-4 sm:p-8 w-full max-w-7xl mx-auto pb-20 gap-12">
      {/* Profile Header (YouTube "You" Page Style) */}
      <div className="flex items-center gap-6 pb-6">
        <UserCircle size={80} strokeWidth={1} className="text-slate-400" />
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Alok
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
            <span>@AlokRanjan</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">
              View channel
            </span>
          </div>
        </div>
      </div>
      {/* History Section */}
      <section id="history" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History size={24} className="text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">History</h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <History
              size={100}
              strokeWidth={0.5}
              className="text-slate-200 mb-6"
            />
            <h3 className="text-2xl font-normal text-slate-900 mb-2">
              Keep track of what you watch
            </h3>
            <p className="text-slate-600 mb-6">
              Your watch history will appear here.
            </p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
            {history.slice(0, 15).map((video) => (
              <div
                key={`history-${video.id}`}
                className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
              >
                <VideoCard info={video} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Watch Later Section */}
      <section id="watch-later" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Watch Later</h2>
          </div>
        </div>

        {savedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Clock
              size={100}
              strokeWidth={0.5}
              className="text-slate-200 mb-6"
            />
            <h3 className="text-2xl font-normal text-slate-900 mb-2">
              Save videos for later
            </h3>
            <p className="text-slate-600 mb-6">
              You haven&apos;t saved any videos yet.
            </p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
            {savedVideos.map((video) => (
              <div
                key={`saved-${video.id}`}
                className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
              >
                <VideoCard info={video} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section id="playlists" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <ListVideo size={24} className="text-slate-700" />
          <h2 className="text-xl font-bold text-slate-900">Playlists</h2>
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <ListVideo
              size={100}
              strokeWidth={0.5}
              className="text-slate-200 mb-6"
            />
            <h3 className="text-2xl font-normal text-slate-900 mb-2">
              Organize your favorite content
            </h3>
            <p className="text-slate-600 mb-6">
              You don&apos;t have any playlists yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex flex-col group">
                <Link
                  to={`/playlist/${playlist.id}`}
                  className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {playlist.videos.length > 0 ? (
                    <img
                      src={
                        playlist.videos[0]?.thumbnails?.medium ||
                        playlist.videos[0]?.thumbnailUrl
                      }
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <ListVideo size={48} />
                    </div>
                  )}
                  {/* Playlist Overlay */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <span className="font-bold text-lg">
                      {playlist.videos.length}
                    </span>
                    <ListVideo size={20} className="mt-1" />
                  </div>
                </Link>
                <div className="flex justify-between items-start mt-2 px-1">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {playlist.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Updated{' '}
                      {new Date(playlist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deletePlaylist(playlist.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-all p-1 rounded-full hover:bg-slate-100"
                    title="Delete Playlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;
