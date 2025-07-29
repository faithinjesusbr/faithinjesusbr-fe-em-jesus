// Advanced Free AI Service - Multiple free AI APIs with intelligent fallbacks
import fetch from 'node-fetch';

export interface AIResponse {
  response: string;
  verse?: string;
  reference?: string;
  prayer?: string;
}

// Extensive Christian responses database
const CHRISTIAN_RESPONSES = {
  greeting: [
    "Que a paz de Cristo esteja contigo! Como posso te ajudar hoje na sua jornada espiritual?",
    "Seja bem-vindo(a)! Estou aqui para conversar sobre fé, oração e a Palavra de Deus.",
    "Olá! Que Deus te abençoe! Em que posso ajudar você hoje?",
    "A graça e a paz do Senhor Jesus sejam contigo! Como posso te auxiliar espiritualmente?"
  ],
  
  prayer: [
    "A oração é nossa comunicação direta com Deus. Ele sempre nos ouve com amor e misericórdia. Quando oramos, nos conectamos com o coração do Pai que nos ama incondicionalmente.",
    "Que bênção saber que você busca a Deus em oração! Ele conhece nossas necessidades antes mesmo de pedirmos. Continue confiando que Ele responderá no tempo perfeito.",
    "A oração move o coração de Deus. Ele se alegra quando seus filhos se aproximam dEle com fé. Continue perseverando na oração, pois Deus tem planos maravilhosos para você.",
    "Quando oramos, entramos na presença do Todo-Poderoso. Que privilégio poder falar com o Criador do universo! Ele sempre nos ouve e responde com amor paternal."
  ],
  
  comfort: [
    "Nos momentos difíceis, lembre-se que Deus nunca nos abandona. Ele está sempre conosco, mesmo quando não conseguimos sentir Sua presença. Você não está sozinho(a) nesta caminhada.",
    "A dor que você sente agora não é o fim da história. Deus tem um propósito em tudo e Ele trabalhará todas as coisas para o seu bem. Confie no plano perfeito dEle para sua vida.",
    "Mesmo nas dificuldades, Deus está trabalhando. Às vezes Ele nos permite passar por vales para nos fortalecer e nos aproximar dEle. Sua presença é sua força.",
    "O sofrimento é temporário, mas a glória que Deus tem preparado para você é eterna. Não desista! Ele está moldando seu caráter e preparando você para grandes bênçãos."
  ],
  
  encouragement: [
    "Continue firme na fé! Deus tem grandes planos para você e sua família. Ele nunca desiste dos seus filhos e sempre provê o melhor no tempo certo.",
    "Você é precioso(a) aos olhos de Deus! Ele te ama de forma incondicional e tem um propósito especial para sua vida. Nunca se esqueça do quanto você é valioso(a).",
    "Com Deus, todas as coisas são possíveis! Mantenha sua esperança viva e confie que Ele abrirá portas que ninguém pode fechar. Sua vitória está chegando!",
    "Deus está preparando você para algo grandioso. Cada desafio é uma oportunidade de crescimento espiritual. Continue confiando e verá as maravilhas que Ele fará."
  ],
  
  guidance: [
    "Busque a Deus em oração e na leitura da Bíblia. Ele sempre nos guia pelo caminho certo. Sua Palavra é lâmpada para os nossos pés e luz para o nosso caminho.",
    "A sabedoria vem de Deus. Peça a Ele discernimento para suas decisões e Ele orientará seus passos. Confie no Senhor de todo o seu coração.",
    "Deus conhece o futuro e nos prepara para cada situação. Quando não souber que direção tomar, busque Sua face em oração. Ele revelará Sua vontade no tempo certo.",
    "O Espírito Santo é nosso Consolador e Guia. Ele nos ensina todas as coisas e nos faz lembrar das palavras de Jesus. Confie na direção divina para sua vida."
  ],

  love: [
    "O amor de Deus por você é maior que o universo! Não há nada que possa separar você do amor de Cristo. Você é amado(a) eternamente.",
    "Deus te ama como você é, mas te ama tanto que não te deixa como está. Seu amor transforma vidas e renova corações. Permita que Ele trabalhe em você.",
    "O amor incondicional de Deus é a base da nossa fé. Ele nos amou primeiro, mesmo quando éramos pecadores. Que amor maravilhoso é este!",
    "Você foi criado(a) no amor e para o amor. Deus plantou Seu amor em seu coração para que você possa amar outros. Seja um canal do amor divino."
  ]
};

