export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/** Raised when the YouTube Data API daily quota is exhausted (403 + reason `quotaExceeded`). */
export class QuotaExceededError extends ApiError {
  constructor(
    message = 'YouTube API quota exceeded. Try mock mode or wait for the daily reset.'
  ) {
    super(message, 403);
    this.name = 'QuotaExceededError';
  }
}

/** Minimal shape of the Google API error envelope we care about. */
interface ApiErrorBody {
  error?: {
    message?: string;
    errors?: Array<{ reason?: string }>;
  };
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function httpClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, signal, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = (await response
        .json()
        .catch(() => null)) as ApiErrorBody | null;
      const message = body?.error?.message || response.statusText;
      const reason = body?.error?.errors?.[0]?.reason;
      if (response.status === 403 && reason === 'quotaExceeded') {
        throw new QuotaExceededError(message);
      }
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}
