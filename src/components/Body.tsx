import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { config } from '../shared/config/env';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';
import Head from './Head';
import Sidebar from './Sidebar';

const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
  </div>
);

const Body = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Head />
      {config.useMockApi && (
        <div
          role="status"
          className="bg-amber-100 text-amber-900 text-xs font-medium text-center py-1.5 px-4 border-b border-amber-200"
        >
          Mock mode — showing simulated data (no live YouTube API calls).
        </div>
      )}
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset}>
                <React.Suspense fallback={<PageLoader />}>
                  <Outlet />
                </React.Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </main>
      </div>
    </div>
  );
};

export default Body;
