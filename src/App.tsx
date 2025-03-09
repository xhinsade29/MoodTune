import React, { useState } from 'react';
import EmotionInput from './components/EmotionInput';
import MusicPlayer from './components/MusicPlayer';
import MoodVisualizer from './components/MoodVisualizer';
import './App.css';

const App: React.FC = () => {
  const [detectedEmotion, setDetectedEmotion] = useState('');

  const handleEmotionDetected = (emotion: string) => {
    setDetectedEmotion(emotion);
  };

  return (
    <div className="app">
      <header>
        <h1>MoodTune</h1>
        <p>Music that matches your mood</p>
      </header>
      
      <main className="content">
        <EmotionInput onEmotionDetected={handleEmotionDetected} />
        <MoodVisualizer emotion={detectedEmotion} />
        <MusicPlayer emotion={detectedEmotion} />
      </main>
      
      <footer>
        <p>MoodTune &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
