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

  const target = new URL(`${UPSTREAM}/${resource}`);
  incoming.searchParams.forEach((value, key) => {
    // Never let the client smuggle its own key through.
    if (key.toLowerCase() !== 'key') target.searchParams.set(key, value);
  });
  target.searchParams.set('key', apiKey);

  const upstream = await fetch(target.toString(), {
    headers: { accept: 'application/json' },
  });

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
