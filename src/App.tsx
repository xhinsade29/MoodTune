
import React, { useState, useEffect } from 'react';
import EmotionInput from './components/EmotionInput';
import MusicPlayer from './components/MusicPlayer';
import MoodVisualizer from './components/MoodVisualizer';
import './App.css';

const App: React.FC = () => {
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmotionDetected = (emotion: string) => {
    setIsLoading(true);
    // Simulate a loading effect
    setTimeout(() => {
      setDetectedEmotion(emotion);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="app">
      <header>
        <h1>MoodTune</h1>
        <p>Music that perfectly matches your mood</p>
      </header>
      
      <main className="content">
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
      </main>
      
      <footer>
        <p>MoodTune &copy; {new Date().getFullYear()} | Your personal mood-based music companion</p>
      </footer>
    </div>
  );
};

export default App;
