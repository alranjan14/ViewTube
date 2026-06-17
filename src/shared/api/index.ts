import { mockProvider } from './mockProvider';
import { IVideoProvider } from './videoProvider';
import { youtubeProvider } from './youtubeProvider';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export const apiProvider: IVideoProvider = useMockApi ? mockProvider : youtubeProvider;

// We rely on MSW (Mock Service Worker) for mocking endpoints during development and tests!
