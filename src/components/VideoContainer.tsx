import React from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrendingVideos } from "../shared/hooks/queries";
import { useIntersectionObserver } from "../shared/hooks/useIntersectionObserver";
import Skeleton from "../shared/ui/Skeleton";
import VideoCard, { AdVideoCard } from "./VideoCard";

const VideoContainer = ({ activeCategory }: { activeCategory?: string }) => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrendingVideos('IN', 50, activeCategory);

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, { enabled: hasNextPage && !isFetchingNextPage });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <div className="flex gap-3">
              <Skeleton variant="circular" className="w-9 h-9 flex-shrink-0" />
              <div className="flex flex-col gap-2 w-full pt-1">
                <Skeleton className="w-[90%] h-4" />
                <Skeleton className="w-[60%] h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 m-4 sm:m-8 bg-slate-50 border border-slate-200 border-dashed rounded-3xl text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-6 shadow-sm border border-red-100">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">No Trending Videos Found</h3>
        <p className="text-slate-500 max-w-md leading-relaxed">
          {error.message.includes("entity was not found") 
            ? "YouTube doesn't currently have enough trending data for this specific category in your region. Please try exploring a different category!" 
            : error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 p-4 lg:p-6">
        {data?.pages[0]?.items[0] && <AdVideoCard info={data.pages[0].items[0]} />}
        
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((video, index) => {
              if (i === 0 && index === 0) return null;
              return (
                <Link key={video.id} to={"/watch?v=" + video.id} className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
                  <VideoCard info={video} />
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center my-8 w-full">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
              Loading more videos...
            </div>
          ) : (
            <div className="h-10 w-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