// Extensive Bible verses database
const BIBLE_VERSES = [
  { text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.", reference: "João 3:16" },
  { text: "Posso todas as coisas naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", reference: "Mateus 11:28" },
  { text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1" },
  { text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.", reference: "Romanos 8:28" },
  { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.", reference: "Isaías 41:10" },
  { text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", reference: "1 Pedro 5:7" },
  { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.", reference: "Jeremias 29:11" },
  { text: "Se Deus é por nós, quem será contra nós?", reference: "Romanos 8:31" },
  { text: "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.", reference: "Filipenses 4:19" },
  { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", reference: "Provérbios 3:5" },
  { text: "Até aqui nos ajudou o Senhor.", reference: "1 Samuel 7:12" },
  { text: "A alegria do Senhor é a vossa força.", reference: "Neemias 8:10" },
  { text: "Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias.", reference: "Isaías 40:31" },
  { text: "O amor nunca falha.", reference: "1 Coríntios 13:8" },
  { text: "Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes repousar seguro.", reference: "Salmos 4:8" },
  { text: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.", reference: "Salmos 103:2" },
  { text: "Grande é a tua fidelidade.", reference: "Lamentações 3:23" },
  { text: "Jesus Cristo é o mesmo ontem, e hoje, e eternamente.", reference: "Hebreus 13:8" },
  { text: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.", reference: "Mateus 18:20" }
];

// Contextual prayers
const PRAYERS = [
  "Pai celestial, derrama Tua paz sobre esta situação. Que Tua vontade seja feita e Tua glória seja manifestada. Em nome de Jesus, amém.",
  "Senhor, concede sabedoria e direção para esta pessoa. Ilumina o caminho e fortalece a fé. Em Cristo oramos, amém.",
  "Deus de amor, fortalece nossa fé e esperança. Que Tua presença seja real e consoladora neste momento. Amém.",
  "Pai, obrigado por Tua presença constante em nossas vidas. Abençoe e proteja esta pessoa querida. Em Jesus, amém.",
  "Senhor Jesus, concede paz ao coração e esperança à alma. Que Teu amor seja sentido de forma especial hoje. Amém.",
  "Pai celestial, derrama Tuas bênçãos abundantes. Que esta pessoa sinta Teu cuidado paternal. Em nome de Jesus, amém."
];

// Free AI APIs to try
async function tryHuggingFaceAPI(message: string): Promise<string | null> {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: `Contexto: Você é um assistente espiritual cristão brasileiro. Responda com amor e sabedoria bíblica: ${message}`,
        parameters: { max_length: 200, temperature: 0.7, return_full_text: false }
      })
    });

    if (response.ok) {
      const result: any = await response.json();
      const text = result?.[0]?.generated_text;
      if (text && text.length > 20) return text;
    }
  } catch (error) {
    console.log('HuggingFace API temporariamente indisponível');
  }
  return null;
}

async function tryOllamaAPI(message: string): Promise<string | null> {
  try {
    // Ollama local API (if available)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Você é IA Cristo, um assistente espiritual cristão. Responda com amor: ${message}`,
        stream: false
      })
    });

    if (response.ok) {
      const result: any = await response.json();
      if (result.response && result.response.length > 20) return result.response;
    }
  } catch (error) {
    // Ollama não disponível, continuar com fallback
  }
  return null;
}

