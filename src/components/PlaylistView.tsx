// PlaylistView.tsx
import React from 'react';
import type { SpotifyTrack, SpotifyArtist } from '../types/spotify';

interface PlaylistViewProps {
  tracks: SpotifyTrack[];
  onClose: () => void;
  onPlayTrack?: (index: number) => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ tracks, onClose, onPlayTrack }) => {
  const handleTrackSelect = (index: number) => {
    if (onPlayTrack) {
      onPlayTrack(index);
    }
  };

  return (
    <div className="playlist-view-overlay">
      <div className="playlist-view">
        <div className="playlist-header">
          <h2>Full Playlist</h2>
          <div className="playlist-actions">
            <button className="playlist-action-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play All
            </button>
            <button className="playlist-action-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
              Shuffle
            </button>
            <button onClick={onClose} className="close-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="playlist-tracks">
          {tracks.map((track, index) => (
            <div 
              key={track.id} 
              className="playlist-track-item"
              onClick={() => handleTrackSelect(index)}
            >
              <div className="track-number">{index + 1}</div>
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="track-thumbnail"
              />
              <div className="track-details">
                <h3 className="track-title">{track.name}</h3>
                <div className="track-meta">
                  <p className="track-artist">
                    {track.artists.map((artist: SpotifyArtist) => artist.name).join(', ')}
                  </p>
                  <p className="album-name">{track.album.name}</p>
                </div>
              </div>
              <div className="track-actions">
                <button className="track-action-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button className="track-action-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
                <button className="track-action-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;