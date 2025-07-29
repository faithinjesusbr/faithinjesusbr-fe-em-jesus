// API de emoções usando DeepInfra gratuita e fallbacks inteligentes
const fetch = global.fetch || require('node-fetch');

interface EmotionalGuidance {
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
  emotion: string;
}

export class EmotionAPI {
  // Mensagens reserva por emoção (baseado no código Python)
  private fallbackMessages = {
    "ansioso": {
      title: "Paz em Meio à Ansiedade",
      content: "Entregue todas as suas preocupações a Deus, pois Ele cuida de você. A ansiedade não pode habitar onde há confiança plena no Senhor. Respire fundo e lembre-se: Deus está no controle de todas as coisas.",
      verse: "Entregai todas as vossas ansiedades a ele, porque ele tem cuidado de vós.",
      reference: "1 Pedro 5:7"
    },
    "triste": {
      title: "Consolo na Tristeza",
      content: "Próximo está o Senhor dos que têm o coração quebrantado. Suas lágrimas não passam despercebidas por Deus. Ele promete consolar todos os que choram e transformar sua tristeza em alegria.",
      verse: "Próximo está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.",
      reference: "Salmo 34:18"
    },
    "alegre": {
      title: "Alegria no Senhor",
      content: "Alegra-te sempre no Senhor. A alegria do Senhor é a nossa força. Compartilhe essa alegria com outros e seja uma luz que reflete o amor de Deus.",
      verse: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.",
      reference: "Filipenses 4:4"
    },
    "cansado": {
      title: "Descanso em Jesus",
      content: "Venham a mim todos os que estão cansados e sobrecarregados, e eu lhes darei descanso. Jesus convida você a entregar seus fardos a Ele e encontrar verdadeiro descanso para sua alma.",
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      reference: "Mateus 11:28"
    },
    "solitario": {
      title: "Nunca Sozinho",
      content: "Deus nunca te deixa sozinho. Mesmo quando você se sente isolado, o Senhor está ao seu lado. Ele conhece cada pensamento e cada sentimento, e promete estar com você sempre.",
      verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
      reference: "Isaías 41:10"
    },
    "grato": {
      title: "Gratidão e Louvor",
      content: "Dai graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus. A gratidão transforma nosso coração e nos aproxima de Deus.",
      verse: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
      reference: "1 Tessalonicenses 5:18"
    },
    "confiante": {
      title: "Confiança em Deus",
      content: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento. Quando colocamos nossa confiança em Deus, Ele dirige nossos passos.",
      verse: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
      reference: "Provérbios 3:5"
    },
    "irritado": {
      title: "Domínio Próprio",
      content: "Irai-vos e não pequeis. A ira é uma emoção humana natural, mas devemos aprender a controlá-la através da sabedoria de Deus e do fruto do Espírito.",
      verse: "Irai-vos, e não pequeis; não se ponha o sol sobre a vossa ira.",
      reference: "Efésios 4:26"
    }
  };

  // Tentar DeepInfra API (gratuita como no código Python)
  private async tryDeepInfraAPI(emotion: string): Promise<string | null> {
    try {
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
            "content": "Você é um pastor cristão que responde com mensagens bíblicas e inspiradoras em português."
          },
          {
            "role": "user", 
            "content": `Preciso de uma palavra de encorajamento cristão para alguém que está se sentindo ${emotion}. Inclua uma reflexão bíblica.`
          }
        ],
        "temperature": 0.7,
        "max_tokens": 300
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        timeout: 8000
      });

      if (response.ok) {
        const result = await response.json() as any;
        if (result.choices && result.choices[0] && result.choices[0].message) {
          return result.choices[0].message.content;
        }
      }
      
      return null;
    } catch (error) {
      console.log('DeepInfra API indisponível:', error);
      return null;
    }
  }

  // Gerar orientação emocional
  async generateEmotionalGuidance(emotion: string): Promise<EmotionalGuidance> {
    console.log(`Gerando orientação para emoção: ${emotion}`);
    
    // Normalizar emoção
    const normalizedEmotion = emotion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Tentar DeepInfra primeiro
    try {
      const aiResponse = await this.tryDeepInfraAPI(normalizedEmotion);
      if (aiResponse && aiResponse.length > 50) {
        // Se conseguiu resposta da IA, usar com fallback para verso
        const fallback = this.fallbackMessages[normalizedEmotion as keyof typeof this.fallbackMessages] || 
                        this.fallbackMessages["confiante"];
        
        return {
          title: `Palavra para quem se sente ${emotion}`,
          content: aiResponse,
          verse: fallback.verse,
          reference: fallback.reference,
          prayer: "Pai celestial, obrigado por Tua Palavra que nos fortalece e orienta. Ajuda-nos a aplicar estas verdades em nossa vida diária. Que possamos viver de acordo com Tua vontade e glorificar Teu nome. Em nome de Jesus, amém.",
          emotion: emotion
        };
      }
    } catch (error) {
      console.log('DeepInfra falhou, usando fallback...');
    }

    // Fallback inteligente baseado na emoção
    const fallback = this.fallbackMessages[normalizedEmotion as keyof typeof this.fallbackMessages] || 
                    this.fallbackMessages["confiante"];

    return {
      title: fallback.title,
      content: fallback.content,
      verse: fallback.verse,
      reference: fallback.reference,
      prayer: "Pai celestial, obrigado por Tua Palavra que nos fortalece e orienta. Ajuda-nos a aplicar estas verdades em nossa vida diária. Que possamos viver de acordo com Tua vontade e glorificar Teu nome. Em nome de Jesus, amém.",
      emotion: emotion
    };
  }
}

export const emotionAPI = new EmotionAPI();