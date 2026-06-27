import { Trash2, ListVideo } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import SearchVideoCard from '../components/SearchVideoCard';
import { usePlaylists } from '../shared/hooks/usePlaylists';

const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { playlists, removeVideoFromPlaylist } = usePlaylists();

  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <ListVideo size={48} className="mb-4 text-slate-300" />
        <p className="text-xl font-medium">Playlist not found</p>
        <Link to="/library" className="mt-4 text-blue-600 hover:underline">
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 w-full max-w-7xl mx-auto pb-20">
      {/* Sidebar Details */}
      <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-gradient-to-b from-slate-200 to-slate-100 rounded-3xl p-6 lg:sticky lg:top-24 shadow-sm border border-slate-200/50">
          <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden mb-6 shadow-md">
            {playlist.videos.length > 0 ? (
              <img
                src={
                  playlist.videos[0]?.thumbnails?.high ||
                  playlist.videos[0]?.thumbnailUrl
                }
                alt={playlist.title}
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <ListVideo size={48} />
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {playlist.title}
          </h1>

          <div className="flex flex-col text-sm text-slate-600 font-medium">
            <span>{playlist.videos.length} videos</span>
            <span>
              Updated {new Date(playlist.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button className="flex-1 bg-slate-900 text-white font-semibold py-2.5 rounded-full hover:bg-slate-800 transition-colors">
              Play all
            </button>
            <button className="flex-1 bg-white text-slate-900 font-semibold py-2.5 rounded-full hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
              Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="flex-1 flex flex-col gap-2">
        {playlist.videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
            <p className="font-medium">No videos in this playlist yet.</p>
            <p className="text-sm mt-1">Videos you add will appear here.</p>
          </div>
        ) : (
          playlist.videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-center gap-2 group/row p-1 hover:bg-slate-50 rounded-2xl"
            >
              <span className="text-slate-400 font-medium w-6 text-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <Link to={`/watch?v=${video.id}`}>
                  <SearchVideoCard info={video} />
                </Link>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeVideoFromPlaylist(playlist.id, video.id);
                }}
                className="opacity-0 group-hover/row:opacity-100 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Remove from playlist"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
