import React, { useState } from 'react';
import { analyzeEmotion } from '../services/emotionAnalysis';

interface EmotionInputProps {
  onEmotionDetected: (emotion: string) => void;
}

const EmotionInput: React.FC<EmotionInputProps> = ({ onEmotionDetected }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotion(text);
      onEmotionDetected(result.emotion);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="emotion-input">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today?"
          rows={4}
        />
        <button type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </form>
    </div>
  );
};

export default EmotionInput;