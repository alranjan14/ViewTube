import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('reads the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('k', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('hydrates from existing storage', () => {
    localStorage.setItem('k', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('k', 'fallback'));
    expect(result.current[0]).toBe('stored');
  });

  it('persists writes and supports the functional updater', () => {
    const { result } = renderHook(() => useLocalStorage<number>('count', 0));
    act(() => result.current[1]((n) => n + 1));
    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('count')).toBe('1');
  });

  it('keeps a stable setter identity across renders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('k', 'v'));
    const first = result.current[1];
    rerender();
    expect(result.current[1]).toBe(first);
  });

  it('syncs from a cross-tab storage event and ignores corrupt payloads', () => {
    const { result } = renderHook(() => useLocalStorage('k', 'v'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'k', newValue: '"updated"' })
      );
    });
    expect(result.current[0]).toBe('updated');

    // Corrupt JSON must not throw; value stays put.
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'k', newValue: 'not-json{' })
      );
    });
    expect(result.current[0]).toBe('updated');
  });
});
