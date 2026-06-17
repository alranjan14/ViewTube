import React from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchVideos } from "../shared/hooks/queries";
import { ROUTES, generatePath } from "../shared/routes";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query") || "";

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchVideos(query);

  if (!query) {
    return <div className="p-6">Please enter a search query.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading results for &quot;{query}&quot;...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-700">{error.message}</div>;
  }

  return (
    <div className="flex flex-col p-4 w-full max-w-6xl mx-auto pb-20">
      <h2 className="text-xl font-semibold mb-4">Search Results for &quot;{query}&quot;</h2>
      <div className="flex flex-col gap-4">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((video) => (
              <Link key={video.id} to={generatePath(ROUTES.WATCH, {})} onClick={(e) => {
                // Because our watch route uses query params natively, we set it this way:
                e.preventDefault();
                window.location.href = `/watch?v=${video.id}`;
              }}>
                <div className="flex flex-col sm:flex-row gap-4 border border-slate-200 rounded-lg p-2 hover:bg-slate-50 cursor-pointer shadow-sm">
                  <img className="rounded-lg w-full sm:w-80 object-cover aspect-video" alt="thumbnail" src={video.thumbnailUrl} />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">{video.title}</h3>
                    <span className="text-sm text-slate-600 mt-2">{video.channelTitle}</span>
                  </div>
                </div>
              </Link>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {data?.pages[0]?.items.length === 0 && <div className="mt-4 text-slate-600">No results found.</div>}
      
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-full transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More Results'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
