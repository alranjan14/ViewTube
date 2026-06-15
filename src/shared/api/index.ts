import { youtubeProvider } from './youtubeProvider';

// We default to the real YouTube API provider. 
// We rely on MSW (Mock Service Worker) for mocking endpoints during development and tests!
export const apiProvider = youtubeProvider;
