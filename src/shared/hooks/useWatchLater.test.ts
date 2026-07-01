import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_LIMITS } from '../config/storage';
import { VideoSummary } from '../types/api';
import { useWatchLater } from './useWatchLater';

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

describe('useWatchLater', () => {
  beforeEach(() => localStorage.clear());

  it('toggles a video in and back out, reporting membership', () => {
    const { result } = renderHook(() => useWatchLater());

    expect(result.current.isSaved('a')).toBe(false);

    act(() => result.current.toggleSave(video('a')));
    expect(result.current.isSaved('a')).toBe(true);
    expect(result.current.savedVideos).toHaveLength(1);

    act(() => result.current.toggleSave(video('a')));
    expect(result.current.isSaved('a')).toBe(false);
    expect(result.current.savedVideos).toHaveLength(0);
  });

  it('prepends new saves and caps at STORAGE_LIMITS.watchLater', () => {
    const { result } = renderHook(() => useWatchLater());

    act(() => {
      for (let i = 0; i < STORAGE_LIMITS.watchLater + 5; i++) {
        result.current.toggleSave(video(String(i)));
      }
    });

    expect(result.current.savedVideos).toHaveLength(STORAGE_LIMITS.watchLater);
    // Most recently added sits at the front.
    expect(result.current.savedVideos[0]?.id).toBe(
      String(STORAGE_LIMITS.watchLater + 4)
    );
  });
});
