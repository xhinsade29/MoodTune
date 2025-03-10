import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTracksForEmotion, getPlaylistForEmotion, SpotifyTrack } from '../services/musicService';

interface MusicPlayerProps {
  emotion: string;
  isLoading?: boolean;
  initialTracks?: SpotifyTrack[];
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

const SavePlaylistButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const PlaylistContainer = styled.div`
  margin-top: 20px;
  overflow-y: auto; /* Add scrollbar if playlist is too long */
  max-height: 200px; /* Set a maximum height for the playlist */
`;

const PlaylistTitle = styled.h3`
  margin-bottom: 10px;
`;

const PlaylistItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid #333;
  ${props => props.isActive && `
    background-color: #4CAF50;
    color: white;
  `}
`;

const TrackNumber = styled.span`
  width: 20px;
  text-align: center;
  margin-right: 10px;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.span`
  font-weight: bold;
`;

const TrackArtist = styled.span`
  color: #b3b3b3;
  font-size: 0.9em;
`;

const TrackDuration = styled.span`
  margin-left: 10px;
  color: #b3b3b3;
`;


const MusicPlayer: React.FC<MusicPlayerProps> = ({ emotion, savedTracks, initialTracks = [] }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [savedPlaylists, setSavedPlaylists] = useState<SpotifyTrack[][]>([]); //State to store saved playlists


  useEffect(() => {
    const loadTracks = async () => {
      if (!emotion || initialTracks.length > 0) return;

      setIsLoading(true);
      setPlaybackError(null);

      try {
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
  }, [emotion, initialTracks]);

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

  const handleSavePlaylist = () => {
    //Simple save - replace with actual backend call if needed
    setSavedPlaylists([...savedPlaylists, tracks]);
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
        <SavePlaylistButton onClick={handleSavePlaylist}>Save Playlist</SavePlaylistButton>
      </NowPlaying>
      <PlaylistContainer>
        <PlaylistTitle>Current Playlist for "{emotion}" Mood</PlaylistTitle>
        <ul>
          {tracks.map((track, index) => (
            <PlaylistItem key={track.id} isActive={index === currentTrackIndex} onClick={() => setCurrentTrackIndex(index)}>
              <TrackNumber>{index + 1}</TrackNumber>
              <TrackInfo>
                <TrackTitle>{track.name}</TrackTitle>
                <TrackArtist>{track.artists[0].name}</TrackArtist>
              </TrackInfo>
              <TrackDuration>3:45</TrackDuration> {/* Placeholder duration */}
            </PlaylistItem>
          ))}
        </ul>
      </PlaylistContainer>
    </PlayerContainer>
  );
};

export default MusicPlayer;