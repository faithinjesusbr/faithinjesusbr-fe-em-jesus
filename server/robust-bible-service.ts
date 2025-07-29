// Serviço robusto de versículos bíblicos com múltiplas APIs gratuitas e fallbacks
const fetch = global.fetch || require('node-fetch');

interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

export class RobustBibleService {
  private cachedVerse: BibleVerse | null = null;
  private lastCacheDate: string | null = null;

  // Versículos offline de alta qualidade para fallback
  private offlineVerses = [
    {
      text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      reference: "João 3:16",
      book: "João",
      chapter: 3,
      verse: 16
    },
    {
      text: "O Senhor é o meu pastor; nada me faltará.",
      reference: "Salmo 23:1",
      book: "Salmos",
      chapter: 23,
      verse: 1
    },
    {
      text: "Posso todas as coisas naquele que me fortalece.",
      reference: "Filipenses 4:13",
      book: "Filipenses",
      chapter: 4,
      verse: 13
    },
    {
      text: "Entregai todas as vossas ansiedades a ele, porque ele tem cuidado de vós.",
      reference: "1 Pedro 5:7",
      book: "1 Pedro",
      chapter: 5,
      verse: 7
    },
    {
      text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
      reference: "Provérbios 3:5",
      book: "Provérbios",
      chapter: 3,
      verse: 5
    },
    {
      text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
      reference: "Isaías 41:10",
      book: "Isaías",
      chapter: 41,
      verse: 10
    },
    {
      text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão, e não se cansarão; andarão, e não se fatigarão.",
      reference: "Isaías 40:31",
      book: "Isaías",
      chapter: 40,
      verse: 31
    },
    {
      text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
      reference: "1 Tessalonicenses 5:18",
      book: "1 Tessalonicenses",
      chapter: 5,
      verse: 18
    },
    {
      text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
      reference: "Romanos 8:28",
      book: "Romanos",
      chapter: 8,
      verse: 28
    },
    {
      text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      reference: "Mateus 11:28",
      book: "Mateus",
      chapter: 11,
      verse: 28
    }
  ];

  // Timeout wrapper para requisições
  private async fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Bible-API.com
  private async getVerseFromBibleAPI(): Promise<BibleVerse | null> {
    try {
      console.log('Tentando Bible-API.com...');
      const popularVerses = [
        'john 3:16', 'psalm 23:1', 'philippians 4:13', 'proverbs 3:5', 
        'isaiah 41:10', 'isaiah 40:31', '1thessalonians 5:18', 'romans 8:28',
        'matthew 11:28', '1peter 5:7'
      ];
      
      const randomVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
      const response = await this.fetchWithTimeout(`https://bible-api.com/${randomVerse}`, 10000);
      
      if (!response.ok) {
        console.log(`Bible-API erro: ${response.status}`);
        return null;
      }
      
      const data = await response.json() as any;
      
      if (data && data.text && data.reference) {
        console.log('✅ Bible-API funcionou!');
        return {
          text: data.text.trim(),
          reference: data.reference,
          book: data.reference.split(' ')[0] || 'Bíblia',
          chapter: parseInt(data.reference.match(/\d+/)?.[0] || '1'),
          verse: parseInt(data.reference.match(/:(\d+)/)?.[1] || '1')
        };
      }
      
      return null;
    } catch (error) {
      console.log('Bible-API falhou:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  // GetBible.net
  private async getVerseFromGetBible(): Promise<BibleVerse | null> {
    try {
      console.log('Tentando GetBible.net...');
      const response = await this.fetchWithTimeout('https://getbible.net/v2/almeida/verses/random', 10000);
      
      if (!response.ok) {
        console.log(`GetBible erro: ${response.status}`);
        return null;
      }
      
      const data = await response.json() as any;
      
      if (data && data.verses && data.verses.length > 0) {
        const verse = data.verses[0];
        console.log('✅ GetBible funcionou!');
        return {
          text: verse.text,
          reference: `${data.book_name} ${data.chapter}:${verse.verse}`,
          book: data.book_name,
          chapter: data.chapter,
          verse: verse.verse
        };
      }
      
      return null;
    } catch (error) {
      console.log('GetBible falhou:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  // Obter versículo com fallback garantido
  async getDailyVerse(): Promise<BibleVerse> {
    const today = new Date().toDateString();
    
    // Usar cache se for o mesmo dia
    if (this.cachedVerse && this.lastCacheDate === today) {
      console.log('📋 Usando versículo em cache do dia');
      return this.cachedVerse;
    }

    console.log('🔍 Buscando novo versículo diário...');

    // Tentar APIs externas com timeout de 10 segundos
    let verse: BibleVerse | null = null;
    
    // Tentar Bible-API primeiro
    verse = await this.getVerseFromBibleAPI();
    
    // Se falhou, tentar GetBible
    if (!verse) {
      verse = await this.getVerseFromGetBible();
    }

    // Se ainda falhou, usar fallback offline
    if (!verse) {
      console.log('⚠️ Todas as APIs falharam, usando versículo offline');
      const dayIndex = new Date().getDate() % this.offlineVerses.length;
      verse = this.offlineVerses[dayIndex];
    }

    // Cachear resultado
    this.cachedVerse = verse;
    this.lastCacheDate = today;
    
    console.log(`✅ Versículo obtido: ${verse.reference}`);
    return verse;
  }

  // Obter versículo aleatório
  async getRandomVerse(): Promise<BibleVerse> {
    console.log('🎲 Gerando versículo aleatório...');
    
    // Tentar APIs externas primeiro
    let verse: BibleVerse | null = null;
    
    verse = await this.getVerseFromBibleAPI();
    if (!verse) {
      verse = await this.getVerseFromGetBible();
    }

    // Fallback offline aleatório
    if (!verse) {
      console.log('⚠️ APIs indisponíveis, usando versículo offline aleatório');
      const randomIndex = Math.floor(Math.random() * this.offlineVerses.length);
      verse = this.offlineVerses[randomIndex];
    }

    console.log(`✅ Versículo aleatório: ${verse.reference}`);
    return verse;
  }
}

export const robustBibleService = new RobustBibleService();