import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '@/app/App';
import store from '@/app/store';
import { logger } from '@/shared/lib/logger';
import { initMonitoring } from '@/shared/lib/monitoring';
import './index.css';

// Initialize error reporting (no-op unless VITE_SENTRY_DSN is set in a prod build).
void initMonitoring();

// Catch errors that escape React's render tree (async rejections, non-React listeners).
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', { reason: event.reason });
});
window.addEventListener('error', (event) => {
  logger.error('Uncaught error', {
    message: event.message,
    error: event.error,
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary API calls
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (import.meta.env.DEV) {
  void import('@axe-core/react').then((axe) => {
    void axe.default(React, ReactDOM, 1000);
  });
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
