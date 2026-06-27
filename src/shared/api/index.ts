import { config } from '../config/env';
import { mockProvider } from './mockProvider';
import { IVideoProvider } from './videoProvider';
import { youtubeProvider } from './youtubeProvider';

export const apiProvider: IVideoProvider = config.useMockApi
  ? mockProvider
  : youtubeProvider;

// We rely on MSW (Mock Service Worker) for mocking endpoints during development and tests!
