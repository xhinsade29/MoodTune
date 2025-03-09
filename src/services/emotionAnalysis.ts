import { philippineEmotionKeywords } from '../data/philippineEmotionKeywords';

interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
}

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
    console.log('Analyzing text:', text);
    
    if (!text.trim()) {
      console.warn('Empty text provided');
      return { emotion: 'neutral', confidence: 0.5 };
    }

    const lowercaseText = text.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'neutral';

    // Calculate emotion scores
    const emotionScores = Object.entries(emotionKeywords).map(([emotion, keywords]) => {
      const score = keywords.reduce((total, keyword) => {
        // Check for exact matches and word boundaries
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return total + (regex.test(lowercaseText) ? 1 : 0);
      }, 0) / keywords.length;

      console.log(`Score for ${emotion}:`, score);
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
      
      return { emotion, score };
    });

    console.log('Emotion analysis results:', {
      detected: detectedEmotion,
      confidence: maxScore,
      allScores: emotionScores
    });

    return {
      emotion: maxScore > 0 ? detectedEmotion : 'neutral',
      confidence: maxScore || 0.5
    };
  } catch (error) {
    console.error('Error in emotion analysis:', error);
    return { emotion: 'neutral', confidence: 0.5 };
  }
};