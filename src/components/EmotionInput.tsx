import React, { useState } from 'react';
import { analyzeEmotion } from '../services/emotionAnalysis';

interface EmotionInputProps {
  onEmotionDetected: (emotion: string) => void;
}

const EmotionInput: React.FC<EmotionInputProps> = ({ onEmotionDetected }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!text.trim()) {
      setError('Please enter some text about how you feel');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Analyzing emotion for text:', text);
      const result = await analyzeEmotion(text);
      console.log('Emotion analysis result:', result);
      
      if (result.emotion === 'neutral' && result.confidence < 0.3) {
        setError('Could not detect a clear emotion. Please try being more specific.');
        return;
      }
      
      onEmotionDetected(result.emotion);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(`Failed to analyze emotion: ${errorMessage}`);
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
          placeholder="How are you feeling today? Be specific about your emotions..."
          rows={4}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={isAnalyzing || !text.trim()}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </form>
    </div>
  );
};

export default EmotionInput;