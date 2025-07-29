// Serviço de Bíblia 100% gratuito com cache diário e fallbacks
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface DailyCache {
  dailyVerse: BibleVerse | null;
  lastUpdateDate: string | null;
  lastHuggingFaceResponse: any | null;
  lastResponseDate: string | null;
}

const CACHE_FILE = path.join(__dirname, 'cache.json');
const FALLBACK_FILE = path.join(__dirname, 'fallback.json');

export class FreeBibleAPIService {
  private cache: DailyCache = {
    dailyVerse: null,
    lastUpdateDate: null,
    lastHuggingFaceResponse: null,
    lastResponseDate: null
  };

  constructor() {
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf-8');
      this.cache = JSON.parse(data);
    } catch (error) {
      console.log('Cache não encontrado, criando novo cache...');
      await this.saveCache();
    }
  }

  private async saveCache(): Promise<void> {
    try {
      await fs.writeFile(CACHE_FILE, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  private async loadFallbackVerses(): Promise<any> {
    try {
      const data = await fs.readFile(FALLBACK_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar versículos de fallback:', error);
      return this.getHardcodedFallback();
    }
  }

  private getHardcodedFallback(): any {
    return {
      verses: {
        geral: [
          {
            text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
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
          }
        ]
      }
    };
  }

  private async fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
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

  // Tentar Bible-API.com primeiro
  private async tryBibleAPI(): Promise<BibleVerse | null> {
    try {
      console.log('Tentando Bible-API.com...');
      const response = await this.fetchWithTimeout('https://bible-api.com/?random=verse&translation=almeida');
      
      if (!response.ok) {
        throw new Error(`Bible-API retornou status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.text && data.reference) {
        const verse: BibleVerse = {
          text: data.text.trim(),
          reference: data.reference,
          book: data.book_name || 'Desconhecido',
          chapter: data.chapter || 1,
          verse: data.verse || 1
        };
        
        console.log('✅ Bible-API.com funcionou!', verse.reference);
        return verse;
      }
      
      throw new Error('Resposta inválida da Bible-API');
    } catch (error: any) {
      console.log('❌ Bible-API.com falhou:', error?.message || 'Erro desconhecido');
      return null;
    }
  }

  // Tentar GetBible.net como fallback
  private async tryGetBible(): Promise<BibleVerse | null> {
    try {
      console.log('Tentando GetBible.net...');
      
      // Lista de livros com capítulos conhecidos
      const books = [
        { book: 'João', chapters: 21 },
        { book: 'Salmos', chapters: 150 },
        { book: 'Provérbios', chapters: 31 },
        { book: 'Filipenses', chapters: 4 },
        { book: 'Romanos', chapters: 16 }
      ];
      
      const randomBook = books[Math.floor(Math.random() * books.length)];
      const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
      
      // Tentar buscar um capítulo específico
      const url = `https://getbible.net/json?book=${encodeURIComponent(randomBook.book)}&chapter=${randomChapter}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`GetBible retornou status ${response.status}`);
      }
      
      const text = await response.text();
      // GetBible retorna JSONP, precisamos limpar
      const jsonText = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      const data = JSON.parse(jsonText);
      
      if (data && data.book && data.chapter) {
        const verses = Object.values(data.chapter);
        if (verses.length > 0) {
          const randomVerse = verses[Math.floor(Math.random() * verses.length)] as any;
          
          const verse: BibleVerse = {
            text: randomVerse.verse.trim(),
            reference: `${randomBook.book} ${randomChapter}:${randomVerse.verse_nr}`,
            book: randomBook.book,
            chapter: randomChapter,
            verse: parseInt(randomVerse.verse_nr)
          };
          
          console.log('✅ GetBible.net funcionou!', verse.reference);
          return verse;
        }
      }
      
      throw new Error('Resposta inválida do GetBible');
    } catch (error: any) {
      console.log('❌ GetBible.net falhou:', error?.message || 'Erro desconhecido');
      return null;
    }
  }

  // Fallback local organizado por tema
  private async getFallbackVerse(theme?: string): Promise<BibleVerse> {
    console.log('🔄 Usando versículos de fallback local...');
    
    const fallbackData = await this.loadFallbackVerses();
    const themes = Object.keys(fallbackData.verses);
    
    let selectedTheme = theme || 'geral';
    
    // Se o tema não existe, escolher um aleatório
    if (!fallbackData.verses[selectedTheme]) {
      selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    }
    
    const verses = fallbackData.verses[selectedTheme];
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    
    console.log('✅ Fallback local funcionou!', randomVerse.reference);
    return randomVerse;
  }

  // Obter versículo do dia com cache baseado na data
  async getDailyVerse(): Promise<BibleVerse> {
    const today = new Date().toDateString();
    
    // Verificar se já temos um versículo para hoje
    if (this.cache.dailyVerse && this.cache.lastUpdateDate === today) {
      console.log('📚 Usando versículo do dia em cache:', this.cache.dailyVerse.reference);
      return this.cache.dailyVerse;
    }
    
    console.log('🔍 Buscando novo versículo do dia para:', today);
    
    // Versículo baseado no dia do mês para garantir variação diária
    const dayOfMonth = new Date().getDate();
    const fallbackData = await this.loadFallbackVerses();
    const allThemes = Object.keys(fallbackData.verses);
    const selectedTheme = allThemes[dayOfMonth % allThemes.length];
    
    console.log(`📅 Tema do dia ${dayOfMonth}: ${selectedTheme}`);
    
    // Tentar APIs externas primeiro
    let verse = await this.tryBibleAPI();
    
    if (!verse) {
      verse = await this.tryGetBible();
    }
    
    // Se todas as APIs falharam, usar fallback temático do dia
    if (!verse) {
      const themesVerses = fallbackData.verses[selectedTheme];
      const verseIndex = dayOfMonth % themesVerses.length;
      verse = themesVerses[verseIndex];
      console.log(`✅ Versículo temático do dia (${selectedTheme}):`, verse.reference);
    }
    
    // Salvar no cache
    this.cache.dailyVerse = verse;
    this.cache.lastUpdateDate = today;
    await this.saveCache();
    
    return verse;
  }

  // Gerar outro versículo (não cachear)
  async getRandomVerse(theme?: string): Promise<BibleVerse> {
    console.log('🎲 Gerando versículo aleatório...');
    
    // Tentar APIs externas primeiro
    let verse = await this.tryBibleAPI();
    
    if (!verse) {
      verse = await this.tryGetBible();
    }
    
    // Se todas as APIs falharam, usar fallback
    if (!verse) {
      verse = await this.getFallbackVerse(theme);
    }
    
    return verse;
  }

  // Obter versículo por tema específico
  async getVerseByTheme(theme: string): Promise<BibleVerse> {
    console.log(`🎯 Buscando versículo para tema: ${theme}`);
    
    // Para temas específicos, primeiro tentar fallback que tem versículos organizados
    const fallbackData = await this.loadFallbackVerses();
    
    if (fallbackData.verses[theme]) {
      const verses = fallbackData.verses[theme];
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      console.log('✅ Versículo temático encontrado:', randomVerse.reference);
      return randomVerse;
    }
    
    // Se não tem o tema específico, tentar APIs externas
    let verse = await this.tryBibleAPI();
    
    if (!verse) {
      verse = await this.tryGetBible();
    }
    
    // Último recurso: fallback geral
    if (!verse) {
      verse = await this.getFallbackVerse();
    }
    
    return verse;
  }
}

// Instância singleton
export const freeBibleAPIService = new FreeBibleAPIService();