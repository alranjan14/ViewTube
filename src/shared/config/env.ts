import { z } from 'zod';

/**
 * Single, validated source of truth for client environment configuration.
 * Parsed once at module load so a missing/malformed value fails loudly here
 * instead of deep inside a request.
 */
const EnvSchema = z.object({
  VITE_USE_MOCK_API: z.enum(['true', 'false']).default('false'),
  VITE_GOOGLE_CLIENT_ID: z.string().default(''),
  VITE_YOUTUBE_API_KEY: z.string().default(''),
  VITE_YOUTUBE_REGION: z.string().min(2).default('IN'),
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
  youtube: {
    apiKey: env.VITE_YOUTUBE_API_KEY,
    defaultRegion: env.VITE_YOUTUBE_REGION,
  },
} as const;

// Fail soft but visibly: live mode with no API key will never work.
if (import.meta.env.DEV && !config.useMockApi && !config.youtube.apiKey) {
  console.warn(
    '[config] VITE_USE_MOCK_API is not "true" but VITE_YOUTUBE_API_KEY is empty — ' +
      'live YouTube requests will fail. Set the key or enable mock mode.'
  );
}
