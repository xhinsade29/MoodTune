
import React, { useState } from 'react';
import { usePlaylist, SavedPlaylist } from '../context/PlaylistContext';
import MusicPlayer from './MusicPlayer';

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
    <div className="saved-playlists-container">
      <div className="saved-playlists-list">
        <h2>Your Saved Playlists</h2>
        <ul className="saved-playlist-items">
          {savedPlaylists.map(playlist => (
            <li 
              key={playlist.id} 
              className={selectedPlaylist?.id === playlist.id ? 'active' : ''}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="playlist-info">
                <h3>{playlist.name}</h3>
                <div className="playlist-details">
                  <span className="mood-tag">{playlist.emotion}</span>
                  <span className="tracks-count">{playlist.tracks.length} tracks</span>
                  <span className="created-at">{formatDate(playlist.createdAt)}</span>
                </div>
              </div>
              <button 
                className="remove-playlist-btn"
                onClick={(e) => handleRemovePlaylist(e, playlist.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="selected-playlist-player">
        {selectedPlaylist ? (
          <div>
            <h2>Playing: {selectedPlaylist.name}</h2>
            <MusicPlayer emotion={selectedPlaylist.emotion} savedTracks={selectedPlaylist.tracks} />
          </div>
        ) : (
          <div className="select-playlist-prompt">
            <h2>Select a playlist to play</h2>
            <p>Click on any of your saved playlists to listen</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlaylists;
