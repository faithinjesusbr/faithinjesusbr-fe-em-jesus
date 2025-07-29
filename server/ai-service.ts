// Updated AI Service - Uses advanced free AI service as primary
import { 
  generateAssistantResponse as advancedAssistantResponse,
  generateEmotionalGuidance as advancedEmotionalGuidance,
  generatePrayerResponse as advancedPrayerResponse,
  generateDevotional as advancedDevotional,
  generateCertificateContent as advancedCertificateContent,
  type AIResponse
} from './advanced-ai-service';

export { AIResponse };

// Main AI functions now use the advanced free service
export async function generateAIResponse(userMessage: string): Promise<AIResponse> {
  return advancedAssistantResponse(userMessage);
}

export async function generateCertificateContent(contributorName: string, contributionType: string): Promise<{
  description: string;
  aiGeneratedPrayer: string;
  aiGeneratedVerse: string;
  verseReference: string;
}> {
  return advancedCertificateContent(contributorName, contributionType);
}

export async function generateDevotional(emotion: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  return advancedDevotional(emotion);
}

export async function generateAssistantResponse(message: string) {
  return advancedAssistantResponse(message);
}