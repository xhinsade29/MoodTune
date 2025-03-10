
import React, { useState } from 'react';
import { usePlaylist, SavedPlaylist } from '../context/PlaylistContext';
import MusicPlayer from './MusicPlayer';
import styled from 'styled-components';

const PlaylistsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
`;

const PlaylistsList = styled.div`
  flex: 0 0 40%;
  background: var(--background-base);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const PlaylistTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const PlaylistItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlaylistItem = styled.li<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? 'rgba(29, 185, 84, 0.1)' : 'var(--background-highlight)'};
  border-left: ${props => props.$isActive ? '4px solid var(--primary-color)' : 'none'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PlaylistInfo = styled.div`
  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
`;

const MoodTag = styled.span`
  display: inline-block;
  background: var(--primary-color);
  color: var(--black);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.75rem;
  margin-right: 8px;
`;

const PlaylistDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const RemoveButton = styled.button`
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--text-secondary);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ff4444;
    border-color: #ff4444;
  }
`;

const PlayerSection = styled.div`
  flex: 1;
`;

const EmptySelection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  text-align: center;
  background: var(--background-base);
  border-radius: 12px;
`;

const SavedPlaylists: React.FC = () => {
  const { savedPlaylists, removePlaylist } = usePlaylist();
  const [selectedPlaylist, setSelectedPlaylist] = useState<SavedPlaylist | null>(null);

  if (savedPlaylists.length === 0) {
    return (
      <div className="no-playlists">
        <h2>No saved playlists yet</h2>
        <p>Generate music based on your mood on the home page, then save playlists you like.</p>
      </div>
    );
  }

  const handlePlaylistClick = (playlist: SavedPlaylist) => {
    console.log('Selected playlist:', playlist);
    setSelectedPlaylist(playlist);
  };

  const handleRemovePlaylist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removePlaylist(id);
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <PlaylistsContainer>
      <PlaylistsList>
        <PlaylistTitle>Your Saved Playlists</PlaylistTitle>
        <PlaylistItems>
          {savedPlaylists.map((playlist) => (
            <PlaylistItem 
              key={playlist.id} 
              $isActive={selectedPlaylist?.id === playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <PlaylistInfo>
                <h3>{playlist.name}</h3>
                <PlaylistDetails>
                  <MoodTag>{playlist.emotion}</MoodTag>
                  <span>Saved on {formatDate(playlist.createdAt)}</span>
                </PlaylistDetails>
              </PlaylistInfo>
              <RemoveButton 
                onClick={(e) => handleRemovePlaylist(e, playlist.id)}
              >
                Remove
              </RemoveButton>
            </PlaylistItem>
          ))}
        </PlaylistItems>
      </PlaylistsList>
      
      <PlayerSection>
        {selectedPlaylist ? (
          <MusicPlayer 
            emotion={selectedPlaylist.emotion} 
            isLoading={false} 
            initialTracks={selectedPlaylist.tracks}
          />
        ) : (
          <EmptySelection>
            <h2>Select a playlist</h2>
            <p>Click on any of your saved playlists to listen</p>
          </EmptySelection>
        )}
      </PlayerSection>
    </PlaylistsContainer>
  );
};

export default SavedPlaylists;
