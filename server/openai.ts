// Updated OpenAI service - now uses advanced free AI service
import type { BibleVerse } from "./bible-service";
import { 
  generateEmotionalGuidance as advancedEmotionalGuidance,
  generatePrayerResponse as advancedPrayerResponse,
  generateDevotional as advancedDevotional
} from './advanced-ai-service';

export async function generateEmotionalGuidance(emotion: string, intensity: number, description?: string) {
  const result = await advancedEmotionalGuidance(emotion, intensity, description);
  return {
    response: result.response,
    verse: result.verse,
    verseReference: result.reference,
    prayer: result.prayer
  };
}

export async function generatePrayerResponse(message: string) {
  const result = await advancedPrayerResponse(message);
  return {
    response: result.response,
    verse: result.verse,
    reference: result.reference
  };
}

export async function generateLoveCard(category: string) {
  return {
    title: "Amor de Deus",
    message: "O amor de Deus é eterno e incondicional.",
    verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
    verseReference: "João 3:16",
    category,
    backgroundColor: "#ffffff",
    textColor: "#333333"
  };
}

export async function generateContributorCertificate(name: string, contributionType: string) {
  return {
    title: "Certificado de Gratidão",
    description: `Reconhecemos ${name} por sua valiosa contribuição como ${contributionType}.`,
    prayer: `Senhor, abençoe ${name} por sua generosidade. Em nome de Jesus, amém.`,
    verse: "Cada um contribua segundo propôs no seu coração.",
    verseReference: "2 Coríntios 9:7"
  };
}

export async function generateDevotionalContent(topic?: string) {
  const result = await advancedDevotional(topic);
  return {
    title: result.title,
    content: result.content,
    verse: result.verse,
    reference: result.reference,
    prayer: result.prayer
  };
}

export async function generateChallengeContent(day: number, challengeType: string) {
  return {
    title: `Dia ${day} - ${challengeType}`,
    content: "Continue firme na fé e confiando em Deus.",
    verse: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13",
    prayer: "Senhor, dá-me forças para este dia. Em nome de Jesus, amém."
  };
}

export async function generatePrayerRequestResponse(subject: string, content: string) {
  const result = await advancedPrayerResponse(`${subject} - ${content}`);
  return result.response;
}

export async function generateNightDevotional() {
  return {
    title: "Paz Noturna",
    content: "Que a paz de Deus que excede todo entendimento guarde seu coração esta noite.",
    verse: "Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes repousar seguro.",
    reference: "Salmos 4:8",
    prayer: "Senhor, concede-me uma noite de paz e descanso. Em nome de Jesus, amém."
  };
}

export async function generateBibleVerse(): Promise<BibleVerse> {
  // Use one of the predefined verses from advanced AI service
  const verses = [
    { text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.", reference: "João 3:16", book: "João", chapter: 3, verse: 16 },
    { text: "Posso todas as coisas naquele que me fortalece.", reference: "Filipenses 4:13", book: "Filipenses", chapter: 4, verse: 13 },
    { text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1", book: "Salmos", chapter: 23, verse: 1 },
    { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.", reference: "Isaías 41:10", book: "Isaías", chapter: 41, verse: 10 }
  ];
  
  return verses[Math.floor(Math.random() * verses.length)];
}