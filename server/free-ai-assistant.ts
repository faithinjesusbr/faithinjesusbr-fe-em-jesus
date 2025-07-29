// Assistente IA gratuito usando HuggingFace e fallbacks inteligentes
// Usar fetch global (Node 18+)
const fetch = global.fetch || require('node-fetch');

interface AIResponse {
  response: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'huggingface' | 'fallback';
}

export class FreeAIAssistant {
  private fallbackResponses = {
    // Respostas para ansiedade
    anxiety: [
      "Lembre-se das palavras de Jesus: 'Não se turbe o vosso coração'. Deus está no controle de todas as coisas e tem o melhor plano para sua vida.",
      "A ansiedade nos rouba a paz que Deus quer nos dar. Entregue suas preocupações a Ele, pois Ele cuida de você com amor infinito.",
      "Quando a ansiedade bater, respire fundo e lembre-se: Deus conhece cada detalhe da sua vida e jamais te abandonará."
    ],
    
    // Respostas para tristeza
    sadness: [
      "Mesmo nos momentos mais difíceis, Deus está ao seu lado. Suas lágrimas não passam despercebidas por Ele.",
      "A tristeza faz parte da jornada humana, mas não é o fim da história. Deus promete consolar os que choram.",
      "Jesus também conheceu a tristeza. Ele entende sua dor e quer lhe dar o consolo que só Ele pode oferecer."
    ],
    
    // Respostas para dúvidas espirituais
    doubt: [
      "Dúvidas são normais na caminhada da fé. Até mesmo João Batista teve dúvidas. O importante é continuar buscando a Deus.",
      "A fé não é ausência de dúvidas, mas a decisão de confiar em Deus mesmo quando não entendemos tudo.",
      "Deus é maior que nossas dúvidas e Seu amor por nós permanece constante, independente dos nossos questionamentos."
    ],
    
    // Respostas gerais motivacionais
    general: [
      "Deus tem planos de bem para sua vida. Confie no processo e no tempo d'Ele.",
      "Você é amado por Deus incondicionalmente. Isso nunca mudará, não importa o que aconteça.",
      "Cada novo dia é uma oportunidade de experimentar a fidelidade e o amor de Deus de forma renovada.",
      "Lembre-se: você foi criado com propósito. Deus tem algo especial preparado para você.",
      "A paz de Deus, que excede todo entendimento, pode guardar seu coração e sua mente em Cristo Jesus."
    ]
  };

  // Detectar contexto da mensagem
  private detectContext(message: string): string {
    const lowerMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (lowerMessage.includes('ansioso') || lowerMessage.includes('preocup') || lowerMessage.includes('medo') || lowerMessage.includes('nervoso')) {
      return 'anxiety';
    }
    
    if (lowerMessage.includes('triste') || lowerMessage.includes('choro') || lowerMessage.includes('dor') || lowerMessage.includes('sofr')) {
      return 'sadness';
    }
    
    if (lowerMessage.includes('duvida') || lowerMessage.includes('incert') || lowerMessage.includes('questio') || lowerMessage.includes('fe')) {
      return 'doubt';
    }
    
    return 'general';
  }

  // Tentar HuggingFace API (gratuita)
  private async tryHuggingFaceAPI(message: string): Promise<string | null> {
    try {
      // Usando modelo Microsoft DialoGPT gratuito
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Como cristão, sobre: ${message}`,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        if (data && data[0] && data[0].generated_text) {
          return data[0].generated_text.replace(`Como cristão, sobre: ${message}`, '').trim();
        }
      }
      
      return null;
    } catch (error) {
      console.log('HuggingFace API indisponível:', error);
      return null;
    }
  }

  // Obter resposta inteligente
  async getResponse(message: string): Promise<AIResponse> {
    console.log(`Processando mensagem: ${message}`);
    
    // Tentar HuggingFace primeiro
    try {
      const hfResponse = await this.tryHuggingFaceAPI(message);
      if (hfResponse && hfResponse.length > 20) {
        return {
          response: hfResponse,
          confidence: 'high',
          source: 'huggingface'
        };
      }
    } catch (error) {
      console.log('HuggingFace falhou, usando fallback...');
    }

    // Fallback inteligente baseado no contexto
    const context = this.detectContext(message);
    const contextResponses = this.fallbackResponses[context as keyof typeof this.fallbackResponses];
    const randomResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)];

    return {
      response: randomResponse,
      confidence: 'medium',
      source: 'fallback'
    };
  }

  // Obter conselho cristão específico
  async getChristianAdvice(topic: string): Promise<AIResponse> {
    const christianPrompt = `Conselho cristão sobre ${topic}: Como a Bíblia nos orienta sobre isso?`;
    return await this.getResponse(christianPrompt);
  }

  // Obter palavra de encorajamento
  async getEncouragement(): Promise<AIResponse> {
    const encouragements = [
      "Deus tem algo especial preparado para você hoje. Confie n'Ele e siga em frente com fé.",
      "Você é mais forte do que imagina porque tem a força de Deus em você. Não desista!",
      "Cada desafio é uma oportunidade de ver Deus agir poderosamente em sua vida.",
      "O amor de Deus por você é infinito e incondicional. Isso nunca mudará.",
      "Deus está escrevendo uma história linda através da sua vida. Confie no processo."
    ];

    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    return {
      response: randomEncouragement,
      confidence: 'high',
      source: 'fallback'
    };
  }
}

export const freeAIAssistant = new FreeAIAssistant();