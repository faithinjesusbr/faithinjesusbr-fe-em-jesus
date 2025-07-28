// Free Bible Service - Using multiple free Bible APIs

export interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

// Extended Portuguese Bible verses as primary fallback
const PORTUGUESE_VERSES: BibleVerse[] = [
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
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    book: "Mateus",
    chapter: 11,
    verse: 28
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1",
    book: "Salmos",
    chapter: 23,
    verse: 1
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
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11",
    book: "Jeremias",
    chapter: 29,
    verse: 11
  },
  {
    text: "A palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes.",
    reference: "Hebreus 4:12",
    book: "Hebreus",
    chapter: 4,
    verse: 12
  },
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    reference: "Salmos 37:5",
    book: "Salmos",
    chapter: 37,
    verse: 5
  },
  {
    text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.",
    reference: "Isaías 40:31",
    book: "Isaías",
    chapter: 40,
    verse: 31
  },
  {
    text: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.",
    reference: "Mateus 18:20",
    book: "Mateus",
    chapter: 18,
    verse: 20
  },
  {
    text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos.",
    reference: "Filipenses 4:7",
    book: "Filipenses",
    chapter: 4,
    verse: 7
  },
  {
    text: "Buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.",
    reference: "Mateus 6:33",
    book: "Mateus",
    chapter: 6,
    verse: 33
  },
  {
    text: "Em ti confiam os que conhecem o teu nome, porque tu, Senhor, nunca desamparaste os que te buscam.",
    reference: "Salmos 9:10",
    book: "Salmos",
    chapter: 9,
    verse: 10
  },
  {
    text: "Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes que não sabes.",
    reference: "Jeremias 33:3",
    book: "Jeremias",
    chapter: 33,
    verse: 3
  },
  {
    text: "O amor nunca falha; mas havendo profecias, serão aniquiladas; havendo línguas, cessarão.",
    reference: "1 Coríntios 13:8",
    book: "1 Coríntios",
    chapter: 13,
    verse: 8
  },
  {
    text: "Sede fortes e corajosos; não temais nem vos espanteis, porque o Senhor vosso Deus é convosco.",
    reference: "Josué 1:9",
    book: "Josué",
    chapter: 1,
    verse: 9
  },
  {
    text: "Grande é a nossa aflição, mas a misericórdia do Senhor não tem fim; as suas misericórdias são novas cada manhã.",
    reference: "Lamentações 3:22-23",
    book: "Lamentações",
    chapter: 3,
    verse: 22
  },
  {
    text: "Aquietai-vos, e sabei que eu sou Deus; serei exaltado entre os gentios; serei exaltado sobre a terra.",
    reference: "Salmos 46:10",
    book: "Salmos",
    chapter: 46,
    verse: 10
  }
];

// Bible-API.com (Free, no auth required)
async function fetchFromBibleAPI(): Promise<BibleVerse | null> {
  try {
    const randomVerse = PORTUGUESE_VERSES[Math.floor(Math.random() * PORTUGUESE_VERSES.length)];
    const response = await fetch(`https://bible-api.com/${randomVerse.reference}?translation=almeida`);
    
    if (response.ok) {
      const data: any = await response.json();
      if (data && data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference,
          book: data.book_name || randomVerse.book,
          chapter: data.chapter || randomVerse.chapter,
          verse: data.verse || randomVerse.verse
        };
      }
    }
  } catch (error: any) {
    console.log('Bible-API não disponível:', error.message);
  }
  return null;
}

// GetBible.net (Free, no auth required)
async function fetchFromGetBible(): Promise<BibleVerse | null> {
  try {
    const response = await fetch('https://getbible.net/v2/almeida/verses/random.json');
    
    if (response.ok) {
      const data: any = await response.json();
      if (data && data.text) {
        return {
          text: data.text.trim(),
          reference: `${data.book_name} ${data.chapter}:${data.verse}`,
          book: data.book_name,
          chapter: parseInt(data.chapter),
          verse: parseInt(data.verse)
        };
      }
    }
  } catch (error: any) {
    console.log('GetBible API não disponível:', error.message);
  }
  return null;
}

// Daily verse with date-based selection to avoid repetition
export function getDailyVerse(): BibleVerse {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % PORTUGUESE_VERSES.length;
  return PORTUGUESE_VERSES[index];
}

// Get random verse from multiple sources
export async function getRandomVerse(): Promise<BibleVerse> {
  // Try free APIs first
  let verse = await fetchFromBibleAPI();
  if (!verse) {
    verse = await fetchFromGetBible();
  }
  
  // Fallback to local Portuguese verses
  if (!verse) {
    const randomIndex = Math.floor(Math.random() * PORTUGUESE_VERSES.length);
    verse = PORTUGUESE_VERSES[randomIndex];
  }
  
  return verse;
}

// Get new random verse (different from current)
export async function getNewRandomVerse(currentReference?: string): Promise<BibleVerse> {
  let attempts = 0;
  let verse: BibleVerse;
  
  do {
    verse = await getRandomVerse();
    attempts++;
  } while (verse.reference === currentReference && attempts < 5);
  
  return verse;
}

// Verse by specific reference
export async function getVerseByReference(reference: string): Promise<BibleVerse | null> {
  // Try to find in local verses first
  const localVerse = PORTUGUESE_VERSES.find(v => 
    v.reference.toLowerCase() === reference.toLowerCase()
  );
  
  if (localVerse) {
    return localVerse;
  }
  
  // Try external APIs
  try {
    const response = await fetch(`https://bible-api.com/${reference}?translation=almeida`);
    
    if (response.ok) {
      const data: any = await response.json();
      if (data && data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference,
          book: data.book_name,
          chapter: data.chapter,
          verse: data.verse
        };
      }
    }
  } catch (error: any) {
    console.log('Erro ao buscar versículo específico:', error.message);
  }
  
  return null;
}

// Service class for compatibility
export class FreeBibleService {
  async getDailyVerse(): Promise<BibleVerse> {
    return getDailyVerse();
  }
  
  async getRandomVerse(): Promise<BibleVerse> {
    return getRandomVerse();
  }
  
  async getNewRandomVerse(currentReference?: string): Promise<BibleVerse> {
    return getNewRandomVerse(currentReference);
  }
  
  async getVerseByReference(reference: string): Promise<BibleVerse | null> {
    return getVerseByReference(reference);
  }
}

export const freeBibleService = new FreeBibleService();