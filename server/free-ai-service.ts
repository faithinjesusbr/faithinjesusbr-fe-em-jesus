// Free AI Service - Replaces OpenAI with free alternatives and fallback responses

export interface AIResponse {
  response: string;
  verse?: string;
  reference?: string;
  prayer?: string;
}

// Christian pre-written responses for different situations
const CHRISTIANITY_RESPONSES = {
  greeting: [
    "Que a paz de Cristo esteja contigo! Como posso te ajudar hoje na sua jornada espiritual?",
    "Seja bem-vindo(a)! Estou aqui para conversar sobre fé, oração e a Palavra de Deus.",
    "Olá! Que Deus te abençoe! Em que posso ajudar você hoje?"
  ],
  prayer: [
    "A oração é nossa comunicação direta com Deus. Ele sempre nos ouve com amor e misericórdia.",
    "Quando oramos, nos conectamos com o coração de Deus. Ele conhece nossas necessidades antes mesmo de pedirmos.",
    "A oração muda tudo! Deus está sempre pronto a nos ouvir e responder no tempo certo."
  ],
  comfort: [
    "Nos momentos difíceis, lembre-se que Deus nunca nos abandona. Ele está sempre conosco.",
    "A esperança cristã não nos decepciona. Deus tem um plano perfeito para sua vida.",
    "Mesmo nas dificuldades, Deus está trabalhando para o nosso bem. Confie nEle!"
  ],
  encouragement: [
    "Continue firme na fé! Deus tem grandes planos para você e sua família.",
    "Você é amado(a) por Deus de forma incondicional. Nunca se esqueça disso!",
    "Com Deus, todas as coisas são possíveis. Mantenha sua esperança viva!"
  ],
  guidance: [
    "Busque a Deus em oração e na leitura da Bíblia. Ele sempre nos guia pelo caminho certo.",
    "A sabedoria vem de Deus. Peça a Ele discernimento para suas decisões.",
    "Deus conhece o futuro e nos prepara para cada situação. Confie em Sua direção!"
  ]
};

const BIBLE_VERSES = [
  {
    text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
    reference: "João 3:16"
  },
  {
    text: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13"
  },
  {
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28"
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1"
  },
  {
    text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
    reference: "Romanos 8:28"
  },
  {
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
    reference: "Isaías 41:10"
  },
  {
    text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    reference: "1 Pedro 5:7"
  },
  {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  }
];

const PRAYERS = [
  "Pai celestial, derrama Tua paz sobre esta situação. Em nome de Jesus, amém.",
  "Senhor, concede sabedoria e direção. Que Tua vontade seja feita. Amém.",
  "Deus de amor, fortalece nossa fé e esperança. Em Cristo oramos, amém.",
  "Pai, obrigado por Tua presença constante em nossas vidas. Em Jesus, amém."
];

// Try HuggingFace API (free tier)
async function tryHuggingFaceAPI(message: string): Promise<string | null> {
  try {
    // Using a free model that doesn't require API key
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      })
    });

    if (response.ok) {
      const result: any = await response.json();
      return result?.[0]?.generated_text || null;
    }
  } catch (error) {
    console.log('HuggingFace API não disponível:', error);
  }
  return null;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function detectMessageType(message: string): keyof typeof CHRISTIANITY_RESPONSES {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('oração') || lowerMessage.includes('orar') || lowerMessage.includes('rezar')) {
    return 'prayer';
  }
  if (lowerMessage.includes('triste') || lowerMessage.includes('difícil') || lowerMessage.includes('problema') || 
      lowerMessage.includes('dor') || lowerMessage.includes('sofrimento')) {
    return 'comfort';
  }
  if (lowerMessage.includes('decisão') || lowerMessage.includes('escolha') || lowerMessage.includes('caminho') ||
      lowerMessage.includes('direção')) {
    return 'guidance';
  }
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') ||
      lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
    return 'greeting';
  }
  
  return 'encouragement';
}

export async function generateAssistantResponse(message: string): Promise<AIResponse> {
  // Try HuggingFace first (free AI)
  const aiResponse = await tryHuggingFaceAPI(message);
  
  let response: string;
  
  if (aiResponse && aiResponse.length > 10) {
    // Use AI response if available and meaningful
    response = aiResponse;
  } else {
    // Use pre-written Christian responses
    const messageType = detectMessageType(message);
    response = getRandomElement(CHRISTIANITY_RESPONSES[messageType]);
  }
  
  // Always add a Bible verse and prayer
  const verse = getRandomElement(BIBLE_VERSES);
  const prayer = getRandomElement(PRAYERS);
  
  return {
    response,
    verse: verse.text,
    reference: verse.reference,
    prayer
  };
}

