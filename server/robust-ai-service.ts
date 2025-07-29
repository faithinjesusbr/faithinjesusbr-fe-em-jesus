// Serviço de IA robusto com múltiplas APIs gratuitas e fallbacks inteligentes
const fetch = global.fetch || require('node-fetch');

interface AIResponse {
  response: string;
  confidence: string;
  source: string;
}

export class RobustAIService {
  // Respostas cristãs offline organizadas por categoria
  private offlineResponses = {
    greetings: [
      "A paz do Senhor esteja com você! Como posso ajudar em sua jornada espiritual hoje?",
      "Que a graça de Deus te acompanhe! Em que posso auxiliar você espiritualmente?",
      "Deus te abençoe! Como posso ser instrumento de encorajamento para você hoje?"
    ],
    faith: [
      "A fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem. Mesmo nas dificuldades, Deus permanece fiel às Suas promessas.",
      "Confie no Senhor de todo o seu coração. Ele conhece seus desafios e tem um plano perfeito para sua vida.",
      "A fé cresce através da oração, leitura da Palavra e comunhão com outros cristãos. Persevere, pois Deus está trabalhando em sua vida."
    ],
    prayer: [
      "A oração é nossa conexão direta com o Pai. Fale com Ele como fala com um amigo, compartilhe seus medos, alegrias e necessidades.",
      "Deus ouve todas as suas orações. Mesmo quando a resposta demora, Ele está trabalhando para o seu bem.",
      "Ore com fé, sabendo que Deus se importa com cada detalhe da sua vida. Ele é um Pai amoroso que deseja o melhor para você."
    ],
    comfort: [
      "Deus está perto dos que têm o coração quebrantado. Ele promete consolar todos os que choram e transformar sua dor em alegria.",
      "Mesmo nas tempestades da vida, Jesus está no barco com você. Ele acalma os ventos e as ondas com Sua palavra.",
      "O Senhor é o seu refúgio e fortaleza, socorro bem presente na angústia. Descanse nEle e encontre paz."
    ],
    guidance: [
      "Deus tem um propósito específico para sua vida. Busque-O em oração e Ele dirigirá seus passos no caminho certo.",
      "A Palavra de Deus é lâmpada para os seus pés e luz para o seu caminho. Nela você encontrará sabedoria para as decisões.",
      "Confie na direção do Espírito Santo. Ele te guiará em toda a verdade e te ajudará a discernir a vontade de Deus."
    ]
  };

