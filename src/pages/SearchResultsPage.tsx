import { ListFilter } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchVideoCard from "../components/SearchVideoCard";
import { useSearchVideos } from "../shared/hooks/queries";
import { useIntersectionObserver } from "../shared/hooks/useIntersectionObserver";
import { SearchFilters } from "../shared/types/api";
import Skeleton from "../shared/ui/Skeleton";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query") || "";

  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchVideos(query, 25, filters);

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, { enabled: hasNextPage && !isFetchingNextPage });

  // Calculate RFC 3339 dates for filters
  const getPublishedAfter = (period: 'today' | 'week' | 'month') => {
    const d = new Date();
    if (period === 'today') d.setHours(0,0,0,0);
    if (period === 'week') d.setDate(d.getDate() - 7);
    if (period === 'month') d.setMonth(d.getMonth() - 1);
    return d.toISOString();
  };

  const setTimeFilter = (period: 'all' | 'today' | 'week' | 'month') => {
    setFilters(prev => ({
      ...prev,
      publishedAfter: period === 'all' ? undefined : getPublishedAfter(period)
    }));
  };

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <p className="text-xl font-medium">Please enter a search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full max-w-6xl mx-auto pb-20">
      
      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Results for <span className="text-blue-600">&quot;{query}&quot;</span>
        </h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${showFilters ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
        >
          <ListFilter size={18} />
          Filters
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-8 mb-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">Upload Date</h4>
            <button onClick={() => setTimeFilter('all')} className={`text-left text-sm font-medium ${!filters.publishedAfter ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Any time</button>
            <button onClick={() => setTimeFilter('today')} className={`text-left text-sm font-medium ${filters.publishedAfter === getPublishedAfter('today') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Today</button>
            <button onClick={() => setTimeFilter('week')} className={`text-left text-sm font-medium ${filters.publishedAfter === getPublishedAfter('week') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>This week</button>
            <button onClick={() => setTimeFilter('month')} className={`text-left text-sm font-medium ${filters.publishedAfter === getPublishedAfter('month') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>This month</button>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">Sort By</h4>
            <button onClick={() => setFilters(p => ({...p, order: 'relevance'}))} className={`text-left text-sm font-medium ${(!filters.order || filters.order === 'relevance') ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Relevance</button>
            <button onClick={() => setFilters(p => ({...p, order: 'date'}))} className={`text-left text-sm font-medium ${filters.order === 'date' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Upload date</button>
            <button onClick={() => setFilters(p => ({...p, order: 'viewCount'}))} className={`text-left text-sm font-medium ${filters.order === 'viewCount' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>View count</button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6">
          <p className="font-semibold">Error fetching results</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Results List */}
      <div className="flex flex-col gap-2">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((video) => (
              <Link key={video.id} to={`/watch?v=${video.id}`}>
                <SearchVideoCard info={video} />
              </Link>
            ))}
          </React.Fragment>
        ))}
        
        {/* Loading Skeletons */}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex flex-col gap-4 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-2 w-full">
                <Skeleton className="w-full sm:w-[360px] aspect-video rounded-xl flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full pt-1">
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded mt-1" />
                  <div className="flex items-center gap-2 mt-4">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {data?.pages[0]?.items.length === 0 && !isLoading && (
        <div className="mt-12 flex flex-col items-center text-slate-600">
          <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <ListFilter size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-900">No results found</p>
          <p>Try different keywords or remove search filters</p>
        </div>
      )}
      
      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-10 w-full mt-8 flex justify-center">
           {isFetchingNextPage && (
             <div className="flex items-center gap-2 text-slate-500 font-medium">
               <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
               Loading more results...
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
