import React from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../shared/hooks/useLibrary";
import { ROUTES, generatePath } from "../shared/routes";
import { VideoSummary } from "../shared/types/api";

const VideoRow = ({ title, videos }: { title: string; videos: VideoSummary[] }) => {
  if (videos.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={generatePath(ROUTES.WATCH, {})}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/watch?v=${video.id}`;
            }}
            className="flex-none w-64 snap-start hover:bg-slate-50 rounded-lg p-2 transition-colors"
          >
            <img className="rounded-lg w-full aspect-video object-cover mb-2" alt={video.title} src={video.thumbnailUrl} />
            <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{video.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{video.channelTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const LibraryPage = () => {
  const { history, watchLater, clearHistory } = useLibrary();

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Library
        </h1>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 && watchLater.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <p className="text-lg">Your library is empty.</p>
          <p className="text-sm mt-2">Videos you watch will appear here.</p>
        </div>
      )}

      <VideoRow title="Watch Later" videos={watchLater} />
      <VideoRow title="History" videos={history} />
    </div>
  );
};

export default LibraryPage;
