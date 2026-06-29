import { GoogleOAuthProvider } from '@react-oauth/google';
import { PlaySquare } from 'lucide-react';
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { config } from '@/shared/config/env';
import { ROUTES } from '@/shared/routes';
import { ToastProvider } from '@/shared/ui/Toast';
import Body from '@/widgets/Body';

const ChannelPage = lazy(() => import('@/pages/ChannelPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const LibraryPage = lazy(() => import('@/pages/LibraryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PlaylistPage = lazy(() => import('@/pages/PlaylistPage'));
const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const WatchPage = lazy(() => import('@/pages/WatchPage'));
const PlaceholderPage = lazy(() => import('@/pages/PlaceholderPage'));

const appRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Body />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.EXPLORE,
        element: <ExplorePage />,
      },
      {
        path: '/subscriptions',
        element: (
          <PlaceholderPage
            title="Subscriptions"
            description="Sign in to see updates from your favorite ViewTube channels."
            icon={PlaySquare}
          />
        ),
      },
      {
        path: ROUTES.WATCH,
        element: <WatchPage />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchResultsPage />,
      },
      {
        path: ROUTES.CHANNEL,
        element: <ChannelPage />,
      },
      {
        path: ROUTES.PLAYLIST,
        element: <PlaylistPage />,
      },
      {
        path: ROUTES.LIBRARY,
        element: <LibraryPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
]);

function App() {
  const tree = (
    <ToastProvider>
      <RouterProvider router={appRouter} />
    </ToastProvider>
  );

  // GoogleOAuthProvider throws on an empty clientId, which would crash the whole
  // app in mock/demo mode. Mount it only when configured; `SignInButton` is kept
  // in lockstep so `useGoogleLogin` is never called without this provider.
  return config.googleClientId ? (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      {tree}
    </GoogleOAuthProvider>
  ) : (
    tree
  );
}

export default App;
