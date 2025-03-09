import React, { useState, useEffect, useRef } from 'react';
import type { SpotifyTrack, SpotifyArtist } from '../types/spotify';

interface PlayerControlsProps {
  track: SpotifyTrack;
  onNext: () => void;
  onPrev: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ track, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (track && track.preview_url) {
      audioRef.current.src = track.preview_url;
      audioRef.current.load();
      handlePlay();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [track]);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    
    // Add event listeners
    const audio = audioRef.current;
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      // Cleanup
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onNext();
  };

  const handleError = (e: Event) => {
    const audio = e.target as HTMLAudioElement;
    let message = 'Failed to play track';
    
    if (audio.error) {
      switch (audio.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Playback aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error while loading';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Audio decoding failed';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Audio format not supported';
          break;
      }
    }
    
    setError(message);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (!audioRef.current || !track.preview_url) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error('Playback failed:', error);
        });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="player-controls-container">
      {error && <div className="player-error">{error}</div>}
      
      <div className="player-progress" onClick={handleProgressClick} ref={progressRef}>
        <div className="progress-bar">
          <div 
            className="progress-filled" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-main">
        <div className="now-playing">
          <img 
            src={track.album.images[0]?.url} 
            alt={track.name} 
            className="track-artwork"
          />
          <div className="track-info">
            <h4 className="track-title">{track.name}</h4>
            <p className="track-artist">
              {track.artists.map((artist: SpotifyArtist) => artist.name).join(', ')}
            </p>
          </div>
        </div>
            
        <div className="controls">
          <button
            className="control-button"
            onClick={onPrev}
            title="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </button>
          
          <button
            className="control-button play-button"
            onClick={handlePlay}
            disabled={!track.preview_url}
            title={!track.preview_url ? 'Preview not available' : isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          
          <button className="control-button" onClick={onNext} title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
        
        <div className="player-extras">
          <div className="volume-control">
            <button className="control-button volume-button" title="Volume">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15 9a5 5 0 0 1 0 6"></path>
                <path d="M19 5a10 10 0 0 1 0 14"></path>
              </svg>
            </button>
            <input 
              type="range" 
              className="volume-slider"
              min={0} 
              max={1} 
              step={0.01} 
              value={volume} 
              onChange={handleVolumeChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
