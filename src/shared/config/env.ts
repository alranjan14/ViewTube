import { z } from 'zod';

/**
 * Single, validated source of truth for client environment configuration.
 * Parsed once at module load so a missing/malformed value fails loudly here
 * instead of deep inside a request.
 *
 * NOTE: there is intentionally no YouTube API key here. The key lives
 * server-side behind the BFF proxy (see `api/youtube/[...path].ts` and the
 * Vite dev proxy in `vite.config.ts`). The browser only ever talks to the
 * same-origin proxy, so the key is never shipped in the client bundle.
 */
const EnvSchema = z.object({
  VITE_USE_MOCK_API: z.enum(['true', 'false']).default('false'),
  VITE_GOOGLE_CLIENT_ID: z.string().default(''),
  VITE_YOUTUBE_REGION: z.string().min(2).default('IN'),
  // Base path of the BFF proxy. Same-origin by default; override only if the
  // proxy is hosted on a different domain.
  VITE_API_BASE_URL: z.string().default('/api/youtube'),
  VITE_SUGGEST_URL: z.string().default('/api/suggest'),
  // Optional error-reporting sink. When empty, monitoring is a no-op and the
  // Sentry SDK is never loaded at runtime.
  VITE_SENTRY_DSN: z.string().default(''),
});

const parsed = EnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    '[config] Invalid environment configuration:',
    parsed.error.issues
  );
}

const env = parsed.success ? parsed.data : EnvSchema.parse({});

export const config = {
  useMockApi: env.VITE_USE_MOCK_API === 'true',
  googleClientId: env.VITE_GOOGLE_CLIENT_ID,
  sentryDsn: env.VITE_SENTRY_DSN,
  youtube: {
    apiBaseUrl: env.VITE_API_BASE_URL,
    suggestUrl: env.VITE_SUGGEST_URL,
    defaultRegion: env.VITE_YOUTUBE_REGION,
  },
} as const;