// Intelligent message analysis
function analyzeMessage(message: string): {
  type: keyof typeof CHRISTIAN_RESPONSES;
  emotion: string;
  intensity: number;
  keywords: string[];
} {
  const lowerMessage = message.toLowerCase();
  const keywords: string[] = [];
  
  // Detect keywords
  const keywordMap = {
    prayer: ['oração', 'orar', 'rezar', 'súplica', 'interceder'],
    comfort: ['triste', 'dor', 'sofrimento', 'difícil', 'problema', 'angústia', 'preocupação'],
    guidance: ['decisão', 'escolha', 'caminho', 'direção', 'dúvida', 'conselho'],
    love: ['amor', 'relacionamento', 'casamento', 'família', 'perdão'],
    encouragement: ['desânimo', 'cansado', 'força', 'motivação', 'esperança']
  };

  let type: keyof typeof CHRISTIAN_RESPONSES = 'encouragement';
  let emotion = 'neutro';
  let intensity = 5;

  // Analyze message type
  for (const [category, words] of Object.entries(keywordMap)) {
    for (const word of words) {
      if (lowerMessage.includes(word)) {
        keywords.push(word);
        type = category as keyof typeof CHRISTIAN_RESPONSES;
      }
    }
  }

  // Detect emotions
  if (lowerMessage.includes('triste') || lowerMessage.includes('chorando')) {
    emotion = 'tristeza';
    intensity = 8;
  } else if (lowerMessage.includes('ansioso') || lowerMessage.includes('preocupado')) {
    emotion = 'ansiedade';
    intensity = 7;
  } else if (lowerMessage.includes('feliz') || lowerMessage.includes('alegre')) {
    emotion = 'alegria';
    intensity = 8;
  } else if (lowerMessage.includes('medo') || lowerMessage.includes('assustado')) {
    emotion = 'medo';
    intensity = 7;
  }

  // Greeting detection
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia')) {
    type = 'greeting';
  }

  return { type, emotion, intensity, keywords };
}

// Smart response generator
function generateSmartResponse(message: string, analysis: ReturnType<typeof analyzeMessage>): string {
  const responses = CHRISTIAN_RESPONSES[analysis.type];
  let response = responses[Math.floor(Math.random() * responses.length)];

  // Add contextual elements
  if (analysis.keywords.length > 0) {
    const keyword = analysis.keywords[0];
    
    if (keyword === 'oração') {
      response += " A oração é poderosa e eficaz. Deus ouve cada palavra que sai do seu coração.";
    } else if (keyword === 'família') {
      response += " Deus tem um cuidado especial com as famílias. Ele deseja abençoar e restaurar relacionamentos.";
    } else if (keyword === 'trabalho') {
      response += " Deus tem um propósito para sua vida profissional. Ele abrirá as portas certas no tempo certo.";
    }
  }

  // Add emotional context
  if (analysis.emotion !== 'neutro') {
    if (analysis.emotion === 'tristeza') {
      response += " Sei que está passando por um momento difícil, mas Deus está perto dos que têm o coração quebrantado.";
    } else if (analysis.emotion === 'ansiedade') {
      response += " A ansiedade é comum, mas Jesus nos convida a entregar nossas preocupações a Ele.";
    } else if (analysis.emotion === 'alegria') {
      response += " Que alegria ver sua gratidão! Continue celebrando as bênçãos de Deus em sua vida.";
    }
  }

  return response;
}

// Main AI response function
export async function generateAssistantResponse(message: string): Promise<AIResponse> {
  const analysis = analyzeMessage(message);
  
  // Try multiple AI APIs
  let aiResponse = await tryHuggingFaceAPI(message);
  if (!aiResponse) {
    aiResponse = await tryOllamaAPI(message);
  }
  
  // Use smart fallback if AI APIs fail
  const response = aiResponse && aiResponse.length > 30 
    ? aiResponse 
    : generateSmartResponse(message, analysis);
  
  // Select appropriate verse and prayer
  const verse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
  const prayer = PRAYERS[Math.floor(Math.random() * PRAYERS.length)];
  
  return {
    response: response.trim(),
    verse: verse.text,
    reference: verse.reference,
    prayer
  };
}

