import React, { useState } from 'react';
import type { SpotifyTrack } from '../types/spotify';

interface PlaylistDisplayProps {
  tracks: SpotifyTrack[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  onGetRecommendations?: (trackIds: string[]) => void;
  isLoading?: boolean;
  recommendedTracks?: SpotifyTrack[];
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  onGetRecommendations,
  isLoading,
  recommendedTracks = []
}) => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  if (isLoading) {
    return (
      <div className="playlist-display loading">
        <div className="spinner"></div>
        <p>Finding the perfect tracks...</p>
      </div>
    );
  }

  if (!tracks.length) {
    return <div className="no-tracks">No tracks available</div>;
  }

  const handleGetRecommendations = () => {
    if (onGetRecommendations) {
      const seedTracks = tracks
        .slice(0, 2)
        .map(track => track.id);
      onGetRecommendations(seedTracks);
    }
  };

  return (
    <div className="playlist-display">
      <div className="playlist-header">
        <div className="header-controls">
          <h2>Current Playlist</h2>
          <div className="playlist-tabs">
            <button 
              className={`tab-button ${!showRecommendations ? 'active' : ''}`}
              onClick={() => setShowRecommendations(false)}
            >
              Current
            </button>
            <button 
              className={`tab-button ${showRecommendations ? 'active' : ''}`}
              onClick={() => setShowRecommendations(true)}
            >
              Recommendations
            </button>
          </div>
        </div>
        {tracks.length > 0 && onGetRecommendations && !showRecommendations && (
          <button 
            className="recommendation-button"
            onClick={handleGetRecommendations}
          >
            Get Similar Tracks
          </button>
        )}
      </div>

      <div className="tracks-list">
        {(showRecommendations ? recommendedTracks : tracks).map((track, index) => (
          <div
            key={track.id}
            className={`track-item ${!showRecommendations && index === currentTrackIndex ? 'active' : ''}`}
            onClick={() => onTrackSelect(index)}
          >
            <div className="track-content">
              <img 
                src={track.album.images[0]?.url} 
                alt={track.name}
                className="track-thumbnail"
              />
              <div className="track-info">
                <div className="track-name">{track.name}</div>
                <div className="track-artist">
                  {track.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>
            </div>
            {track.preview_url ? (
              <div className="track-controls">
                <span className="preview-available">Preview Available</span>
                <button className="add-to-playlist" onClick={(e) => {
                  e.stopPropagation();
                  // Add to current playlist logic here
                }}>
                  Add to Playlist
                </button>
              </div>
            ) : (
              <span className="preview-unavailable">No Preview</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDisplay;
