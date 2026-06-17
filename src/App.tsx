import React, { lazy } from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import { ROUTES } from "./shared/routes";
import store from "./utils/store";

const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
import { PlaySquare } from "lucide-react";

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
        path: "/subscriptions",
        element: <PlaceholderPage title="Subscriptions" description="Sign in to see updates from your favorite ViewTube channels." icon={PlaySquare} />,
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
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
