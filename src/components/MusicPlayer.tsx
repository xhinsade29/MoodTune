import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTracksForEmotion, getPlaylistForEmotion, SpotifyTrack } from '../services/musicService';

interface MusicPlayerProps {
  emotion: string;
}

const PlayerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const NowPlaying = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AlbumArt = styled.div`
  width: 300px;
  height: 300px;
  background-color: #282828;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  border-radius: 8px;
`;

const SongInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SongTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  color: #ffffff;
`;

const ArtistName = styled.p`
  margin: 8px 0;
  font-size: 16px;
  color: #b3b3b3;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1ed760;
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 20px;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #282828;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    width: 30%;
    height: 100%;
    background-color: #1ed760;
    border-radius: 2px;
  }
`;

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