/**
 * Centralized localStorage keys — the single source of truth.
 *
 * Values are intentionally kept as-is (the historical `yt_clone_*` / `viewtube_*`
 * mix) so we don't orphan users' existing local data. Centralizing them here
 * removes the magic strings and the typo-creates-a-new-key class of bug; a future
 * migration can unify the prefixes behind a one-time key-rename.
 */
export const STORAGE_KEYS = {
  user: 'viewtube_user',
  history: 'yt_clone_history',
  watchLater: 'yt_clone_watch_later',
  playlists: 'yt_clone_playlists',
  searchHistory: 'yt_clone_search_history',
  region: 'yt_clone_region',
  language: 'yt_clone_language',
  theme: 'yt_clone_theme',
  autoplay: 'yt_clone_autoplay',
} as const;

/**
 * Caps on list-shaped localStorage entries. Each add re-serializes the whole
 * array on the main thread, so unbounded growth is both a memory and a
 * jank risk — bound the lists to a sane recent-window size.
 */
export const STORAGE_LIMITS = {
  history: 50,
  watchLater: 200,
} as const;
