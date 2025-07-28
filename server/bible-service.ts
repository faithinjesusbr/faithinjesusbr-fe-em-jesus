// Using native fetch available in Node.js 18+

interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

interface BibleApiResponse {
  data: {
    id: string;
    content: string;
    reference: string;
    verseCount: number;
  }
}

// Lista expandida de versículos em português como fallback principal
const FALLBACK_VERSES = [
  {
    text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    book: "João",
    chapter: 3,
    verse: 16
  },
  {
    text: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13",
    book: "Filipenses", 
    chapter: 4,
    verse: 13
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1",
    book: "Salmos",
    chapter: 23,
    verse: 1
  },
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    reference: "Salmos 37:5",
    book: "Salmos",
    chapter: 37,
    verse: 5
  },
  {
    text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
    reference: "Romanos 8:28",
    book: "Romanos",
    chapter: 8,
    verse: 28
  },
  {
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
    reference: "Isaías 41:10",
    book: "Isaías",
    chapter: 41,
    verse: 10
  },
  {
    text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    reference: "1 Pedro 5:7",
    book: "1 Pedro",
    chapter: 5,
    verse: 7
  },
  {
    text: "A palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes.",
    reference: "Hebreus 4:12",
    book: "Hebreus",
    chapter: 4,
    verse: 12
  },
  {
    text: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.",
    reference: "Mateus 5:6",
    book: "Mateus",
    chapter: 5,
    verse: 6
  },
  {
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    book: "Mateus",
    chapter: 11,
    verse: 28
  },
  {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o SENHOR; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11",
    book: "Jeremias",
    chapter: 29,
    verse: 11
  },
  {
    text: "O SENHOR é a minha luz e a minha salvação; a quem temerei?",
    reference: "Salmos 27:1",
    book: "Salmos",
    chapter: 27,
    verse: 1
  },
  {
    text: "Confia no SENHOR de todo o teu coração, e não te estribes no teu próprio entendimento.",
    reference: "Provérbios 3:5",
    book: "Provérbios",
    chapter: 3,
    verse: 5
  },
  {
    text: "Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna, por Cristo Jesus nosso Senhor.",
    reference: "Romanos 6:23",
    book: "Romanos",
    chapter: 6,
    verse: 23
  },
  {
    text: "E disse-lhes: Ide por todo o mundo, pregai o evangelho a toda criatura.",
    reference: "Marcos 16:15",
    book: "Marcos",
    chapter: 16,
    verse: 15
  },
  {
    text: "Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.",
    reference: "Mateus 6:33",
    book: "Mateus",
    chapter: 6,
    verse: 33
  },
  {
    text: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.",
    reference: "Mateus 18:20",
    book: "Mateus",
    chapter: 18,
    verse: 20
  },
  {
    text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.",
    reference: "1 João 1:9",
    book: "1 João",
    chapter: 1,
    verse: 9
  },
  {
    text: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.",
    reference: "Efésios 2:8",
    book: "Efésios",
    chapter: 2,
    verse: 8
  },
  {
    text: "Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.",
    reference: "Romanos 5:8",
    book: "Romanos",
    chapter: 5,
    verse: 8
  }
];

// Lista de versículos populares com IDs específicos para labs.bible.org
const POPULAR_VERSES_IDS = [
  'JHN.3.16', // João 3:16
  'PHP.4.13', // Filipenses 4:13
  'PSA.23.1', // Salmos 23:1
  'PSA.37.5', // Salmos 37:5
  'ROM.8.28', // Romanos 8:28
  'ISA.41.10', // Isaías 41:10
  '1PE.5.7', // 1 Pedro 5:7
  'HEB.4.12', // Hebreus 4:12
  'JER.29.11', // Jeremias 29:11
  'PRO.3.5-6', // Provérbios 3:5-6
  'MAT.11.28', // Mateus 11:28
  'PSA.46.1', // Salmos 46:1
  'JOS.1.9', // Josué 1:9
  '2TI.1.7', // 2 Timóteo 1:7
  'MAT.6.26', // Mateus 6:26
];

class BibleService {
  private readonly BASE_URL = 'https://labs.bible.org/api';
  
  // Gerar versículo do dia baseado na data
  async getDailyVerse(): Promise<BibleVerse> {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Usar versículo fixo baseado no dia para garantir português
    const fallbackIndex = dayOfYear % FALLBACK_VERSES.length;
    return FALLBACK_VERSES[fallbackIndex];
  }

  // Gerar versículo aleatório
  async getRandomVerse(): Promise<BibleVerse> {
    // Sempre usar versículos em português do banco local
    const randomIndex = Math.floor(Math.random() * FALLBACK_VERSES.length);
    return FALLBACK_VERSES[randomIndex];
  }

