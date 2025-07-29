// Serviço de IA cristão 100% gratuito usando HuggingFace
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { BibleVerse } from './free-bible-api-service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AIResponse {
  response: string;
  verse?: BibleVerse;
  reference?: string;
  prayer?: string;
  confidence: number;
  source: string;
}

const CACHE_FILE = path.join(__dirname, 'cache.json');

export class FreeHuggingFaceAIService {
  private cache: any = {};

  constructor() {
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf-8');
      this.cache = JSON.parse(data);
    } catch (error) {
      console.log('Cache AI não encontrado, criando novo...');
    }
  }

  private async saveCache(): Promise<void> {
    try {
      await fs.writeFile(CACHE_FILE, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error('Erro ao salvar cache AI:', error);
    }
  }

  // Respostas cristãs organizadas por categoria
  private getOfflineResponses() {
    return {
      saudacao: [
        "Que a paz de Cristo esteja contigo! Como posso te ajudar hoje na sua jornada espiritual?",
        "Seja bem-vindo(a)! Estou aqui para conversar sobre fé, oração e a Palavra de Deus.",
        "Olá! Que Deus te abençoe! Em que posso ajudar você hoje?",
        "A graça e a paz do Senhor Jesus sejam contigo! Como posso te auxiliar espiritualmente?"
      ],
      
      fe: [
        "A fé é o fundamento da nossa relação com Deus. Mesmo quando não vemos o caminho claramente, podemos confiar que Ele nos guia com amor e sabedoria. Continue crendo, pois Deus é fiel às Suas promessas.",
        "Sua fé pode ser pequena como um grão de mostarda, mas com Deus ela pode mover montanhas. Não desista de crer, pois Ele está trabalhando em sua vida de formas que você ainda não pode ver.",
        "A fé cresce através da oração, da leitura da Palavra e da comunhão com outros cristãos. Mantenha-se firme, pois Deus recompensa aqueles que O buscam com sinceridade."
      ],
      
      oracao: [
        "A oração é nossa linha direta com o coração de Deus. Ele se alegra quando seus filhos se aproximam dEle com sinceridade. Continue orando, pois Deus sempre ouve e responde no tempo perfeito.",
        "Quando oramos, entramos na presença do Todo-Poderoso. Que privilégio poder falar com o Criador do universo! Ele conhece suas necessidades antes mesmo de você pedir.",
        "A oração transforma corações e circunstâncias. Não se canse de orar, pois Deus trabalha através das orações de Seus filhos. Sua voz é importante para Ele."
      ],
      
      ansiedade: [
        "A ansiedade é real, mas o amor de Deus é maior. Ele conhece suas preocupações e quer carregar seus fardos. Entregue tudo a Ele em oração e sinta Sua paz que excede todo entendimento.",
        "Quando a ansiedade vier, lembre-se de que Deus tem o controle de todas as coisas. Ele nunca permitirá que você passe por algo que não possa suportar com Sua ajuda.",
        "Respire fundo e lembre-se: você não está sozinho(a). O Espírito Santo está com você como Consolador. Busque Sua presença e encontre descanso para sua alma."
      ],
      
      medo: [
        "O medo é humano, mas Deus é maior que todos os nossos temores. Ele promete estar conosco em todas as situações. Quando o medo vier, segure firme na mão do Pai.",
        "Não tema, porque Deus está contigo. Ele é seu refúgio e fortaleza, socorro bem presente nas tribulações. Confie nEle e encontre coragem para enfrentar seus medos.",
        "O amor perfeito de Deus lança fora todo medo. Quando você compreende o quanto Ele te ama, os medos perdem o poder sobre sua vida."
      ],
      
      gratidao: [
        "A gratidão transforma nossa perspectiva. Quando agradecemos a Deus em todas as circunstâncias, descobrimos Suas bênçãos escondidas. Continue praticando a gratidão diariamente.",
        "Cada novo dia é um presente de Deus. Mesmo nas dificuldades, há motivos para agradecer. Busque as pequenas bênçãos e veja como Deus cuida de você.",
        "A gratidão abre as portas do céu. Quando temos um coração agradecido, atraímos mais bênçãos divinas para nossa vida."
      ],
      
      amor: [
        "O amor de Deus por você é incondicional e eterno. Não há nada que possa separar você desse amor maravilhoso. Você é precioso(a) aos olhos dEle.",
        "Deus te ama como você é, mas te ama tanto que não te deixa como está. Seu amor transforma vidas e renova corações. Permita que Ele trabalhe em você.",
        "Você foi criado(a) no amor e para o amor. Quando experimentamos o amor de Deus, somos capacitados a amar outros da mesma forma."
      ],
      
      forca: [
        "A força vem do Senhor. Quando você se sente fraco(a), é exatamente quando Deus mostra Seu poder através de você. Sua força é aperfeiçoada na fraqueza.",
        "Não se esqueça de que você pode todas as coisas nAquele que te fortalece. Com Deus, não há situação impossível de ser superada.",
        "Como águias, aqueles que esperam no Senhor renovam suas forças. Descanse nEle e permita que Ele te fortaleça para os desafios da vida."
      ],
      
      esperanca: [
        "A esperança em Deus nunca envergonha. Ele tem planos de bem para sua vida, planos de paz e não de mal. Continue esperando, pois Sua fidelidade é renovada a cada manhã.",
        "Mesmo quando tudo parece perdido, Deus está trabalhando nos bastidores. Mantenha a esperança viva, pois Ele pode fazer infinitamente mais do que pedimos ou pensamos.",
        "A esperança cristã não é apenas um desejo, mas uma certeza baseada nas promessas de Deus. Ele sempre cumpre o que promete."
      ],
      
      perdao: [
        "O perdão liberta não apenas o ofensor, mas principalmente quem perdoa. Deus nos perdoou primeiro, e agora somos chamados a perdoar outros.",
        "Quando perdoamos, imitamos o coração de Cristo. Isso não significa que a dor desaparece imediatamente, mas que escolhemos liberar o rancor para Deus.",
        "O perdão é um processo, não um evento único. Seja paciente consigo mesmo(a) e permita que Deus cure as feridas do seu coração."
      ],
      
      geral: [
        "Deus tem um plano maravilhoso para sua vida. Continue buscando Sua face e Ele dirigirá seus passos no caminho certo.",
        "Lembre-se sempre de que você é amado(a), valorizado(a) e tem um propósito divino. Deus nunca desiste de você.",
        "A vida cristã é uma jornada de crescimento. Cada dia é uma nova oportunidade de conhecer mais sobre o amor e a graça de Deus."
      ]
    };
  }

  private async fetchWithTimeout(url: string, options: any, timeout: number = 10000): Promise<Response> {
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

  // Tentar HuggingFace API
  private async tryHuggingFace(message: string): Promise<string | null> {
    try {
      console.log('Tentando HuggingFace API...');
      
      const response = await this.fetchWithTimeout(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Você é um pastor cristão evangélico que oferece conselhos bíblicos em português. ${message}`
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HuggingFace retornou status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.generated_text) {
        console.log('✅ HuggingFace funcionou!');
        return data.generated_text;
      }
      
      throw new Error('Resposta inválida do HuggingFace');
    } catch (error: any) {
      console.log('❌ HuggingFace falhou:', error?.message || 'Erro desconhecido');
      return null;
    }
  }

  // Detectar categoria da mensagem
  private detectCategory(message: string): string {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('oração') || lowercaseMessage.includes('orar') || lowercaseMessage.includes('rezar')) {
      return 'oracao';
    }
    if (lowercaseMessage.includes('medo') || lowercaseMessage.includes('temer') || lowercaseMessage.includes('assustado')) {
      return 'medo';
    }
    if (lowercaseMessage.includes('ansiedade') || lowercaseMessage.includes('ansioso') || lowercaseMessage.includes('preocup')) {
      return 'ansiedade';
    }
    if (lowercaseMessage.includes('fé') || lowercaseMessage.includes('acreditar') || lowercaseMessage.includes('crer')) {
      return 'fe';
    }
    if (lowercaseMessage.includes('amor') || lowercaseMessage.includes('amar')) {
      return 'amor';
    }
    if (lowercaseMessage.includes('força') || lowercaseMessage.includes('forte') || lowercaseMessage.includes('fraco')) {
      return 'forca';
    }
    if (lowercaseMessage.includes('obrigad') || lowercaseMessage.includes('grat')) {
      return 'gratidao';
    }
    if (lowercaseMessage.includes('esperança') || lowercaseMessage.includes('espero')) {
      return 'esperanca';
    }
    if (lowercaseMessage.includes('perdão') || lowercaseMessage.includes('perdoar') || lowercaseMessage.includes('perdoa')) {
      return 'perdao';
    }
    if (lowercaseMessage.includes('olá') || lowercaseMessage.includes('oi') || lowercaseMessage.includes('bom dia')) {
      return 'saudacao';
    }
    
    return 'geral';
  }

  // Obter resposta cristã inteligente
  private getIntelligentResponse(category: string): string {
    const responses = this.getOfflineResponses();
    const categoryResponses = (responses as any)[category] || responses.geral;
    
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }

  // Gerar resposta principal
  async generateResponse(message: string): Promise<AIResponse> {
    console.log(`🤖 Processando mensagem: ${message.substring(0, 50)}...`);
    
    // Detectar categoria para resposta inteligente
    const category = this.detectCategory(message);
    console.log(`📝 Categoria detectada: ${category}`);
    
    // Tentar HuggingFace primeiro
    let aiResponse = await this.tryHuggingFace(message);
    
    let response: string;
    let source: string;
    let confidence: number;
    
    if (aiResponse) {
      // Limpar resposta da IA se necessário
      response = aiResponse.replace(/^.+?(?=Você é um pastor|Como pastor|Meu querido|Querido)/, '').trim();
      if (response.length < 50) {
        response = this.getIntelligentResponse(category);
        source = 'Offline (IA response muito curta)';
        confidence = 0.8;
      } else {
        source = 'HuggingFace AI';
        confidence = 0.9;
      }
    } else {
      // Usar resposta offline inteligente
      response = this.getIntelligentResponse(category);
      source = 'Offline Inteligente';
      confidence = 0.8;
    }
    
    // Salvar resposta no cache
    this.cache.lastHuggingFaceResponse = {
      message,
      response,
      source,
      timestamp: new Date().toISOString()
    };
    await this.saveCache();
    
    console.log(`✅ Resposta gerada com ${source}: ${response.substring(0, 50)}...`);
    
    return {
      response,
      confidence,
      source
    };
  }

  // Gerar resposta emocional
  async generateEmotionalGuidance(emotion: string, intensity: number = 5, description?: string): Promise<AIResponse> {
    console.log(`💭 Gerando orientação emocional para: ${emotion} (intensidade: ${intensity})`);
    
    const emotionMap: { [key: string]: string } = {
      'triste': 'ansiedade',
      'feliz': 'gratidao',
      'ansioso': 'ansiedade',
      'com medo': 'medo',
      'bravo': 'forca',
      'grato': 'gratidao',
      'confuso': 'geral',
      'sozinho': 'amor',
      'cansado': 'forca'
    };
    
    const category = emotionMap[emotion.toLowerCase()] || 'geral';
    const response = this.getIntelligentResponse(category);
    
    return {
      response,
      confidence: 0.85,
      source: 'Offline Emocional'
    };
  }

  // Gerar resposta de oração
  async generatePrayerResponse(prayerRequest: string): Promise<AIResponse> {
    console.log(`🙏 Processando pedido de oração: ${prayerRequest.substring(0, 50)}...`);
    
    // Tentar IA primeiro
    let aiResponse = await this.tryHuggingFace(`Como pastor cristão, responda a este pedido de oração: ${prayerRequest}`);
    
    let response: string;
    
    if (aiResponse && aiResponse.length > 50) {
      response = aiResponse;
    } else {
      // Resposta de oração padrão
      response = `Oro a Deus por você neste momento. Que o Senhor Jesus, em Sua infinita misericórdia, ouça seu coração e responda conforme Sua perfeita vontade. Lembre-se de que Ele conhece suas necessidades antes mesmo de você pedir. Confie no tempo e no plano dEle para sua vida. Em nome de Jesus, amém.`;
    }
    
    return {
      response,
      prayer: "Senhor, abençoa esta pessoa e responde suas orações conforme Tua vontade. Amém.",
      confidence: 0.9,
      source: aiResponse ? 'HuggingFace AI' : 'Oração Padrão'
    };
  }
}

// Instância singleton
export const freeHuggingFaceAIService = new FreeHuggingFaceAIService();