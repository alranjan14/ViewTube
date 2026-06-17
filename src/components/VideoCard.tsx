import { CircleUser, MoreVertical } from "lucide-react";
import React from "react";
import { VideoSummary } from "../shared/types/api";
import IconButton from "../shared/ui/IconButton";

const VideoCard = ({ info }: { info: VideoSummary }) => {
  const { title, channelTitle, thumbnailUrl, viewCount, publishedAt, duration } = info;

  // Format views
  const formatViews = (val?: string | number) => {
    if (!val) return "No views";
    const views = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(views)) return "No views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  return (
    <div className="flex flex-col gap-3 group cursor-pointer w-full">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
        <img 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          src={info.thumbnails?.medium || thumbnailUrl}
          srcSet={
            info.thumbnails
              ? `${info.thumbnails.default || thumbnailUrl} 120w, 
                 ${info.thumbnails.medium || thumbnailUrl} 320w, 
                 ${info.thumbnails.high || thumbnailUrl} 480w,
                 ${info.thumbnails.standard || thumbnailUrl} 640w`
              : `${thumbnailUrl} 320w`
          }
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          alt={title} 
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/320x180.png?text=No+Thumbnail";
            target.srcset = "";
          }}
        />
        {duration && (
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
            {duration}
          </div>
        )}
      </div>
      
      {/* Meta */}
      <div className="flex gap-3 pr-2">
        <div className="flex-shrink-0 mt-0.5">
          <CircleUser size={36} strokeWidth={1} className="text-slate-400" />
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="text-sm text-slate-500 mt-1 flex flex-col">
            <span className="hover:text-slate-800 transition-colors">{channelTitle}</span>
            <div className="flex items-center text-xs mt-0.5">
              <span>{formatViews(viewCount)}</span>
              {publishedAt && (
                <>
                  <span className="mx-1 text-[10px]">•</span>
                  <span>{new Date(publishedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton size="sm" aria-label="Video options">
            <MoreVertical size={20} className="text-slate-900" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export const AdVideoCard = ({ info }: { info: VideoSummary }) => {
  return (
    <div className="relative border border-slate-200 bg-slate-50 rounded-2xl p-2 hover:shadow-md transition-shadow">
      <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        Ad
      </div>
      <VideoCard info={info} />
    </div>
  );
};

export default VideoCard;
