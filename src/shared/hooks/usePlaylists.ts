import { useCallback } from 'react';
import { STORAGE_KEYS } from '../config/storage';
import { VideoSummary } from '../types/api';
import { useLocalStorage } from './useLocalStorage';

export interface LocalPlaylist {
  id: string;
  title: string;
  createdAt: string;
  videos: VideoSummary[];
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useLocalStorage<LocalPlaylist[]>(
    STORAGE_KEYS.playlists,
    []
  );

  const createPlaylist = useCallback(
    (title: string) => {
      const newPlaylist: LocalPlaylist = {
        id: `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        createdAt: new Date().toISOString(),
        videos: [],
      };
      setPlaylists((prev) => [newPlaylist, ...prev]);
      return newPlaylist;
    },
    [setPlaylists]
  );

  const deletePlaylist = useCallback(
    (playlistId: string) => {
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    },
    [setPlaylists]
  );

  const addVideoToPlaylist = useCallback(
    (playlistId: string, video: VideoSummary) => {
      setPlaylists((prev) =>
        prev.map((playlist) => {
          if (playlist.id === playlistId) {
            // Prevent duplicates
            if (playlist.videos.some((v) => v.id === video.id)) {
              return playlist;
            }
            return {
              ...playlist,
              videos: [...playlist.videos, video],
            };
          }
          return playlist;
        })
      );
    },
    [setPlaylists]
  );

  const removeVideoFromPlaylist = useCallback(
    (playlistId: string, videoId: string) => {
      setPlaylists((prev) =>
        prev.map((playlist) => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              videos: playlist.videos.filter((v) => v.id !== videoId),
            };
          }
          return playlist;
        })
      );
    },
    [setPlaylists]
  );

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
  };
}
