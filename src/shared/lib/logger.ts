/* eslint-disable no-console -- this module is the single sanctioned console boundary */
import { reportError } from './monitoring';

/**
 * Tiny logging facade. It pretty-prints in dev, keeps warn/error in prod, and
 * forwards errors to the monitoring sink (Sentry, when configured) — the one
 * place to wire reporting without touching call sites. Use this instead of raw
 * `console.*`.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = Record<string, unknown>;

const isDev = import.meta.env.DEV;

function emit(level: LogLevel, message: string, context?: LogContext): void {
  if (isDev) {
    const fn =
      level === 'debug'
        ? console.debug
        : level === 'info'
          ? console.info
          : level === 'warn'
            ? console.warn
            : console.error;
    fn(`[${level}] ${message}`, context ?? '');
    return;
  }

  // Production: keep actionable levels, drop debug/info noise.
  if (level === 'warn') console.warn(message, context);
  if (level === 'error') {
    console.error(message, context);
    reportError(context?.error ?? message, context);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    emit('debug', message, context),
  info: (message: string, context?: LogContext) =>
    emit('info', message, context),
  warn: (message: string, context?: LogContext) =>
    emit('warn', message, context),
  error: (message: string, context?: LogContext) =>
    emit('error', message, context),
};
