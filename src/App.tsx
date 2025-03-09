import React, { useState, useEffect } from 'react';
import { 
  getTracksForEmotion, 
  getPlaylistForEmotion, 
  getRecommendedTracks,
  type SpotifyTrack 
} from './services/musicService';
import EmotionInput from './components/EmotionInput';
import MoodVisualizer from './components/MoodVisualizer';
import './App.css';
import PlaylistView from './components/PlaylistView';
import PlayerControls from './components/PlayerControls';
import PlaylistDisplay from './components/PlaylistDisplay';

const App: React.FC = () => {
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendedTracks, setRecommendedTracks] = useState<SpotifyTrack[]>([]);

  const handleEmotionDetected = async (emotion: string) => {
    setDetectedEmotion(emotion);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Processing emotion:', emotion);
      let playlist = await getTracksForEmotion(emotion);
      
      if (!playlist || playlist.length === 0) {
        // Try getting playlist as fallback
        playlist = await getPlaylistForEmotion(emotion);
      }
      
      if (playlist && playlist.length > 0) {
        setTracks(playlist);
        setCurrentTrackIndex(0);
      } else {
        setError('No playable tracks found. Try describing your feeling differently.');
      }
    } catch (error) {
      console.error('Failed to get tracks:', error);
      setError(error instanceof Error ? 
        error.message.replace(/\. Please try a different mood\.$/, '. Try describing your feeling differently.') : 
        'Unable to load music recommendations.');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async (seedTracks: string[]) => {
    if (!detectedEmotion || isLoadingRecommendations) return;

    setIsLoadingRecommendations(true);
    setError(null);

    try {
      const recommendations = await getRecommendedTracks(seedTracks, detectedEmotion);
      setRecommendedTracks(recommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setError('Could not load recommended tracks. Please try again.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAddToPlaylist = (track: SpotifyTrack) => {
    setTracks(prevTracks => {
      if (prevTracks.some(t => t.id === track.id)) {
        return prevTracks;
      }
      return [...prevTracks, track];
    });
  };

  // Add auto-play effect when currentTrackIndex changes
  useEffect(() => {
    if (currentTrackIndex >= 0 && tracks[currentTrackIndex]?.preview_url) {
      console.log('Auto-playing track:', tracks[currentTrackIndex].name);
    }
  }, [currentTrackIndex, tracks]);

  // Add debug logging for tracks state changes
  useEffect(() => {
    console.log('Tracks updated:', tracks.length, 'tracks available');
    console.log('Current track index:', currentTrackIndex);
  }, [tracks, currentTrackIndex]);

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
  };

  const renderContent = () => {
    if (isLoading || isLoadingRecommendations) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>
            {isLoadingRecommendations 
              ? 'Finding similar tracks...' 
              : `Finding the perfect tunes for your ${detectedEmotion} mood...`}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    if (tracks.length === 0) {
      return (
        <div className="empty-state">
          <p>Share your mood and we'll find music that matches your feelings</p>
        </div>
      );
    }

    return (
      <>
        <PlaylistDisplay
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
          onGetRecommendations={handleGetRecommendations}
          recommendedTracks={recommendedTracks}
          isLoading={isLoading || isLoadingRecommendations}
        />
        {currentTrackIndex >= 0 && tracks[currentTrackIndex] && (
          <div className="player-controls-wrapper">
            <PlayerControls
              track={tracks[currentTrackIndex]}
              onNext={() => handleTrackSelect((currentTrackIndex + 1) % tracks.length)}
              onPrev={() => handleTrackSelect((currentTrackIndex - 1 + tracks.length) % tracks.length)}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>MoodTune</h1>
        <p>Music that matches your mood</p>
      </header>
      
      <main className="content">
        <div className="main-layout">
          <div className="left-panel">
            <EmotionInput onEmotionDetected={handleEmotionDetected} />
            {detectedEmotion && <MoodVisualizer emotion={detectedEmotion} />}
          </div>
          
          <div className="right-panel">
            {renderContent()}
          </div>
        </div>
      </main>
      
      <footer>
        <p>MoodTune &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
