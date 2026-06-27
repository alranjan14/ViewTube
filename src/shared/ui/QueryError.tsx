import { AlertCircle, DatabaseZap } from 'lucide-react';
import { QuotaExceededError } from '../api/httpClient';

interface QueryErrorProps {
  error: Error;
  title?: string;
  onRetry?: () => void;
}

/** Shared error state for data lists. Special-cases quota exhaustion with a hint to use mock mode. */
export function QueryError({
  error,
  title = 'Something went wrong',
  onRetry,
}: QueryErrorProps) {
  const isQuota =
    error instanceof QuotaExceededError || error.name === 'QuotaExceededError';

  const heading = isQuota ? 'Daily API quota reached' : title;
  const message = isQuota
    ? "YouTube's daily API quota is used up. Set VITE_USE_MOCK_API=true to keep exploring with mock data, or try again after it resets."
    : error.message;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-4 m-4 sm:m-8 bg-slate-50 border border-slate-200 border-dashed rounded-3xl text-center">
      <div
        className={`w-20 h-20 flex items-center justify-center rounded-full mb-6 shadow-sm border ${
          isQuota
            ? 'bg-amber-50 text-amber-500 border-amber-100'
            : 'bg-red-50 text-red-500 border-red-100'
        }`}
      >
        {isQuota ? (
          <DatabaseZap size={36} strokeWidth={1.5} />
        ) : (
          <AlertCircle size={36} strokeWidth={1.5} />
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
        {heading}
      </h3>
      <p className="text-slate-500 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
