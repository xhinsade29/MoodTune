import { OPENAI_API_KEY } from '../config';
import { philippineEmotionKeywords } from '../data/philippineEmotionKeywords';

interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
}

const defaultEmotions = [
  'happy',
  'sad',
  'energetic',
  'calm',
  'angry',
  'anxious',
  'excited',
  'melancholic',
  'nostalgic',
  'relaxed'
];

const emotionKeywords = {
  happy: ['happy', 'joy', 'delighted', 'cheerful', 'wonderful', 'blessed', 'great', 'fantastic', 'thrilled', ...philippineEmotionKeywords.happy],
  sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'heartbroken', 'gloomy', 'blue', ...philippineEmotionKeywords.sad],
  energetic: ['energetic', 'pumped', 'motivated', 'active', 'alive', 'vibrant', 'dynamic', 'energized'],
  calm: ['calm', 'peaceful', 'serene', 'tranquil', 'quiet', 'zen', 'composed', 'collected'],
  angry: ['angry', 'furious', 'mad', 'rage', 'upset', 'frustrated', 'irritated', 'annoyed', ...philippineEmotionKeywords.angry],
  anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'restless', ...philippineEmotionKeywords.anxious],
  excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'looking forward', 'stoked', 'hyped', ...philippineEmotionKeywords.excited],
  melancholic: ['melancholic', 'nostalgic', 'wistful', 'longing', 'yearning', 'reminiscent'],
  nostalgic: ['nostalgic', 'reminiscing', 'memories', 'remember when', 'missing', 'good old', ...philippineEmotionKeywords.nostalgic],
  relaxed: ['relaxed', 'chill', 'mellow', 'laid back', 'comfortable', 'at ease', 'content', ...philippineEmotionKeywords.relaxed]
};

export const analyzeEmotion = async (text: string): Promise<EmotionAnalysisResult> => {
  try {
    if (!text.trim()) {
      throw new Error('No text provided for emotion analysis');
    }

    const lowercaseText = text.toLowerCase();
    const emotionScores = Object.entries(emotionKeywords).map(([emotion, keywords]) => ({
      emotion,
      score: keywords.reduce((score, keyword) => 
        score + (lowercaseText.includes(keyword) ? 1 : 0), 0) / keywords.length
    }));

    const strongestEmotion = emotionScores.reduce((max, current) => 
      current.score > max.score ? current : max,
      { emotion: 'neutral', score: 0 }
    );

    return {
      emotion: strongestEmotion.score > 0 ? strongestEmotion.emotion : 'neutral',
      confidence: strongestEmotion.score || 0.5
    };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    // Return a default emotion instead of throwing
    return {
      emotion: 'neutral',
      confidence: 0.5
    };
  }
};