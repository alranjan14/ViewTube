import { config } from '../config/env';
import type { LogContext } from './logger';

/**
 * Error-reporting sink. Sentry is loaded **lazily** and only when
 * `VITE_SENTRY_DSN` is configured — so when it's unset (dev, demos, forks) the
 * SDK is never fetched at runtime and reporting is a no-op. `logger.error`
 * funnels here, as do the global handlers wired in `index.tsx`.
 */
type SentryModule = typeof import('@sentry/react');

let sentry: SentryModule | null = null;
let initialized = false;

export async function initMonitoring(): Promise<void> {
  if (initialized) return;
  initialized = true;

  // Only ship errors from real (prod) builds that have a DSN.
  if (!config.sentryDsn || !import.meta.env.PROD) return;

  try {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn: config.sentryDsn,
      environment: import.meta.env.MODE,
      // Errors only by default — no perf/replay sampling cost unless opted in.
      tracesSampleRate: 0,
    });
    sentry = Sentry;
  } catch {
    // Monitoring is best-effort; a failed init must never break the app.
  }
}

export function reportError(error: unknown, context?: LogContext): void {
  if (!sentry) return;
  const err = error instanceof Error ? error : new Error(String(error));
  sentry.captureException(err, context ? { extra: context } : undefined);
}
