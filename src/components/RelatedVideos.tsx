import { Link } from 'react-router-dom';
import { useSearchVideos } from '../shared/hooks/queries';
import Skeleton from '../shared/ui/Skeleton';

const RelatedVideos = ({ title }: { title?: string }) => {
  // We use search based on video title as the best alternative to the deprecated relatedToVideoId
  const { data, isLoading, error } = useSearchVideos(title || '', 20);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900 mb-2 px-2">Up Next</h3>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-2 p-2">
            <Skeleton className="w-[160px] aspect-video rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-2 w-full pt-1">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">
        Failed to load related videos.
      </div>
    );
  }

  const videos = data?.pages[0]?.items || [];

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold text-slate-900 mb-3 px-2">Up Next</h3>
      <div className="flex flex-col gap-2">
        {videos.map((video) => (
          <Link key={video.id} to={`/watch?v=${video.id}`}>
            <div className="flex gap-3 group p-2 hover:bg-slate-50/80 rounded-xl cursor-pointer transition-colors">
              <div className="relative w-[160px] flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={video.thumbnails?.medium || video.thumbnailUrl}
                  alt={video.title}
                />
                {video.duration && (
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-[10px] font-medium rounded">
                    {video.duration}
                  </div>
                )}
              </div>
              <div className="flex flex-col py-0.5 overflow-hidden">
                <h4
                  className="text-sm font-semibold leading-tight text-slate-900 line-clamp-2"
                  title={video.title}
                >
                  {video.title}
                </h4>
                <span className="text-xs text-slate-500 mt-1">
                  {video.channelTitle}
                </span>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  {video.viewCount && (
                    <span>
                      {parseInt(video.viewCount, 10).toLocaleString()} views
                    </span>
                  )}
                  {video.viewCount && video.publishedAt && (
                    <span className="mx-1">•</span>
                  )}
                  {video.publishedAt && (
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
