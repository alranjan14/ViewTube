const fs = require('fs');
let content = fs.readFileSync('src/shared/api/youtubeProvider.ts', 'utf8');

content = content.replace(/async getTrendingVideos\(([^)]+)\)/g, 'async getTrendingVideos($1, signal?: AbortSignal)');
content = content.replace(/httpClient<any>\(`\$\{YOUTUBE_API_BASE_URL\}\/videos\?\$\{params\.toString\(\)\}`\)/g, 'httpClient<any>(`${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`, { signal })');

content = content.replace(/async getSearchSuggestions\(query: string\)/g, 'async getSearchSuggestions(query: string, signal?: AbortSignal)');
content = content.replace(/httpClient<any>\(`\$\{YOUTUBE_SUGGESTIONS_API_URL\}\?\$\{params\.toString\(\)\}`\)/g, 'httpClient<any>(`${YOUTUBE_SUGGESTIONS_API_URL}?${params.toString()}`, { signal })');

content = content.replace(/async getSearchVideos\(([^)]+)\)/g, 'async getSearchVideos($1, signal?: AbortSignal)');
content = content.replace(/httpClient<any>\(`\$\{YOUTUBE_API_BASE_URL\}\/search\?\$\{params\.toString\(\)\}`\)/g, 'httpClient<any>(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`, { signal })');

content = content.replace(/async getVideoDetails\(videoId: string\)/g, 'async getVideoDetails(videoId: string, signal?: AbortSignal)');
// getVideoDetails uses /videos too, already replaced above

content = content.replace(/async getChannelDetails\(channelId: string\)/g, 'async getChannelDetails(channelId: string, signal?: AbortSignal)');
content = content.replace(/httpClient<any>\(`\$\{YOUTUBE_API_BASE_URL\}\/channels\?\$\{params\.toString\(\)\}`\)/g, 'httpClient<any>(`${YOUTUBE_API_BASE_URL}/channels?${params.toString()}`, { signal })');

content = content.replace(/async getVideoComments\(([^)]+)\)/g, 'async getVideoComments($1, signal?: AbortSignal)');
content = content.replace(/httpClient<any>\(`\$\{YOUTUBE_API_BASE_URL\}\/commentThreads\?\$\{params\.toString\(\)\}`\)/g, 'httpClient<any>(`${YOUTUBE_API_BASE_URL}/commentThreads?${params.toString()}`, { signal })');

fs.writeFileSync('src/shared/api/youtubeProvider.ts', content);

let mockContent = fs.readFileSync('src/shared/api/mockProvider.ts', 'utf8');
mockContent = mockContent.replace(/async getTrendingVideos\(([^)]+)\)/g, 'async getTrendingVideos($1, _signal?: AbortSignal)');
mockContent = mockContent.replace(/async getSearchSuggestions\(query: string\)/g, 'async getSearchSuggestions(query: string, _signal?: AbortSignal)');
mockContent = mockContent.replace(/async getSearchVideos\(([^)]+)\)/g, 'async getSearchVideos($1, _signal?: AbortSignal)');
mockContent = mockContent.replace(/async getVideoDetails\(videoId: string\)/g, 'async getVideoDetails(videoId: string, _signal?: AbortSignal)');
mockContent = mockContent.replace(/async getChannelDetails\(channelId: string\)/g, 'async getChannelDetails(channelId: string, _signal?: AbortSignal)');
mockContent = mockContent.replace(/async getVideoComments\(([^)]+)\)/g, 'async getVideoComments($1, _signal?: AbortSignal)');
fs.writeFileSync('src/shared/api/mockProvider.ts', mockContent);

