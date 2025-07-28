import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export async function generateEmotionalGuidance(emotion: string, intensity: number, description?: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are IA Cristo, a Christian spiritual assistant. Provide loving, biblical guidance for emotional states in Portuguese."
        },
        {
          role: "user",
          content: `Please help someone feeling ${emotion} with intensity ${intensity}. ${description ? `Additional context: ${description}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const response = completion.choices[0]?.message?.content || "Deus está contigo em todos os momentos.";
    return {
      response,
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      verseReference: "Mateus 11:28",
      prayer: "Pai celestial, concede paz e conforto neste momento. Em nome de Jesus, amém."
    };
  } catch (error) {
    return {
      response: "Deus está contigo em todos os momentos.",
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", 
      verseReference: "Mateus 11:28",
      prayer: "Pai celestial, concede paz e conforto neste momento. Em nome de Jesus, amém."
    };
  }
}

export async function generatePrayerResponse(message: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are IA Cristo, a Christian spiritual assistant. Respond with prayer, biblical verse and reference in Portuguese."
        },
        {
          role: "user", 
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || "Deus ouve suas orações.";
    return {
      response,
      verse: "E tudo o que pedirdes em oração, crendo, recebereis.",
      reference: "Mateus 21:22"
    };
  } catch (error) {
    return {
      response: "Deus ouve suas orações.",
      verse: "E tudo o que pedirdes em oração, crendo, recebereis.",
      reference: "Mateus 21:22"
    };
  }
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
  return {
    title: "Devocional Diário",
    content: "Deus tem um plano maravilhoso para sua vida.",
    verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito.",
    reference: "Jeremias 29:11",
    prayer: "Pai, guia-nos hoje segundo Tua vontade. Em nome de Jesus, amém."
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