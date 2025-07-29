// Simple and functional emotion devotional API
import { generateDevotional, generateEmotionalGuidance } from './advanced-ai-service';

export interface EmotionDevotional {
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
  emotion: string;
}

// Simplified emotion devotional generator
export async function generateEmotionDevotional(emotion: string): Promise<EmotionDevotional> {
  const devotional = await generateDevotional(emotion);
  
  return {
    title: devotional.title,
    content: devotional.content,
    verse: devotional.verse,
    reference: devotional.reference,
    prayer: devotional.prayer,
    emotion: emotion
  };
}

// Enhanced emotional guidance with better context
export async function generateEmotionalResponse(emotion: string, intensity: number = 5, description?: string) {
  const guidance = await generateEmotionalGuidance(emotion, intensity, description);
  
  return {
    response: guidance.response,
    verse: guidance.verse,
    reference: guidance.reference,
    prayer: guidance.prayer,
    emotion: emotion,
    intensity: intensity
  };
}