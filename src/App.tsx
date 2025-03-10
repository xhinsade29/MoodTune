
import React, { useState, useEffect } from 'react';
import EmotionInput from './components/EmotionInput';
import MusicPlayer from './components/MusicPlayer';
import MoodVisualizer from './components/MoodVisualizer';
import Navigation from './components/Navigation';
import './App.css';

const App: React.FC = () => {
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleEmotionDetected = (emotion: string) => {
    setIsLoading(true);
    // Simulate a loading effect
    setTimeout(() => {
      setDetectedEmotion(emotion);
      setIsLoading(false);
    }, 800);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <EmotionInput onEmotionDetected={handleEmotionDetected} />
            
            {detectedEmotion && (
              <>
                <MoodVisualizer emotion={detectedEmotion} isLoading={isLoading} />
                <MusicPlayer emotion={detectedEmotion} isLoading={isLoading} />
              </>
            )}
            
            {!detectedEmotion && (
              <div className="welcome-message">
                <h2>How are you feeling today?</h2>
                <p>Share your thoughts above and we'll find the perfect soundtrack for your mood.</p>
              </div>
            )}
          </>
        );
      case 'your-playlist':
        return (
          <div className="page-container">
            <h1>Your Playlist</h1>
            <p>Here you can view and manage your saved playlists.</p>
            {/* Playlist component will go here */}
          </div>
        );
      case 'recommended':
        return (
          <div className="page-container">
            <h1>Recommended Playlists</h1>
            <p>Discover new music based on your mood and listening history.</p>
            {/* Recommended playlists component will go here */}
          </div>
        );
      case 'about':
        return (
          <div className="page-container">
            <h1>About MoodTune</h1>
            <p>MoodTune is your personal mood-based music companion. We analyze your emotions and provide the perfect soundtrack for every moment.</p>
            <p>Using advanced emotion detection technology, MoodTune can understand how you feel and recommend music that resonates with your current state.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <header>
        <h1>MoodTune</h1>
        <p>Music that perfectly matches your mood</p>
      </header>
      
      <main className="content">
        {renderContent()}
      </main>
      
      <footer>
        <p>MoodTune &copy; {new Date().getFullYear()} | Your personal mood-based music companion</p>
      </footer>
    </div>
  );
};

export default App;
