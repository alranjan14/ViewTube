import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Pass an initializer function so the read runs only once, on mount.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Stable setter (depends only on `key`) using the functional update form,
  // so consumers' useCallback/memoization that depend on it stay stable too.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
        return next;
      });
    },
    [key]
  );

  // Keep this tab in sync with writes from other tabs. The parse is guarded so a
  // corrupt value written elsewhere can't throw into React.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStoredValue(JSON.parse(e.newValue) as T);
      } catch (error) {
        console.warn(`Error parsing storage event for key "${key}":`, error);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
