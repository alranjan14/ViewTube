/**
 * BFF proxy for YouTube search suggestions.
 *
 * Replaces the old client-side JSONP (<script> injection = arbitrary code by
 * design). The browser calls `/api/suggest?q=...`; this function fetches
 * Google's autocomplete endpoint with the "firefox" client, which returns
 * clean JSON `[query, [suggestion, ...]]`, and forwards it.
 *
 * Runs on Vercel's Edge runtime (free on the Hobby tier).
 */
export const config = { runtime: 'edge' };

const UPSTREAM = 'https://suggestqueries.google.com/complete/search';

export default async function handler(req: Request): Promise<Response> {
  const q = new URL(req.url).searchParams.get('q')?.trim();
  if (!q) return Response.json(['', []]);

  const target = new URL(UPSTREAM);
  target.searchParams.set('client', 'firefox');
  target.searchParams.set('ds', 'yt');
  target.searchParams.set('q', q);

  try {
    const upstream = await fetch(target.toString());
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=0, s-maxage=3600',
      },
    });
  } catch {
    // Suggestions are best-effort — never fail the request.
    return Response.json([q, []]);
  }
}