  // Gerar novo versículo (diferente do aleatório e do diário)
  async getNewVerse(): Promise<BibleVerse> {
    try {
      // Tentar OpenAI primeiro para garantir português
      return await this.getVerseFromOpenAI();
    } catch (error) {
      console.error('Erro ao buscar novo versículo via OpenAI:', error);
      // Fallback: versículo fixo aleatório em português
      const randomIndex = Math.floor(Math.random() * FALLBACK_VERSES.length);
      return FALLBACK_VERSES[randomIndex];
    }
  }

  // Tentar múltiplas fontes de API, priorizando versículos em português
  private async tryMultipleSources(forceNew: boolean = false): Promise<BibleVerse> {
    const errors: Error[] = [];

    // 1. Tentar OpenAI primeiro para garantir português (se disponível)
    try {
      return await this.getVerseFromOpenAI();
    } catch (error) {
      errors.push(error as Error);
    }

    // 2. Usar versículo fixo em português (mais confiável)
    console.log('Usando versículo em português do banco local');
    const randomIndex = Math.floor(Math.random() * FALLBACK_VERSES.length);
    return FALLBACK_VERSES[randomIndex];
  }

  // Buscar versículo específico por ID
  private async getVerseById(verseId: string): Promise<BibleVerse> {
    const url = `${this.BASE_URL}/?passage=${verseId}&type=json&formatting=plain`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Fe-em-Jesus-BR/1.0',
        'Accept': 'application/json',
      },
      // timeout: 10000, // 10 segundos timeout
    });

    if (!response.ok) {
      throw new Error(`Labs Bible API error: ${response.status}`);
    }

    const data = await response.json() as any[];
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Resposta inválida da Labs Bible API');
    }

    const verse = data[0];
    return {
      text: verse.text,
      reference: `${verse.bookname} ${verse.chapter}:${verse.verse}`,
      book: verse.bookname,
      chapter: parseInt(verse.chapter),
      verse: parseInt(verse.verse)
    };
  }

  // Buscar versículo aleatório da Labs Bible
  private async getRandomFromLabsBible(): Promise<BibleVerse> {
    const url = `${this.BASE_URL}/?passage=random&type=json&formatting=plain`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Fe-em-Jesus-BR/1.0',
        'Accept': 'application/json',
      },
      // timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`Labs Bible random API error: ${response.status}`);
    }

    const data = await response.json() as any[];
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Resposta inválida da Labs Bible random API');
    }

    const verse = data[0];
    return {
      text: verse.text,
      reference: `${verse.bookname} ${verse.chapter}:${verse.verse}`,
      book: verse.bookname,
      chapter: parseInt(verse.chapter),
      verse: parseInt(verse.verse)
    };
  }

  // API alternativa: bible-api.com
  private async getVerseFromBibleApi(): Promise<BibleVerse> {
    const randomBook = [
      'john', 'psalms', 'proverbs', 'matthew', 'romans', 'philippians', 
      'ephesians', 'colossians', 'thessalonians', 'timothy', 'peter', 'james'
    ];
    const book = randomBook[Math.floor(Math.random() * randomBook.length)];
    const chapter = Math.floor(Math.random() * 10) + 1;
    const verse = Math.floor(Math.random() * 20) + 1;
    
    const url = `https://bible-api.com/${book}${chapter}:${verse}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Fe-em-Jesus-BR/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (!data || !data.text) {
      throw new Error('Resposta inválida da Bible API');
    }

    return {
      text: data.text,
      reference: data.reference,
      book: data.reference.split(' ')[0],
      chapter: parseInt(data.reference.match(/(\d+):/)?.[1] || '1'),
      verse: parseInt(data.reference.match(/:(\d+)/)?.[1] || '1')
    };
  }

  // Backup com OpenAI (se disponível)
  private async getVerseFromOpenAI(): Promise<BibleVerse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key não disponível');
    }

    try {
      const { generateBibleVerse } = await import('./openai');
      return await generateBibleVerse();
    } catch (error) {
      throw new Error(`OpenAI backup falhou: ${error}`);
    }
  }

  // Versículos para emoções específicas (fallback offline)
  getVerseForEmotion(emotion: string): BibleVerse {
    const emotionVerses: { [key: string]: BibleVerse } = {
      ansioso: {
        text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
        reference: "1 Pedro 5:7",
        book: "1 Pedro",
        chapter: 5,
        verse: 7
      },
      triste: {
        text: "Bem-aventurados os que choram, porque eles serão consolados.",
        reference: "Mateus 5:4",
        book: "Mateus",
        chapter: 5,
        verse: 4
      },
      com_medo: {
        text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
        reference: "Isaías 41:10",
        book: "Isaías",
        chapter: 41,
        verse: 10
      },
      desanimado: {
        text: "Posso todas as coisas naquele que me fortalece.",
        reference: "Filipenses 4:13",
        book: "Filipenses",
        chapter: 4,
        verse: 13
      },
      agradecido: {
        text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
        reference: "1 Tessalonicenses 5:18",
        book: "1 Tessalonicenses",
        chapter: 5,
        verse: 18
      }
    };

    return emotionVerses[emotion] || emotionVerses.ansioso;
  }
}

export const bibleService = new BibleService();
export type { BibleVerse };