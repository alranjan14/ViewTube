const YOUTUBE_API_BASE_URL = "https://youtube.googleapis.com/youtube/v3";
const YOUTUBE_SUGGESTIONS_API_URL =
  "https://suggestqueries.google.com/complete/search";

export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";
export const YOUTUBE_REGION = import.meta.env.VITE_YOUTUBE_REGION || "IN";
export const LIVE_CHAT_COUNT = 25;

interface PopularVideoParams {
  maxResults?: number;
  regionCode?: string;
}

export const getPopularVideosUrl = ({
  maxResults = 50,
  regionCode = YOUTUBE_REGION,
}: PopularVideoParams = {}) => {
  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    maxResults: String(maxResults),
    regionCode,
    key: YOUTUBE_API_KEY,
  });

  return `${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`;
};

export const getSearchSuggestionsUrl = (query: string) => {
  const params = new URLSearchParams({
    client: "firefox",
    ds: "yt",
    q: query.trim(),
  });

  return `${YOUTUBE_SUGGESTIONS_API_URL}?${params.toString()}`;
};
