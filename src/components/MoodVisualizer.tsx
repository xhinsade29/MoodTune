import React from 'react';

interface MoodVisualizerProps {
  emotion: string;
}

interface EmotionStyle {
  background: string;
  animation: string;
}

const MoodVisualizer: React.FC<MoodVisualizerProps> = ({ emotion }) => {
  // Map emotions to colors and animations
  const emotionStyles: Record<string, EmotionStyle> = {
    happy: { background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', animation: 'pulse' },
    sad: { background: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', animation: 'wave' },
    energetic: { background: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)', animation: 'bounce' },
    calm: { background: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)', animation: 'float' },
    angry: { background: 'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)', animation: 'shake' },
    anxious: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', animation: 'flicker' },
    excited: { background: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)', animation: 'spin' },
    melancholic: { background: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)', animation: 'sway' },
    nostalgic: { background: 'linear-gradient(to top, #c79081 0%, #dfa579 100%)', animation: 'fade' },
    relaxed: { background: 'linear-gradient(to right, #74ebd5 0%, #9face6 100%)', animation: 'breathe' },
    neutral: { background: 'linear-gradient(to bottom, #e0e0e0 0%, #f5f5f5 100%)', animation: 'none' }
  };

  const style = emotionStyles[emotion] || emotionStyles.neutral;

  return (
    <div style={{ background: style.background }}>
      Current Mood: {emotion ? emotion.charAt(0).toUpperCase() + emotion.slice(1) : 'No mood selected'}
    </div>
  );
};

export default MoodVisualizer;