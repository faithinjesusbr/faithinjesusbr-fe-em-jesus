import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export async function generateEmotionalGuidance(emotion: string, intensity: string, description?: string): Promise<{
  response: string;
  verse: string;
  verseReference: string;
  prayer: string;
}> {
  const prompt = `Como um conselheiro espiritual cristão, responda em português brasileiro para alguém que está se sentindo ${emotion} com intensidade ${intensity}. ${description ? `Descrição adicional: ${description}` : ''}

Forneça:
1. Uma resposta reconfortante e cheia de fé
2. Um versículo bíblico apropriado  
3. A referência do versículo
4. Uma oração personalizada

Responda em formato JSON com as chaves: response, verse, verseReference, prayer`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generatePrayerResponse(userMessage: string): Promise<{
  response: string;
  verse?: string;
  reference?: string;
}> {
  const prompt = `Como o IA Cristo, um assistente espiritual cristão, responda em português brasileiro à seguinte mensagem de oração: "${userMessage}"

Forneça uma resposta reconfortante e bíblica, incluindo um versículo relevante quando apropriado.

Responda em formato JSON com as chaves: response, verse (opcional), reference (opcional)`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateLoveCard(category: string): Promise<{
  title: string;
  message: string;
  verse?: string;
  reference?: string;
  backgroundColor: string;
  textColor: string;
}> {
  const prompt = `Crie um cartão de amor cristão para a categoria "${category}". 

Forneça:
1. Um título inspirador (máximo 20 caracteres)
2. Uma mensagem de amor e fé (máximo 150 caracteres)
3. Um versículo bíblico relevante (opcional)
4. A referência do versículo (opcional)
5. Uma cor de fundo (código hex)
6. Uma cor de texto (código hex)

Responda em formato JSON com as chaves: title, message, verse, reference, backgroundColor, textColor`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateContributorCertificate(contributorName: string, contributionType: string): Promise<{
  title: string;
  description: string;
  prayer: string;
  verse: string;
  verseReference: string;
}> {
  const prompt = `Crie um certificado de reconhecimento para ${contributorName} que contribuiu com "${contributionType}" para o ministério Fé em Jesus BR.

Forneça:
1. Um título para o certificado
2. Uma descrição de reconhecimento
3. Uma oração especial personalizada
4. Um versículo bíblico sobre colaboração/generosidade
5. A referência do versículo

Responda em formato JSON com as chaves: title, description, prayer, verse, verseReference`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateDevotionalContent(topic?: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
}> {
  const prompt = `Crie um devocional cristão em português brasileiro${topic ? ` sobre o tema: ${topic}` : ''}.

O devocional deve ter:
1. Um título inspirador
2. Conteúdo reflexivo de 200-300 palavras
3. Um versículo bíblico central
4. A referência do versículo

Responda em formato JSON com as chaves: title, content, verse, reference`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateChallengeContent(duration: number, theme: string): Promise<{
  title: string;
  description: string;
  days: Array<{
    day: number;
    title: string;
    content: string;
    verse: string;
    reference: string;
    reflection: string;
  }>;
}> {
  const prompt = `Crie um desafio espiritual de ${duration} dias sobre "${theme}" para cristãos brasileiros.

Forneça:
1. Título do desafio
2. Descrição geral
3. Conteúdo para cada dia (${duration} dias) com:
   - Título do dia
   - Conteúdo reflexivo (100-150 palavras)
   - Versículo bíblico
   - Referência do versículo
   - Pergunta de reflexão

Responda em formato JSON com as chaves: title, description, days (array)`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}