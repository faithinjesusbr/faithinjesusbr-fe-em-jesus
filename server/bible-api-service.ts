// Serviço gratuito para versículos bíblicos usando APIs públicas
// Usar fetch global (Node 18+)
const fetch = global.fetch || require('node-fetch');

interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

// Cache local para evitar repetir versículos no mesmo dia
const dailyVerseCache = new Map<string, BibleVerse>();

export class FreeBibleAPIService {
  private getDateKey(): string {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Versículos pré-definidos como fallback
  private getFallbackVerses(): BibleVerse[] {
    return [
      {
        text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
        reference: "Provérbios 3:5",
        book: "Provérbios",
        chapter: 3,
        verse: 5
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
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
        reference: "João 3:16",
        book: "João",
        chapter: 3,
        verse: 16
      },
      {
        text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
        reference: "Isaías 41:10",
        book: "Isaías",
        chapter: 41,
        verse: 10
      },
      {
        text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
        reference: "Romanos 8:28",
        book: "Romanos",
        chapter: 8,
        verse: 28
      },
      {
        text: "O Senhor te abençoe e te guarde.",
        reference: "Números 6:24",
        book: "Números",
        chapter: 6,
        verse: 24
      },
      {
        text: "Grande é a tua fidelidade.",
        reference: "Lamentações 3:23",
        book: "Lamentações",
        chapter: 3,
        verse: 23
      },
      {
        text: "Pela fé andamos, não pelo que vemos.",
        reference: "2 Coríntios 5:7",
        book: "2 Coríntios",
        chapter: 5,
        verse: 7
      },
      {
        text: "Busque primeiro o reino de Deus e a sua justiça.",
        reference: "Mateus 6:33",
        book: "Mateus",
        chapter: 6,
        verse: 33
      }
    ];
  }

  // Obter versículo do dia (com cache)
  async getDailyVerse(): Promise<BibleVerse> {
    const dateKey = this.getDateKey();
    
    // Verificar cache local
    if (dailyVerseCache.has(dateKey)) {
      return dailyVerseCache.get(dateKey)!;
    }

    try {
      // Tentar GetBible API primeiro
      const getBibleVerse = await this.getVerseFromGetBible();
      if (getBibleVerse) {
        dailyVerseCache.set(dateKey, getBibleVerse);
        return getBibleVerse;
      }
    } catch (error) {
      console.log('GetBible API falhou, tentando Bible-API...');
    }

    try {
      // Tentar Bible-API como fallback
      const bibleApiVerse = await this.getVerseFromBibleAPI();
      if (bibleApiVerse) {
        dailyVerseCache.set(dateKey, bibleApiVerse);
        return bibleApiVerse;
      }
    } catch (error) {
      console.log('Bible-API também falhou, usando versículo pré-definido...');
    }

    // Fallback para versículos pré-definidos
    const fallbackVerses = this.getFallbackVerses();
    const todayIndex = new Date().getDate() % fallbackVerses.length;
    const selectedVerse = fallbackVerses[todayIndex];
    
    dailyVerseCache.set(dateKey, selectedVerse);
    return selectedVerse;
  }

  // Obter versículo aleatório
  async getRandomVerse(): Promise<BibleVerse> {
    try {
      // Tentar GetBible API primeiro
      const getBibleVerse = await this.getVerseFromGetBible();
      if (getBibleVerse) return getBibleVerse;
    } catch (error) {
      console.log('GetBible API falhou para versículo aleatório...');
    }

    try {
      // Tentar Bible-API como fallback
      const bibleApiVerse = await this.getVerseFromBibleAPI();
      if (bibleApiVerse) return bibleApiVerse;
    } catch (error) {
      console.log('Bible-API também falhou para versículo aleatório...');
    }

    // Fallback para versículos pré-definidos
    const fallbackVerses = this.getFallbackVerses();
    const randomIndex = Math.floor(Math.random() * fallbackVerses.length);
    return fallbackVerses[randomIndex];
  }

  // GetBible API
  private async getVerseFromGetBible(): Promise<BibleVerse | null> {
    try {
      const response = await fetch('https://getbible.net/v2/almeida/verses/random', {
        timeout: 5000
      });
      
      if (!response.ok) return null;
      
      const data = await response.json() as any;
      
      if (data && data.verses && data.verses.length > 0) {
        const verse = data.verses[0];
        return {
          text: verse.text,
          reference: `${data.book_name} ${verse.chapter}:${verse.verse}`,
          book: data.book_name,
          chapter: verse.chapter,
          verse: verse.verse
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro na GetBible API:', error);
      return null;
    }
  }

  // Bible-API
  private async getVerseFromBibleAPI(): Promise<BibleVerse | null> {
    try {
      // Lista de versículos populares para buscar
      const popularVerses = [
        'john 3:16', 'psalm 23:1', 'romans 8:28', 'philippians 4:13',
        'proverbs 3:5', 'isaiah 41:10', '2corinthians 5:7', 'matthew 6:33'
      ];
      
      const randomVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
      const response = await fetch(`https://bible-api.com/${randomVerse}`, {
        timeout: 5000
      });
      
      if (!response.ok) return null;
      
      const data = await response.json() as any;
      
      if (data && data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference,
          book: data.verses[0]?.book_name || '',
          chapter: data.verses[0]?.chapter || 0,
          verse: data.verses[0]?.verse || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro na Bible-API:', error);
      return null;
    }
  }
}

export const freeBibleAPIService = new FreeBibleAPIService();