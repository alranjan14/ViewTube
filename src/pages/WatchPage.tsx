import { ThumbsUp, ThumbsDown, Share2, Plus, CircleUser } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import CommentsContainer from "../components/CommentsContainer";
import LiveChat from "../components/LiveChat";
import { useVideoDetails } from "../shared/hooks/queries";
import { useLibrary } from "../shared/hooks/useLibrary";
import Button from "../shared/ui/Button";
import Skeleton from "../shared/ui/Skeleton";
import { closeMenu } from "../utils/appSlice";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const dispatch = useDispatch();
  const { data: videoDetails, isLoading } = useVideoDetails(videoId || "");
  const { addToHistory } = useLibrary();

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    if (videoDetails) {
      addToHistory(videoDetails);
    }
  }, [videoDetails, addToHistory]);

  if (!videoId) {
    return <div className="p-6 text-sm text-red-700 bg-red-50 m-4 rounded-xl border border-red-100">Missing video id.</div>;
  }

  // Format numbers
  const formatCompact = (val?: string | number) => {
    if (!val) return "0";
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num)) return "0";
    
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
            src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1"}
            title={videoDetails?.title || "YouTube video player"}
            frameBorder="0"
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{videoDetails.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Channel Info */}
              <div className="flex items-center gap-4">
                <Link to={`/channel/${videoDetails.channelId}`} className="flex items-center gap-3 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                  <CircleUser size={40} strokeWidth={1} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{videoDetails.channelTitle}</span>
                    <span className="text-xs text-slate-500">1.2M subscribers</span>
                  </div>
                </Link>
                <Button variant="primary" className="ml-2">Subscribe</Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                <div className="flex items-center bg-slate-100 rounded-full">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 transition-colors rounded-l-full border-r border-slate-300">
                    <ThumbsUp size={18} />
                    <span className="text-sm font-medium">{formatCompact(videoDetails.likeCount)}</span>
                  </button>
                  <button className="px-4 py-2 hover:bg-slate-200 transition-colors rounded-r-full">
                    <ThumbsDown size={18} />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full font-medium text-sm">
                  <Share2 size={18} />
                  Share
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full font-medium text-sm">
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
                {formatCompact(videoDetails.viewCount)} views • {new Date(videoDetails.publishedAt || '').toLocaleDateString()}
              </div>
              <p className={`whitespace-pre-wrap text-slate-700 ${!showFullDesc ? 'line-clamp-3' : ''}`}>
                {videoDetails.description || "No description provided."}
              </p>
              {!showFullDesc && <div className="font-semibold mt-2">Show more</div>}
            </div>
          </div>
        ) : null}

        <CommentsContainer videoId={videoId} />
      </div>

      {/* Right Column: Live Chat & Up Next */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4">
        {videoDetails?.liveStreaming?.isLive && <LiveChat />}
        {/* Placeholder for related videos rail */}
        {!videoDetails?.liveStreaming?.isLive && (
          <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
             <h3 className="font-semibold text-slate-800">Up Next</h3>
             <p className="text-sm text-slate-500">Related videos will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