// Emotional guidance with contextual responses
export async function generateEmotionalGuidance(emotion: string, intensity: number, description?: string): Promise<AIResponse> {
  const emotionResponses: Record<string, string[]> = {
    'ansioso': [
      "A ansiedade é natural, mas Deus nos convoca a entregar nossas preocupações a Ele. Quando a ansiedade vier, lembre-se que o Senhor tem controle sobre todas as coisas.",
      "Respire fundo e confie: Deus cuida de você com amor paternal. Ele conhece suas necessidades antes mesmo de você pedir.",
      "A paz que Jesus oferece é diferente da paz do mundo. Ela permanece mesmo em meio às tempestades da vida."
    ],
    'triste': [
      "A tristeza faz parte da jornada humana, mas não é o fim da história. Deus tem consolo e esperança para você neste momento.",
      "Nas lágrimas, Deus está mais perto. Ele recolhe cada lágrima e conhece cada dor do seu coração.",
      "A tristeza é passageira, mas o amor e a fidelidade de Deus são eternos. Permita que Ele te console hoje."
    ],
    'feliz': [
      "Que alegria saber que você está bem! Deus se alegra quando seus filhos estão felizes e gratos.",
      "Aproveite este momento de alegria e lembre-se de agradecer a Deus pelas bênçãos que Ele tem derramado.",
      "A alegria do Senhor é nossa força! Continue celebrando a bondade e fidelidade de Deus em sua vida."
    ],
    'com_medo': [
      "O medo é uma emoção humana natural, mas a fé em Deus é maior que qualquer temor. Ele é nosso refúgio e fortaleza.",
      "Quando o medo vier, lembre-se das promessas de Deus. Ele nunca nos abandona e sempre nos protege.",
      "Não tema, porque Deus está com você em todos os momentos. Sua presença é sua segurança."
    ],
    'solitário': [
      "A solidão pode ser pesada, mas você nunca está verdadeiramente sozinho. Deus está sempre presente, mesmo quando não conseguimos senti-Lo.",
      "Jesus prometeu estar conosco todos os dias até o fim dos tempos. Sua presença é real e consoladora.",
      "Deus pode usar momentos de solidão para nos aproximar dEle. Busque Sua presença em oração e adoração."
    ]
  };
  
  const responses = emotionResponses[emotion.toLowerCase()] || emotionResponses['ansioso'];
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Add description context
  if (description) {
    response += ` Entendo que ${description.toLowerCase()}. Deus conhece cada detalhe da sua situação e tem o cuidado perfeito para você.`;
  }
  
  // Intensity-based additions
  if (intensity >= 8) {
    response += " Sei que este momento é particularmente intenso. Permita que Deus te carregue em Seus braços neste momento.";
  }
  
  const verse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
  const prayer = `Pai celestial, diante de Ti trago este momento de ${emotion}. Tu conheces meu coração e minhas necessidades. Concede-me Tua paz que excede todo entendimento. Em nome de Jesus, amém.`;
  
  return {
    response,
    verse: verse.text,
    reference: verse.reference,
    prayer
  };
}

// Prayer response generator
export async function generatePrayerResponse(message: string): Promise<AIResponse> {
  const prayerResponses = [
    "Sua oração foi ouvida por Deus. Ele conhece seu coração e atenderá no tempo perfeito. Continue confiando em Sua bondade.",
    "Deus ouve cada palavra de sua oração. Ele se alegra quando seus filhos se aproximam dEle com fé e sinceridade.",
    "Que bênção saber que você busca a Deus em oração! Ele sempre nos ouve com amor e responde com sabedoria.",
    "A oração move o coração de Deus. Continue perseverando na fé, pois Ele tem planos maravilhosos para sua vida.",
    "Quando oramos, entramos na presença do Todo-Poderoso. Que privilégio poder conversar com o Criador do universo!"
  ];
  
  const response = prayerResponses[Math.floor(Math.random() * prayerResponses.length)];
  const verse = BIBLE_VERSES.filter(v => v.reference.includes('Mateus') || v.reference.includes('1 Pedro') || v.reference.includes('Filipenses'))[Math.floor(Math.random() * 3)];
  
  return {
    response,
    verse: verse.text,
    reference: verse.reference,
    prayer: "Senhor, abençoe esta oração e responda segundo Tua vontade perfeita. Que Tua paz inunde o coração desta pessoa. Em Jesus, amém."
  };
}

