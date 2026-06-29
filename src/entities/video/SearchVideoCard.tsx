import { MoreVertical } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChannelDetails } from '@/shared/hooks/queries';
import { VideoSummary } from '@/shared/types/api';
import IconButton from '@/shared/ui/IconButton';

const SearchVideoCard = ({ info }: { info: VideoSummary }) => {
  const navigate = useNavigate();
  const {
    title,
    channelId,
    channelTitle,
    thumbnailUrl,
    viewCount,
    publishedAt,
    duration,
  } = info;

  // Fetch actual channel profile picture
  const { data: channelData } = useChannelDetails(channelId);

  // Format views
  const formatViews = (val?: string | number) => {
    if (!val) return '';
    const views = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(views)) return '';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full group p-2 hover:bg-slate-50/80 rounded-2xl transition-colors cursor-pointer">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-full sm:w-[360px] aspect-video overflow-hidden rounded-xl bg-slate-100">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={info.thumbnails?.medium || thumbnailUrl}
          alt={title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://via.placeholder.com/360x202.png?text=No+Thumbnail';
          }}
        />
        {duration && (
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
            {duration}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg sm:text-xl font-medium leading-tight text-slate-900 line-clamp-2">
            {title}
          </h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <IconButton size="sm" aria-label="Video options">
              <MoreVertical size={20} className="text-slate-900" />
            </IconButton>
          </div>
        </div>

        <div className="flex items-center text-xs sm:text-sm text-slate-500 mt-1 mb-3">
          {viewCount && <span>{formatViews(viewCount)}</span>}
          {viewCount && publishedAt && (
            <span className="mx-1.5 text-[10px]">•</span>
          )}
          {publishedAt && (
            <span>{new Date(publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-3 group/channel w-fit mt-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/channel/' + channelId);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              navigate('/channel/' + channelId);
            }
          }}
        >
          {channelData?.thumbnailUrl ? (
            <img
              src={channelData.thumbnailUrl}
              alt={channelTitle}
              className="w-8 h-8 rounded-full object-cover bg-slate-100 shadow-sm"
              loading="lazy"
            />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(channelTitle)}&background=random&color=fff&rounded=true&size=32&font-size=0.4`}
              alt={channelTitle}
              className="w-8 h-8 rounded-full object-cover shadow-sm"
              loading="lazy"
            />
          )}
          <span className="text-sm text-slate-500 group-hover/channel:text-slate-800 transition-colors font-medium">
            {channelTitle}
          </span>
        </div>

        {/* Optional Description snippet could go here if the API returned it in snippet */}
      </div>
    </div>
  );
};

export default memo(SearchVideoCard);
