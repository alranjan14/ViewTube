import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { VideoSummary } from '../types/api';
import { usePlaylists } from './usePlaylists';

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

describe('usePlaylists', () => {
  beforeEach(() => localStorage.clear());

  it('creates playlists most-recent-first and deletes by id', () => {
    const { result } = renderHook(() => usePlaylists());

    let first!: { id: string };
    act(() => {
      first = result.current.createPlaylist('Favorites');
    });
    act(() => {
      result.current.createPlaylist('Watch soon');
    });

    expect(result.current.playlists.map((p) => p.title)).toEqual([
      'Watch soon',
      'Favorites',
    ]);

    act(() => result.current.deletePlaylist(first.id));
    expect(result.current.playlists.map((p) => p.title)).toEqual([
      'Watch soon',
    ]);
  });

  it('adds videos to a playlist, ignoring duplicates and unknown ids', () => {
    const { result } = renderHook(() => usePlaylists());

    let playlist!: { id: string };
    act(() => {
      playlist = result.current.createPlaylist('Favorites');
    });

    act(() => result.current.addVideoToPlaylist(playlist.id, video('1')));
    act(() => result.current.addVideoToPlaylist(playlist.id, video('1'))); // dup
    act(() => result.current.addVideoToPlaylist('does-not-exist', video('2')));

    expect(result.current.playlists[0]?.videos.map((v) => v.id)).toEqual(['1']);
  });

  it('removes a video from a playlist while leaving others intact', () => {
    const { result } = renderHook(() => usePlaylists());

    let playlist!: { id: string };
    act(() => {
      playlist = result.current.createPlaylist('Favorites');
    });
    act(() => result.current.addVideoToPlaylist(playlist.id, video('1')));
    act(() => result.current.addVideoToPlaylist(playlist.id, video('2')));

    act(() => result.current.removeVideoFromPlaylist(playlist.id, '1'));
    expect(result.current.playlists[0]?.videos.map((v) => v.id)).toEqual(['2']);

    // Removing against an unknown playlist id is a no-op.
    act(() => result.current.removeVideoFromPlaylist('nope', '2'));
    expect(result.current.playlists[0]?.videos.map((v) => v.id)).toEqual(['2']);
  });
});
