import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_LIMITS } from '../config/storage';
import { VideoSummary } from '../types/api';
import { useLibrary } from './useLibrary';

const video = (id: string): VideoSummary => ({
  id,
  title: `Video ${id}`,
  channelId: 'c',
  channelTitle: 'Channel',
  thumbnailUrl: 'thumb',
  viewCount: '1',
  publishedAt: '2026-01-01T00:00:00Z',
  duration: 'PT1M',
});

describe('useLibrary', () => {
  beforeEach(() => localStorage.clear());

  it('adds to history most-recent-first and de-dupes by id', () => {
    const { result } = renderHook(() => useLibrary());
    act(() => result.current.addToHistory(video('1')));
    act(() => result.current.addToHistory(video('2')));
    act(() => result.current.addToHistory(video('1'))); // re-watch bumps to top
    expect(result.current.history.map((v) => v.id)).toEqual(['1', '2']);
  });

  it('caps history at STORAGE_LIMITS.history', () => {
    const { result } = renderHook(() => useLibrary());
    act(() => {
      for (let i = 0; i < STORAGE_LIMITS.history + 10; i++) {
        result.current.addToHistory(video(String(i)));
      }
    });
    expect(result.current.history).toHaveLength(STORAGE_LIMITS.history);
  });

  it('watch-later de-dupes, reports membership, and removes', () => {
    const { result } = renderHook(() => useLibrary());
    act(() => result.current.addToWatchLater(video('a')));
    act(() => result.current.addToWatchLater(video('a')));
    expect(result.current.watchLater).toHaveLength(1);
    expect(result.current.isWatchLater('a')).toBe(true);
    act(() => result.current.removeFromWatchLater('a'));
    expect(result.current.isWatchLater('a')).toBe(false);
  });

  it('caps watch-later at STORAGE_LIMITS.watchLater', () => {
    const { result } = renderHook(() => useLibrary());
    act(() => {
      for (let i = 0; i < STORAGE_LIMITS.watchLater + 5; i++) {
        result.current.addToWatchLater(video(String(i)));
      }
    });
    expect(result.current.watchLater).toHaveLength(STORAGE_LIMITS.watchLater);
  });
});
