import React, { useState, useEffect } from 'react';
import { getTracksForEmotion, getPlaylistForEmotion, SpotifyTrack } from '../services/musicService';
import {
  PlayerContainer,
  NowPlaying,
  AlbumArt,
  SongInfo,
  SongTitle,
  ArtistName,
  Controls,
  PlayButton,
  ControlButton,
  ProgressBar
} from '../styles/MusicPlayerStyles';

interface MusicPlayerProps {
  emotion: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ emotion }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      if (!emotion) return;
      
      setIsLoading(true);
      setPlaybackError(null);
      
      try {
        // You can use either method based on your preference
        // const newTracks = await getTracksForEmotion(emotion);
        const newTracks = await getPlaylistForEmotion(emotion);
        
        setTracks(newTracks);
        setCurrentTrackIndex(0);
      } catch (error) {
        console.error("Error loading tracks:", error);
        setPlaybackError("Couldn't load music for this mood. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [emotion]);

  const currentTrack = tracks[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex < tracks.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : tracks.length - 1
    );
  };

  if (isLoading) {
    return <div>Finding the perfect tunes for your mood...</div>;
  }

  if (playbackError) {
    return <div>{playbackError}</div>;
  }

  if (!currentTrack) {
    return <div>Share your mood to get music recommendations</div>;
  }

  return (
    <PlayerContainer>
      <NowPlaying>
        <AlbumArt>
          <img 
            src={currentTrack.album?.images[0]?.url || '/default-album-art.png'} 
            alt={currentTrack.name} 
            style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          />
        </AlbumArt>
        <SongInfo>
          <SongTitle>{currentTrack.name}</SongTitle>
          <ArtistName>{currentTrack.artists.map(artist => artist.name).join(', ')}</ArtistName>
        </SongInfo>
        <Controls>
          <ControlButton onClick={handlePrevious}>⏮</ControlButton>
          <PlayButton>▶</PlayButton>
          <ControlButton onClick={handleNext}>⏭</ControlButton>
        </Controls>
        <ProgressBar />
      </NowPlaying>
      <div className="playlist">
        <h3>Your {emotion} Playlist</h3>
        <ul>
          {tracks.map((track, index) => (
            <li 
              key={track.id} 
              className={index === currentTrackIndex ? 'active' : ''}
              onClick={() => setCurrentTrackIndex(index)}
            >
              {track.name} - {track.artists[0].name}
            </li>
          ))}
        </ul>
      </div>
    </PlayerContainer>
  );
};

export default MusicPlayer;