// Devotional generator
export async function generateDevotional(topic?: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  const devotionals = [
    {
      title: "A Fidelidade de Deus",
      content: "A fidelidade de Deus é como o sol que nasce a cada manhã. Mesmo quando as circunstâncias mudam, Ele permanece o mesmo. Sua palavra nunca falha e Suas promessas se cumprem. Podemos descansar na certeza de que Deus é fiel em todas as Suas promessas. Ele nunca nos abandona e sempre cumpre aquilo que promete. Sua fidelidade é nosso fundamento sólido em meio às tempestades da vida.",
      verse: "Grande é a tua fidelidade.",
      reference: "Lamentações 3:23"
    },
    {
      title: "O Amor Incondicional",
      content: "O amor de Deus por nós não depende do nosso desempenho ou méritos. Ele nos ama como somos, mas nos ama tanto que não nos deixa como estamos. Este amor transforma vidas, restaura corações e renova esperanças. Não há nada que possamos fazer para merecer ou perder este amor. É um presente gratuito da graça divina que devemos receber com gratidão e compartilhar com outros.",
      verse: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
      reference: "João 3:16"
    },
    {
      title: "Força na Fraqueza",
      content: "Quando nos sentimos fracos e inadequados, é exatamente aí que a força de Deus se manifesta poderosamente. Nossa fraqueza se torna oportunidade para que Ele demonstre Seu poder. Não devemos nos envergonhar de nossas limitações, pois é através delas que Deus mostra Sua suficiência. Com Ele, somos mais que vencedores em todas as circunstâncias da vida.",
      verse: "Posso todas as coisas naquele que me fortalece.",
      reference: "Filipenses 4:13"
    },
    {
      title: "Confiança em Meio às Incertezas",
      content: "A vida está cheia de incertezas, mas podemos ter certeza absoluta em Deus. Ele conhece o futuro e nos prepara para cada situação. Quando não sabemos o que fazer ou para onde ir, podemos confiar que Ele está dirigindo nossos passos. Sua sabedoria é infinita e Seu amor por nós é perfeito. Podemos descansar na certeza de que Ele tem o melhor para nossas vidas.",
      verse: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
      reference: "Provérbios 3:5"
    }
  ];
  
  const devotional = devotionals[Math.floor(Math.random() * devotionals.length)];
  const prayer = "Pai celestial, obrigado por Tua Palavra que nos fortalece e orienta. Ajuda-nos a aplicar estas verdades em nossa vida diária. Que possamos viver de acordo com Tua vontade e glorificar Teu nome. Em nome de Jesus, amém.";
  
  return {
    ...devotional,
    prayer
  };
}

// Export all functions for backward compatibility
export async function generateAIResponse(userMessage: string): Promise<AIResponse> {
  return generateAssistantResponse(userMessage);
}

export async function generateCertificateContent(contributorName: string, contributionType: string): Promise<{
  description: string;
  aiGeneratedPrayer: string;
  aiGeneratedVerse: string;
  verseReference: string;
}> {
  const descriptions = [
    `Reconhecemos com gratidão a valiosa contribuição de ${contributorName} em nossa missão de espalhar a Palavra de Deus. Que Deus continue abençoando abundantemente sua vida e ministério.`,
    `É com alegria que honramos ${contributorName} por sua generosidade e coração disposto a servir ao Reino de Deus. Sua contribuição faz a diferença na vida de muitas pessoas.`,
    `Agradecemos a ${contributorName} por ser um instrumento de Deus em nossa obra. Que suas bênçãos sejam multiplicadas e que sua fé continue crescendo.`
  ];

  const prayers = [
    `Senhor, abençoe ${contributorName} por sua generosidade e coração disposto a servir. Que sua contribuição como ${contributionType} seja multiplicada em vidas transformadas pelo Seu amor. Derrame sobre esta pessoa Suas bênçãos e prospere a obra de suas mãos. Em nome de Jesus, amém.`,
    `Pai celestial, reconhecemos o coração generoso de ${contributorName}. Multiplique suas bênçãos e use sua vida para impactar muitas outras pessoas. Que sua fé seja fortalecida e sua alegria seja completa. Em Cristo oramos, amém.`
  ];

  const verses = [
    { text: "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria.", reference: "2 Coríntios 9:7" },
    { text: "E o meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.", reference: "Filipenses 4:19" }
  ];

  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const prayer = prayers[Math.floor(Math.random() * prayers.length)];
  const verse = verses[Math.floor(Math.random() * verses.length)];

  return {
    description,
    aiGeneratedPrayer: prayer,
    aiGeneratedVerse: verse.text,
    verseReference: verse.reference
  };
}