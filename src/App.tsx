import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import ChannelPage from "./pages/ChannelPage";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import NotFoundPage from "./pages/NotFoundPage";
import PlaylistPage from "./pages/PlaylistPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SettingsPage from "./pages/SettingsPage";
import WatchPage from "./pages/WatchPage";
import { ROUTES } from "./shared/routes";
import store from "./utils/store";

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
