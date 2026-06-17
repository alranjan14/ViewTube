import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX_HISTORY_LENGTH = 5;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<string[]>('yt_clone_search_history', []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    setHistory(prev => {
      // Remove existing to push to top
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, MAX_HISTORY_LENGTH);
    });
  }, [setHistory]);

  const removeSearch = useCallback((query: string) => {
    setHistory(prev => prev.filter(item => item.toLowerCase() !== query.toLowerCase()));
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory
  };
}
