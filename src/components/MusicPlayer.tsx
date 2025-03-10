
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTracksForEmotion, SpotifyTrack } from '../services/musicService';
import { usePlaylist } from '../context/PlaylistContext';

interface MusicPlayerProps {
  emotion: string;
  isLoading?: boolean;
  savedTracks?: SpotifyTrack[];
}

const PlayerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #121212;
`;

const NowPlaying = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const AlbumArt = styled.div`
  width: 300px;
  height: 300px;
  background-color: #282828;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SongInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 400px;
`;

const SongTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin: 20px 0;
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
  
  &:hover {
    transform: scale(1.05);
    background-color: #1fdf64;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SavePlaylistButton = styled.button`
  background: #1ed760;
  border: none;
  border-radius: 20px;
  color: black;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #1fdf64;
    transform: scale(1.05);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #4f4f4f;
  border-radius: 2px;
  margin: 20px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 30%;
    background-color: #1ed760;
    border-radius: 2px;
  }
`;

const MusicPlayer: React.FC<MusicPlayerProps> = ({ emotion }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { savePlaylist } = usePlaylist();

  useEffect(() => {
    const generatePlaylist = async () => {
      if (!emotion) return;
      
      setIsLoading(true);
      try {
        const newTracks = await getTracksForEmotion(emotion);
        setTracks(newTracks);
        setCurrentTrackIndex(0);
      } catch (error) {
        console.error("Error generating playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generatePlaylist();
  }, [emotion]);

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSavePlaylist = () => {
    if (tracks.length > 0) {
      console.log("Saving playlist:", tracks);
      savePlaylist(tracks, emotion);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  if (isLoading) {
    return <PlayerContainer>Loading...</PlayerContainer>;
  }

  if (!currentTrack) {
    return <PlayerContainer>No tracks available</PlayerContainer>;
  }

  return (
    <PlayerContainer>
      <NowPlaying>
        <AlbumArt>
          <img 
            src={currentTrack.album.images[0]?.url || '/default-album-art.png'} 
            alt={`${currentTrack.name} album art`}
          />
        </AlbumArt>
        <SongInfo>
          <SongTitle>{currentTrack.name}</SongTitle>
          <ArtistName>{currentTrack.artists[0].name}</ArtistName>
        </SongInfo>
        <Controls>
          <ControlButton onClick={handlePrevious}>⏮️</ControlButton>
          <PlayButton onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </PlayButton>
          <ControlButton onClick={handleNext}>⏭️</ControlButton>
        </Controls>
        <ProgressBar />
        <SavePlaylistButton onClick={handleSavePlaylist}>Save Playlist</SavePlaylistButton>
      </NowPlaying>
      <div className="playlist" style={{ 
        marginTop: '20px',
        background: '#282828',
        borderRadius: '12px',
        padding: '24px',
        width: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          paddingBottom: '12px'
        }}>Your {emotion} Playlist</h3>
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {tracks.map((track, index) => (
            <li
              key={track.id}
              style={{
                padding: '16px 20px',
                background: index === currentTrackIndex ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderLeft: index === currentTrackIndex ? '4px solid #1DB954' : 'none'
              }}
              onClick={() => setCurrentTrackIndex(index)}
            >
              <div style={{ width: '24px', textAlign: 'right', color: '#b3b3b3' }}>
                {index + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.name}
                </div>
                <div style={{ color: '#b3b3b3', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.artists[0].name}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PlayerContainer>
  );
};

export default MusicPlayer;