  // Timeout wrapper
  private async fetchWithTimeout(url: string, options: any, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // DeepInfra API com Mistral
  private async tryDeepInfra(message: string): Promise<string | null> {
    try {
      console.log('Tentando DeepInfra API...');
      const url = "https://api.deepinfra.com/v1/openai/chat/completions";
      const headers = {
        "Authorization": "Bearer IasbEQCNlgTcUpWXuNsurq6o891KUlhK",
        "Content-Type": "application/json"
      };
      
      const data = {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        "messages": [
          {
            "role": "system", 
            "content": "Você é um pastor cristão evangelico que oferece conselhos bíblicos em português. Responda com amor, sabedoria e versículos bíblicos quando apropriado."
          },
          {
            "role": "user", 
            "content": message
          }
        ],
        "temperature": 0.7,
        "max_tokens": 250
      };

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      }, 10000);

      if (response.ok) {
        const result = await response.json() as any;
        if (result.choices && result.choices[0] && result.choices[0].message) {
          console.log('✅ DeepInfra funcionou!');
          return result.choices[0].message.content;
        }
      } else {
        console.log(`DeepInfra erro: ${response.status}`);
      }
      
      return null;
    } catch (error) {
      console.log('DeepInfra falhou:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  // HuggingFace API alternativa
  private async tryHuggingFace(message: string): Promise<string | null> {
    try {
      console.log('Tentando HuggingFace API...');
      const response = await this.fetchWithTimeout('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer hf_your_token_here',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Resposta cristã para: ${message}`,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        })
      }, 10000);

      if (response.ok) {
        const data = await response.json() as any;
        if (data && data[0] && data[0].generated_text) {
          console.log('✅ HuggingFace funcionou!');
          return data[0].generated_text;
        }
      } else {
        console.log(`HuggingFace erro: ${response.status}`);
      }

      return null;
    } catch (error) {
      console.log('HuggingFace falhou:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  // Detectar categoria da mensagem
  private categorizeMessage(message: string): keyof typeof this.offlineResponses {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia')) {
      return 'greetings';
    } else if (lowerMessage.includes('fé') || lowerMessage.includes('acreditar') || lowerMessage.includes('confiar')) {
      return 'faith';
    } else if (lowerMessage.includes('oração') || lowerMessage.includes('orar') || lowerMessage.includes('rezar')) {
      return 'prayer';
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('dor') || lowerMessage.includes('sofrimento')) {
      return 'comfort';
    } else if (lowerMessage.includes('decisão') || lowerMessage.includes('caminho') || lowerMessage.includes('direção')) {
      return 'guidance';
    }
    
    return 'faith'; // Default
  }

  // Obter resposta inteligente da IA
  async getIntelligentResponse(message: string): Promise<AIResponse> {
    console.log(`🤖 Processando mensagem: "${message.substring(0, 50)}..."`);

    // Tentar APIs externas primeiro
    let aiResponse: string | null = null;
    
    // Tentar DeepInfra primeiro
    aiResponse = await this.tryDeepInfra(message);
    
    // Se falhou, tentar HuggingFace
    if (!aiResponse) {
      aiResponse = await this.tryHuggingFace(message);
    }

    // Se APIs falharam, usar resposta offline inteligente
    if (!aiResponse || aiResponse.length < 20) {
      console.log('⚠️ APIs indisponíveis, usando resposta offline inteligente');
      const category = this.categorizeMessage(message);
      const responses = this.offlineResponses[category];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return {
        response: randomResponse,
        confidence: 'high',
        source: 'offline_intelligent'
      };
    }

    console.log('✅ Resposta IA obtida com sucesso');
    return {
      response: aiResponse,
      confidence: 'high',
      source: 'ai_api'
    };
  }

  // Gerar devocional por emoção
  async generateDevotionalByEmotion(emotion: string): Promise<{
    title: string;
    content: string;
    verse: string;
    reference: string;
    prayer: string;
  }> {
    console.log(`📖 Gerando devocional para emoção: ${emotion}`);

    // Tentar IA primeiro
    const aiPrompt = `Crie um devocional cristão em português para alguém que está se sentindo ${emotion}. Inclua título, reflexão bíblica e versículo.`;
    const aiResponse = await this.tryDeepInfra(aiPrompt);

    if (aiResponse && aiResponse.length > 100) {
      console.log('✅ Devocional IA gerado');
      return {
        title: `Palavra para quem se sente ${emotion}`,
        content: aiResponse,
        verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
        reference: "Isaías 41:10",
        prayer: "Pai celestial, obrigado por Tua Palavra que nos fortalece. Ajuda-nos a aplicar estas verdades em nossa vida. Em nome de Jesus, amém."
      };
    }

    // Fallback offline por emoção
    console.log('⚠️ Usando devocional offline');
    const devotionals: { [key: string]: any } = {
      ansioso: {
        title: "Paz em Meio à Ansiedade",
        content: "Entregue todas as suas preocupações a Deus, pois Ele cuida de você. A ansiedade não pode habitar onde há confiança plena no Senhor. Respire fundo e lembre-se: Deus está no controle de todas as coisas.",
        verse: "Entregai todas as vossas ansiedades a ele, porque ele tem cuidado de vós.",
        reference: "1 Pedro 5:7"
      },
      triste: {
        title: "Consolo na Tristeza",
        content: "Próximo está o Senhor dos que têm o coração quebrantado. Suas lágrimas não passam despercebidas por Deus. Ele promete consolar todos os que choram e transformar sua tristeza em alegria.",
        verse: "Próximo está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.",
        reference: "Salmo 34:18"
      },
      alegre: {
        title: "Alegria no Senhor",
        content: "Alegra-te sempre no Senhor. A alegria do Senhor é a nossa força. Compartilhe essa alegria com outros e seja uma luz que reflete o amor de Deus.",
        verse: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.",
        reference: "Filipenses 4:4"
      }
    };

    const normalizedEmotion = emotion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const devotional = devotionals[normalizedEmotion] || devotionals.ansioso;

    return {
      ...devotional,
      prayer: "Pai celestial, obrigado por Tua Palavra que nos fortalece. Ajuda-nos a aplicar estas verdades em nossa vida. Em nome de Jesus, amém."
    };
  }
}

export const robustAIService = new RobustAIService();