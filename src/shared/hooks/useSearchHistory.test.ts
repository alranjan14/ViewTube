import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSearchHistory } from './useSearchHistory';

describe('useSearchHistory', () => {
  beforeEach(() => localStorage.clear());

  it('adds searches most-recent-first and ignores blanks', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addSearch('react'));
    act(() => result.current.addSearch('  '));
    act(() => result.current.addSearch('redux'));
    expect(result.current.history).toEqual(['redux', 'react']);
  });

  it('dedupes case-insensitively and bumps the entry to the top', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addSearch('React'));
    act(() => result.current.addSearch('vite'));
    act(() => result.current.addSearch('REACT'));
    expect(result.current.history).toEqual(['REACT', 'vite']);
  });

  it('caps history at 5 entries', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((q) =>
        result.current.addSearch(q)
      );
    });
    expect(result.current.history).toHaveLength(5);
    expect(result.current.history[0]).toBe('g');
  });

  it('removes an entry case-insensitively', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addSearch('react'));
    act(() => result.current.removeSearch('REACT'));
    expect(result.current.history).toEqual([]);
  });
});