export async function generateEmotionalGuidance(emotion: string, intensity: number, description?: string): Promise<AIResponse> {
  const emotionResponses: Record<string, string[]> = {
    ansioso: [
      "A ansiedade é natural, mas Deus nos convida a entregar nossas preocupações a Ele.",
      "Quando a ansiedade vier, lembre-se que Deus tem controle sobre todas as coisas.",
      "Respire fundo e lembre-se: Deus cuida de você com amor paternal."
    ],
    triste: [
      "A tristeza faz parte da vida, mas não é o fim da história. Deus tem consolo para você.",
      "Nas lágrimas, Deus está mais perto. Ele entende sua dor e quer te consolar.",
      "A tristeza é passageira, mas o amor de Deus é eterno."
    ],
    feliz: [
      "Que alegria saber que você está bem! Deus se alegra quando seus filhos estão felizes.",
      "Aproveite este momento de alegria e lembre-se de agradecer a Deus pelas bênçãos.",
      "A alegria do Senhor é nossa força! Continue celebrando a bondade de Deus."
    ],
    com_medo: [
      "O medo é natural, mas a fé em Deus é maior que qualquer temor.",
      "Quando o medo vier, lembre-se que Deus é seu refúgio e fortaleza.",
      "Não tema, porque Deus está com você em todos os momentos."
    ]
  };
  
  const responses = emotionResponses[emotion.toLowerCase()] || emotionResponses.ansioso;
  const response = getRandomElement(responses);
  const verse = getRandomElement(BIBLE_VERSES);
  const prayer = `Pai celestial, diante de Ti trago este momento de ${emotion}. Concede-me Tua paz e sabedoria. Em nome de Jesus, amém.`;
  
  return {
    response: response + " " + (description ? `Entendo que ${description.toLowerCase()}. ` : "") + "Deus está com você neste momento.",
    verse: verse.text,
    reference: verse.reference,
    prayer
  };
}

export async function generatePrayerResponse(message: string): Promise<AIResponse> {
  const prayerResponses = [
    "Sua oração foi ouvida por Deus. Ele conhece seu coração e atenderá no tempo certo.",
    "Deus ouve cada palavra de sua oração. Continue confiando nEle com fé.",
    "Que lindo saber que você busca a Deus em oração. Ele sempre nos ouve com amor.",
    "A oração move o coração de Deus. Continue perseverando na fé e na esperança."
  ];
  
  const response = getRandomElement(prayerResponses);
  const verse = getRandomElement(BIBLE_VERSES.filter(v => v.reference.includes('Mateus') || v.reference.includes('1 Pedro')));
  
  return {
    response,
    verse: verse.text,
    reference: verse.reference,
    prayer: "Senhor, abençoe esta oração e responda segundo Tua vontade perfeita. Em Jesus, amém."
  };
}

export async function generateDevotional(topic?: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  const devotionals = [
    {
      title: "Confiança em Deus",
      content: "A vida nos apresenta muitos desafios, mas podemos confiar que Deus tem um plano perfeito para nós. Mesmo quando não entendemos o caminho, Ele nos guia com Sua sabedoria infinita. Nossa parte é confiar e obedecer, sabendo que Seu amor nunca falha.",
      verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11"
    },
    {
      title: "O Amor de Deus",
      content: "O amor de Deus por nós é incondicional e eterno. Não há nada que possamos fazer para merecer ou perder esse amor. Ele nos ama como somos, mas nos ama tanto que não nos deixa como estamos. Seu amor nos transforma dia após dia.",
      verse: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
      reference: "João 3:16"
    },
    {
      title: "Força na Fraqueza",
      content: "Quando nos sentimos fracos, é exatamente aí que a força de Deus se manifesta. Nosso Senhor nos fortalece e nos capacita para enfrentar qualquer situação. Com Ele, somos mais que vencedores em todas as circunstâncias da vida.",
      verse: "Posso todas as coisas naquele que me fortalece.",
      reference: "Filipenses 4:13"
    }
  ];
  
  const devotional = getRandomElement(devotionals);
  const prayer = `Pai celestial, obrigado por Tua Palavra que nos fortalece. Ajuda-nos a aplicar esta verdade em nossa vida diária. Em nome de Jesus, amém.`;
  
  return {
    ...devotional,
    prayer
  };
}