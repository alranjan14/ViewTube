import React from "react";
import { Link } from "react-router-dom";
import { useTrendingVideos } from "../shared/hooks/queries";
import Skeleton from "../shared/ui/Skeleton";
import VideoCard, { AdVideoCard } from "./VideoCard";

const VideoContainer = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrendingVideos();

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
    return <div className="p-6 text-sm text-red-700 bg-red-50 rounded-lg m-4 border border-red-200">{error.message}</div>;
  }

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 p-4 lg:p-6">
        {data?.pages[0]?.items[0] && <AdVideoCard info={data.pages[0].items[0]} />}
        
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((video) => (
              <Link key={video.id} to={"/watch?v=" + video.id} className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
                <VideoCard info={video} />
              </Link>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {hasNextPage && (
        <div className="flex justify-center my-6">
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-full transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
