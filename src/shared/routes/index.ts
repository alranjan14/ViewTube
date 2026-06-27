export const ROUTES = {
  HOME: '/',
  WATCH: '/watch',
  SEARCH: '/results',
  EXPLORE: '/explore',
  CHANNEL: '/channel/:channelId',
  PLAYLIST: '/playlist/:playlistId',
  LIBRARY: '/library',
  SETTINGS: '/settings',
} as const;

// Use react-router's type-safe generatePath instead of a hand-rolled replacer.
export { generatePath } from 'react-router-dom';
