
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SpotifyTrack } from '../services/musicService';

interface PlaylistContextType {
  savedPlaylists: SavedPlaylist[];
  saveCurrentPlaylist: (name: string, tracks: SpotifyTrack[], emotion: string) => void;
  removePlaylist: (id: string) => void;
}

export interface SavedPlaylist {
  id: string;
  name: string;
  tracks: SpotifyTrack[];
  emotion: string;
  createdAt: Date;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);

  const saveCurrentPlaylist = (name: string, tracks: SpotifyTrack[], emotion: string) => {
    const newPlaylist: SavedPlaylist = {
      id: Date.now().toString(), // Simple ID generation
      name,
      tracks,
      emotion,
      createdAt: new Date()
    };
    
    setSavedPlaylists(prev => [...prev, newPlaylist]);
  };

  const removePlaylist = (id: string) => {
    setSavedPlaylists(prev => prev.filter(playlist => playlist.id !== id));
  };

  return (
    <PlaylistContext.Provider value={{ savedPlaylists, saveCurrentPlaylist, removePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
