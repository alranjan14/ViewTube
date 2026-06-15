import { useState, useCallback } from 'react';

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isQuotaExceeded: boolean;
};

export function useAsyncData<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isQuotaExceeded: false,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null, isQuotaExceeded: false });
    } catch (error: any) {
      const isQuota = error?.response?.status === 403 && error?.response?.data?.error?.errors?.[0]?.reason === 'quotaExceeded';
      setState({
        data: null,
        isLoading: false,
        error: error as Error,
        isQuotaExceeded: isQuota,
      });
    }
  }, [fetchFn]);

  return { ...state, execute };
}
