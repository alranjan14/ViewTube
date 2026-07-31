export const LIVE_CHAT_COUNT = 25;

// Inline 16:9 placeholder shown when a video thumbnail is missing or fails to
// load. Kept as a self-contained data URI (slate-200 field, slate-400 label) so
// the broken-image state never depends on a third-party image host.
const NO_THUMBNAIL_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">' +
  '<rect width="320" height="180" fill="#e2e8f0"/>' +
  '<text x="160" y="90" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16" ' +
  'text-anchor="middle" dominant-baseline="middle">No thumbnail</text>' +
  '</svg>';

export const NO_THUMBNAIL = `data:image/svg+xml,${encodeURIComponent(NO_THUMBNAIL_SVG)}`;
