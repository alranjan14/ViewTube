/**
 * BFF proxy for the YouTube Data API v3.
 *
 * The browser calls `/api/youtube/<resource>` (e.g. `/api/youtube/videos`);
 * this function forwards to `https://youtube.googleapis.com/youtube/v3/<resource>`
 * and injects the API key from a server-side env var. The key is therefore
 * never shipped to the client bundle.
 *
 * Runs on Vercel's Edge runtime (free on the Hobby tier).
 */
export const config = { runtime: 'edge' };

const UPSTREAM = 'https://youtube.googleapis.com/youtube/v3';

// Only these read-only YouTube Data API v3 resources may be proxied, so the
// function can't be used as an open proxy to arbitrary v3 endpoints on our key.
// Matches exactly what the client provider requests.
const ALLOWED_RESOURCES = new Set([
  'videos',
  'search',
  'channels',
  'commentThreads',
]);

// Abort the upstream call if YouTube is slow so the edge function can't hang.
const UPSTREAM_TIMEOUT_MS = 10_000;

export default async function handler(req: Request): Promise<Response> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: { message: 'Server is missing YOUTUBE_API_KEY.' } },
      { status: 500 }
    );
  }

  const incoming = new URL(req.url);
  const resource = incoming.pathname.replace(/^\/api\/youtube\//, '');

  if (!ALLOWED_RESOURCES.has(resource)) {
    return Response.json(
      { error: { message: `Unsupported resource: ${resource}` } },
      { status: 404 }
    );
  }

  const target = new URL(`${UPSTREAM}/${resource}`);
  incoming.searchParams.forEach((value, key) => {
    // Never let the client smuggle its own key through.
    if (key.toLowerCase() !== 'key') target.searchParams.set(key, value);
  });
  target.searchParams.set('key', apiKey);

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    // Network failure or timeout reaching YouTube — return a clean gateway
    // error instead of letting the function throw an unhandled exception.
    return Response.json(
      { error: { message: 'Upstream YouTube API request failed.' } },
      { status: 502 }
    );
  }

  // Pass the body and status through verbatim so the client's httpClient can
  // detect quota/error envelopes; cache successful reads at the edge briefly.
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': upstream.ok
        ? 'public, max-age=0, s-maxage=300'
        : 'no-store',
    },
  });
}
