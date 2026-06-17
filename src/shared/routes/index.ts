export const ROUTES = {
  HOME: "/",
  WATCH: "/watch",
  SEARCH: "/results",
  EXPLORE: "/explore",
  CHANNEL: "/channel/:channelId",
  PLAYLIST: "/playlist/:playlistId",
  LIBRARY: "/library",
  SETTINGS: "/settings",
};

export const generatePath = (path: string, params: Record<string, string> = {}) => {
  let url = path;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};
