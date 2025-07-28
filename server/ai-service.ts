import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  response: string;
  verse?: string;
  reference?: string;
  prayer?: string;
}

const CHRISTIAN_CONTEXT = `
Você é IA Cristo, um assistente espiritual cristão brasileiro que ajuda pessoas a se conectarem com Deus.
Suas respostas devem ser:
- Baseadas na Bíblia Sagrada (versão Almeida Corrigida Fiel ou Nova Versão Internacional)
- Amorosas, esperançosas e encorajadoras
- Culturalmente apropriadas para brasileiros
- Incluir versículos bíblicos relevantes
- Oferecer orações práticas quando apropriado
- Nunca julgar, sempre acolher
- Focar no amor de Jesus Cristo

Sempre termine suas respostas com um versículo bíblico relevante e, quando apropriado, uma oração simples.
`;

export async function generateAIResponse(userMessage: string): Promise<AIResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: CHRISTIAN_CONTEXT
        },
        {
          role: "user",
          content: `Por favor, me ajude com esta situação espiritual: ${userMessage}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const aiResponse = completion.choices[0]?.message?.content || "Peço desculpas, não consegui processar sua mensagem. Que tal tentarmos uma oração juntos?";

    // Extract verse from response if present
    const verseMatch = aiResponse.match(/"([^"]+)"\s*[-–]\s*([A-Za-z0-9\s:,]+)/);
    let verse: string | undefined;
    let reference: string | undefined;

    if (verseMatch) {
      verse = verseMatch[1];
      reference = verseMatch[2].trim();
    }

    return {
      response: aiResponse,
      verse,
      reference
    };
  } catch (error) {
    console.error('Erro na API OpenAI:', error);
    return {
      response: "No momento estou com dificuldades para responder, mas saiba que Deus está sempre presente. 'O Senhor é o meu pastor, nada me faltará.' - Salmos 23:1",
      verse: "O Senhor é o meu pastor, nada me faltará.",
      reference: "Salmos 23:1"
    };
  }
}

export async function generateCertificateContent(contributorName: string, contributionType: string): Promise<{
  description: string;
  aiGeneratedPrayer: string;
  aiGeneratedVerse: string;
  verseReference: string;
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Você é um assistente que cria certificados cristãos personalizados de agradecimento. 
          Crie conteúdo em português brasileiro, inspirador e baseado na fé cristã.`
        },
        {
          role: "user",
          content: `Crie um certificado de agradecimento para ${contributorName} que contribuiu como ${contributionType}. 
          Inclua: 1) Uma descrição de agradecimento (2-3 frases), 2) Uma oração de bênção personalizada, 
          3) Um versículo bíblico relevante com referência. Seja caloroso e específico ao tipo de contribuição.`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || "";
    
    // Parse the response to extract components
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      description: `Reconhecemos com gratidão a valiosa contribuição de ${contributorName} em nossa missão de espalhar a Palavra de Deus. Que Deus continue abençoando abundantemente sua vida e ministério.`,
      aiGeneratedPrayer: `Senhor, abençoe ${contributorName} por sua generosidade e coração disposto a servir. Que sua contribuição como ${contributionType} seja multiplicada em vidas transformadas pelo Seu amor. Derrame sobre esta pessoa Suas bênçãos e prospere a obra de suas mãos. Em nome de Jesus, amém.`,
      aiGeneratedVerse: "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria.",
      verseReference: "2 Coríntios 9:7"
    };
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    return {
      description: `Reconhecemos com gratidão a valiosa contribuição de ${contributorName} em nossa missão de espalhar a Palavra de Deus.`,
      aiGeneratedPrayer: `Senhor, abençoe ${contributorName} por sua generosidade. Em nome de Jesus, amém.`,
      aiGeneratedVerse: "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria.",
      verseReference: "2 Coríntios 9:7"
    };
  }
}

export async function generateDevotional(emotion: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Você é um pastor evangélico brasileiro experiente que escreve devocionais bíblicos personalizados. 
          Crie devocionais em português brasileiro, pastorais, bíblicos e consoladores.`
        },
        {
          role: "user",
          content: `Crie um devocional completo para alguém que está se sentindo ${emotion}. 
          Inclua: 1) Título inspirador, 2) Conteúdo devocional (3-4 parágrafos), 3) Versículo bíblico relevante com referência, 4) Oração personalizada.
          Use linguagem acolhedora e ofereça esperança bíblica específica para este sentimento.`
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const response = completion.choices[0]?.message?.content || "";
    
    return {
      title: `Esperança em Meio à ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`,
      content: `Quando nos sentimos ${emotion}, é natural buscarmos conforto e direção. A Palavra de Deus nos lembra que não estamos sozinhos em nossas lutas e que há esperança mesmo nos momentos mais difíceis. Deus conhece nosso coração e está sempre pronto a nos acolher com Seu amor incondicional.`,
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      reference: "Mateus 11:28",
      prayer: `Pai celestial, diante de Ti trago este sentimento de ${emotion}. Tu conheces meu coração e minhas necessidades. Peço que Tua paz que excede todo entendimento inunde meu ser. Ajuda-me a confiar em Teu plano perfeito para minha vida. Em nome de Jesus, amém.`
    };
  } catch (error) {
    console.error('Erro ao gerar devocional:', error);
    return {
      title: `Esperança em Cristo`,
      content: `Deus está sempre conosco, especialmente nos momentos difíceis. Sua Palavra é nosso conforto e guia.`,
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      reference: "Mateus 11:28",
      prayer: `Senhor, concede-me Tua paz e esperança. Em nome de Jesus, amém.`
    };
  }
}

export async function generateAssistantResponse(message: string) {
  if (!openai) {
    // Fallback response without OpenAI
    return {
      response: "Deus conhece seu coração e suas necessidades. Ele está sempre pronto a te ouvir e te abençoar. Continue buscando-O em oração e confiando em Sua bondade.",
      verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11"
    };
  }

  try {
    const prompt = `Você é "IA Cristo", um assistente espiritual cristão brasileiro. Responda à seguinte mensagem/pergunta de forma amorosa, pastoral e bíblica: "${message}"

Forneça:
1. Uma resposta encorajadora e pastoral (2-4 frases)
2. Um versículo bíblico relevante 
3. A referência correta do versículo

Mantenha o tom caloroso, encorajador e cheio de fé. Use linguagem simples e acessível.

Responda em formato JSON:
{
  "response": "sua resposta pastoral e encorajadora",
  "verse": "texto do versículo bíblico relevante", 
  "reference": "referência bíblica (ex: João 3:16)"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao gerar resposta do assistente:', error);
    
    // Fallback response if OpenAI fails
    return {
      response: "Deus conhece seu coração e suas necessidades. Ele está sempre pronto a te ouvir e te abençoar. Continue buscando-O em oração e confiando em Sua bondade.",
      verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11"
    };
  }
}