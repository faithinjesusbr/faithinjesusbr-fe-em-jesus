import { 
  type User, type InsertUser, 
  type Devotional, type InsertDevotional, 
  type Verse, type InsertVerse, 
  type Prayer, type InsertPrayer,
  type Emotion, type InsertEmotion,
  type EmotionDevotional, type InsertEmotionDevotional,
  type Challenge, type InsertChallenge,
  type ChallengeDay, type InsertChallengeDay,
  type UserChallengeProgress, type InsertUserChallengeProgress,
  type AIPrayerRequest, type InsertAIPrayerRequest,
  type LoveCard, type InsertLoveCard,
  type PrayerRequest, type InsertPrayerRequest,
  type LibraryCategory, type InsertLibraryCategory,
  type LibraryContent, type InsertLibraryContent,
  type DevotionalAudio, type InsertDevotionalAudio,
  type Sponsor, type InsertSponsor,
  type SponsorAd, type InsertSponsorAd
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Devotionals
  getDailyDevotional(date: string): Promise<Devotional | undefined>;
  getAllDevotionals(): Promise<Devotional[]>;
  createDevotional(devotional: InsertDevotional): Promise<Devotional>;
  updateDevotional(id: string, devotional: Partial<Devotional>): Promise<Devotional | undefined>;
  deleteDevotional(id: string): Promise<boolean>;
  
  // Verses
  getAllVerses(): Promise<Verse[]>;
  getRandomVerse(): Promise<Verse | undefined>;
  createVerse(verse: InsertVerse): Promise<Verse>;
  updateVerse(id: string, verse: Partial<Verse>): Promise<Verse | undefined>;
  deleteVerse(id: string): Promise<boolean>;
  
  // Prayers
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  getUserPrayers(userId: string): Promise<Prayer[]>;
  getPrayerStats(): Promise<{ total: number; today: number }>;

  // Emotions
  getAllEmotions(): Promise<Emotion[]>;
  createEmotion(emotion: InsertEmotion): Promise<Emotion>;
  
  // Emotion Devotionals
  getEmotionDevotional(emotionId: string): Promise<EmotionDevotional | undefined>;
  createEmotionDevotional(devotional: InsertEmotionDevotional): Promise<EmotionDevotional>;
  
  // Challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Challenge Days
  getChallengeDays(challengeId: string): Promise<ChallengeDay[]>;
  createChallengeDay(day: InsertChallengeDay): Promise<ChallengeDay>;
  
  // User Challenge Progress
  getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]>;
  updateChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;
  
  // AI Prayer Requests
  createAIPrayerRequest(request: InsertAIPrayerRequest): Promise<AIPrayerRequest>;
  getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]>;
  
  // Love Cards
  getAllLoveCards(): Promise<LoveCard[]>;
  createLoveCard(card: InsertLoveCard): Promise<LoveCard>;
  
  // Prayer Requests
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  getUserPrayerRequests(userId: string): Promise<PrayerRequest[]>;
  updatePrayerRequest(id: string, update: Partial<PrayerRequest>): Promise<PrayerRequest | undefined>;
  
  // Library
  getAllLibraryCategories(): Promise<LibraryCategory[]>;
  createLibraryCategory(category: InsertLibraryCategory): Promise<LibraryCategory>;
  getLibraryContent(categoryId: string): Promise<LibraryContent[]>;
  createLibraryContent(content: InsertLibraryContent): Promise<LibraryContent>;
  
  // Devotional Audios
  getAllDevotionalAudios(): Promise<DevotionalAudio[]>;
  createDevotionalAudio(audio: InsertDevotionalAudio): Promise<DevotionalAudio>;
  
  // Sponsors
  getAllActiveSponsors(): Promise<Sponsor[]>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  
  // Sponsor Ads
  getActiveSponsorAds(): Promise<SponsorAd[]>;
  createSponsorAd(ad: InsertSponsorAd): Promise<SponsorAd>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private devotionals: Map<string, Devotional>;
  private verses: Map<string, Verse>;
  private prayers: Map<string, Prayer>;
  private emotions: Map<string, Emotion>;
  private emotionDevotionals: Map<string, EmotionDevotional>;
  private challenges: Map<string, Challenge>;
  private challengeDays: Map<string, ChallengeDay>;
  private userChallengeProgress: Map<string, UserChallengeProgress>;
  private aiPrayerRequests: Map<string, AIPrayerRequest>;
  private loveCards: Map<string, LoveCard>;
  private prayerRequests: Map<string, PrayerRequest>;
  private libraryCategories: Map<string, LibraryCategory>;
  private libraryContent: Map<string, LibraryContent>;
  private devotionalAudios: Map<string, DevotionalAudio>;
  private sponsors: Map<string, Sponsor>;
  private sponsorAds: Map<string, SponsorAd>;

  constructor() {
    this.users = new Map();
    this.devotionals = new Map();
    this.verses = new Map();
    this.prayers = new Map();
    this.emotions = new Map();
    this.emotionDevotionals = new Map();
    this.challenges = new Map();
    this.challengeDays = new Map();
    this.userChallengeProgress = new Map();
    this.aiPrayerRequests = new Map();
    this.loveCards = new Map();
    this.prayerRequests = new Map();
    this.libraryCategories = new Map();
    this.libraryContent = new Map();
    this.devotionalAudios = new Map();
    this.sponsors = new Map();
    this.sponsorAds = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      name: "Administrador",
      email: "admin@fejosebr.com",
      password: "admin123", // In production, this should be hashed
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Create sample devotional
    const devotionalId = randomUUID();
    const today = new Date().toISOString().split('T')[0];
    const devotional: Devotional = {
      id: devotionalId,
      title: "Caminhando na Fé",
      content: "Hoje somos lembrados de que a fé não é apenas crer, mas também agir. Quando confiamos em Deus, nossas ações refletem essa confiança. Que possamos dar passos corajosos, sabendo que Ele nos guia em cada momento de nossa jornada.",
      verse: "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que não se veem.",
      reference: "Hebreus 11:1",
      date: today,
      createdAt: new Date(),
    };
    this.devotionals.set(devotionalId, devotional);

    // Create sample verses
    const verses = [
      {
        text: "Porque eu sei que o meu Redentor vive, e por fim se levantará sobre a terra.",
        reference: "Jó 19:25",
        book: "Jó",
        chapter: "19",
        verse: "25"
      },
      {
        text: "Tudo posso naquele que me fortalece.",
        reference: "Filipenses 4:13",
        book: "Filipenses",
        chapter: "4",
        verse: "13"
      },
      {
        text: "O Senhor é meu pastor; nada me faltará.",
        reference: "Salmos 23:1",
        book: "Salmos",
        chapter: "23",
        verse: "1"
      },
      {
        text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
        reference: "Romanos 8:28",
        book: "Romanos",
        chapter: "8",
        verse: "28"
      },
      {
        text: "Não andeis ansiosos por coisa alguma; antes, em tudo, pela oração e súplicas, com ação de graças, sejam as vossas petições conhecidas diante de Deus.",
        reference: "Filipenses 4:6",
        book: "Filipenses",
        chapter: "4",
        verse: "6"
      }
    ];

    verses.forEach(verseData => {
      const verseId = randomUUID();
      const verse: Verse = {
        id: verseId,
        ...verseData,
      };
      this.verses.set(verseId, verse);
    });

    // Create sample emotions
    const emotionsData = [
      { name: "Ansioso", description: "Quando o coração está inquieto", color: "text-orange-600", icon: "Zap" },
      { name: "Triste", description: "Momentos de melancolia", color: "text-blue-600", icon: "CloudRain" },
      { name: "Agradecido", description: "Coração cheio de gratidão", color: "text-green-600", icon: "Heart" },
      { name: "Com Medo", description: "Quando o temor toma conta", color: "text-red-600", icon: "Shield" },
      { name: "Esperançoso", description: "Olhando para o futuro com fé", color: "text-purple-600", icon: "Sun" },
      { name: "Solitário", description: "Sentindo-se isolado", color: "text-gray-600", icon: "User" }
    ];

    emotionsData.forEach(emotionData => {
      const emotionId = randomUUID();
      const emotion: Emotion = {
        id: emotionId,
        ...emotionData,
      };
      this.emotions.set(emotionId, emotion);
    });

    // Create sample challenges
    const challenge7Id = randomUUID();
    const challenge7: Challenge = {
      id: challenge7Id,
      title: "7 Dias com Jesus",
      description: "Uma jornada de uma semana para fortalecer sua fé",
      duration: "7",
      imageUrl: null,
      createdAt: new Date(),
    };
    this.challenges.set(challenge7Id, challenge7);

    const challenge21Id = randomUUID();
    const challenge21: Challenge = {
      id: challenge21Id,
      title: "21 Dias de Transformação",
      description: "Três semanas para renovar sua mente e espírito",
      duration: "21",
      imageUrl: null,
      createdAt: new Date(),
    };
    this.challenges.set(challenge21Id, challenge21);

    // Create sample love cards
    const loveCardsData = [
      {
        title: "Amor Incondicional",
        message: "Jesus te ama exatamente como você é. Seu amor não tem condições nem limites.",
        verse: "Mas Deus prova o seu próprio amor para conosco pelo fato de ter Cristo morrido por nós, sendo nós ainda pecadores.",
        reference: "Romanos 5:8",
        backgroundColor: "bg-gradient-to-br from-pink-400 to-rose-600",
        textColor: "text-white"
      },
      {
        title: "Paz que Excede",
        message: "Em meio às tempestades da vida, a paz de Cristo habita em seu coração.",
        verse: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.",
        reference: "João 14:27",
        backgroundColor: "bg-gradient-to-br from-blue-400 to-indigo-600",
        textColor: "text-white"
      },
      {
        title: "Força Renovada",
        message: "Quando suas forças se esgotam, Deus renova sua energia e esperança.",
        verse: "Mas os que esperam no Senhor renovam as suas forças.",
        reference: "Isaías 40:31",
        backgroundColor: "bg-gradient-to-br from-green-400 to-emerald-600",
        textColor: "text-white"
      }
    ];

    loveCardsData.forEach(cardData => {
      const cardId = randomUUID();
      const card: LoveCard = {
        id: cardId,
        ...cardData,
        imageUrl: null,
      };
      this.loveCards.set(cardId, card);
    });

    // Create sample library categories
    const categoriesData = [
      { name: "Cura Interior", description: "Conteúdos para restauração emocional e espiritual", icon: "Heart", color: "text-rose-600" },
      { name: "Propósito", description: "Descobrindo o plano de Deus para sua vida", icon: "Target", color: "text-blue-600" },
      { name: "Relacionamento com Deus", description: "Fortalecendo sua intimidade com o Criador", icon: "Users", color: "text-green-600" }
    ];

    categoriesData.forEach(categoryData => {
      const categoryId = randomUUID();
      const category: LibraryCategory = {
        id: categoryId,
        ...categoryData,
      };
      this.libraryCategories.set(categoryId, category);
    });

    // Create sample devotional audios
    const audiosData = [
      {
        title: "Oração da Manhã",
        description: "Comece o dia conectado com Deus",
        audioUrl: "https://example.com/audio1.mp3",
        duration: "5:30"
      },
      {
        title: "Reflexão Noturna",
        description: "Termine o dia em paz com o Senhor",
        audioUrl: "https://example.com/audio2.mp3",
        duration: "8:15"
      }
    ];

    audiosData.forEach(audioData => {
      const audioId = randomUUID();
      const audio: DevotionalAudio = {
        id: audioId,
        ...audioData,
        createdAt: new Date(),
      };
      this.devotionalAudios.set(audioId, audio);
    });

    // Create sample sponsor
    const sponsorId = randomUUID();
    const sponsor: Sponsor = {
      id: sponsorId,
      name: "Livraria Cristã Esperança",
      description: "Livros que transformam vidas e fortalecem a fé",
      logoUrl: "https://example.com/logo.png",
      website: "https://example.com",
      instagram: "@livrariaesperanca",
      facebook: "LivrariaEsperanca",
      whatsapp: "5511999999999",
      isActive: true,
      createdAt: new Date(),
    };
    this.sponsors.set(sponsorId, sponsor);

    // Create sample sponsor ad
    const adId = randomUUID();
    const ad: SponsorAd = {
      id: adId,
      sponsorId: sponsorId,
      title: "Livros Cristãos com 20% OFF",
      message: "Fortaleça sua fé com nossa seleção especial de livros cristãos!",
      imageUrl: null,
      isActive: true,
      priority: "medium",
      createdAt: new Date(),
    };
    this.sponsorAds.set(adId, ad);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Devotional methods
  async getDailyDevotional(date: string): Promise<Devotional | undefined> {
    return Array.from(this.devotionals.values()).find(d => d.date === date);
  }

  async getAllDevotionals(): Promise<Devotional[]> {
    return Array.from(this.devotionals.values());
  }

  async createDevotional(insertDevotional: InsertDevotional): Promise<Devotional> {
    const id = randomUUID();
    const devotional: Devotional = {
      ...insertDevotional,
      id,
      createdAt: new Date(),
    };
    this.devotionals.set(id, devotional);
    return devotional;
  }

  async updateDevotional(id: string, updateData: Partial<Devotional>): Promise<Devotional | undefined> {
    const devotional = this.devotionals.get(id);
    if (!devotional) return undefined;
    
    const updatedDevotional = { ...devotional, ...updateData };
    this.devotionals.set(id, updatedDevotional);
    return updatedDevotional;
  }

  async deleteDevotional(id: string): Promise<boolean> {
    return this.devotionals.delete(id);
  }

  // Verse methods
  async getAllVerses(): Promise<Verse[]> {
    return Array.from(this.verses.values());
  }

  async getRandomVerse(): Promise<Verse | undefined> {
    const verses = Array.from(this.verses.values());
    if (verses.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * verses.length);
    return verses[randomIndex];
  }

  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const id = randomUUID();
    const verse: Verse = {
      ...insertVerse,
      id,
    };
    this.verses.set(id, verse);
    return verse;
  }

  async updateVerse(id: string, updateData: Partial<Verse>): Promise<Verse | undefined> {
    const verse = this.verses.get(id);
    if (!verse) return undefined;
    
    const updatedVerse = { ...verse, ...updateData };
    this.verses.set(id, updatedVerse);
    return updatedVerse;
  }

  async deleteVerse(id: string): Promise<boolean> {
    return this.verses.delete(id);
  }

  // Prayer methods
  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = randomUUID();
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      createdAt: new Date(),
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return Array.from(this.prayers.values()).filter(p => p.userId === userId);
  }

  async getPrayerStats(): Promise<{ total: number; today: number }> {
    const total = this.prayers.size;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = Array.from(this.prayers.values()).filter(p => 
      p.createdAt && p.createdAt.toISOString().split('T')[0] === today
    ).length;
    
    return { total, today: todayCount };
  }

  // Emotion methods
  async getAllEmotions(): Promise<Emotion[]> {
    return Array.from(this.emotions.values());
  }

  async createEmotion(insertEmotion: InsertEmotion): Promise<Emotion> {
    const id = randomUUID();
    const emotion: Emotion = {
      ...insertEmotion,
      id,
    };
    this.emotions.set(id, emotion);
    return emotion;
  }

  // Emotion Devotional methods
  async getEmotionDevotional(emotionId: string): Promise<EmotionDevotional | undefined> {
    return Array.from(this.emotionDevotionals.values()).find(d => d.emotionId === emotionId);
  }

  async createEmotionDevotional(insertDevotional: InsertEmotionDevotional): Promise<EmotionDevotional> {
    const id = randomUUID();
    const devotional: EmotionDevotional = {
      ...insertDevotional,
      id,
      createdAt: new Date(),
    };
    this.emotionDevotionals.set(id, devotional);
    return devotional;
  }

  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      ...insertChallenge,
      id,
      createdAt: new Date(),
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  // Challenge Day methods
  async getChallengeDays(challengeId: string): Promise<ChallengeDay[]> {
    return Array.from(this.challengeDays.values()).filter(d => d.challengeId === challengeId);
  }

  async createChallengeDay(insertDay: InsertChallengeDay): Promise<ChallengeDay> {
    const id = randomUUID();
    const day: ChallengeDay = {
      ...insertDay,
      id,
    };
    this.challengeDays.set(id, day);
    return day;
  }

  // User Challenge Progress methods
  async getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]> {
    return Array.from(this.userChallengeProgress.values()).filter(p => 
      p.userId === userId && p.challengeId === challengeId
    );
  }

  async updateChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const id = randomUUID();
    const progress: UserChallengeProgress = {
      ...insertProgress,
      id,
      completedAt: insertProgress.completed ? new Date() : null,
    };
    this.userChallengeProgress.set(id, progress);
    return progress;
  }

  // AI Prayer Request methods
  async createAIPrayerRequest(insertRequest: InsertAIPrayerRequest): Promise<AIPrayerRequest> {
    const id = randomUUID();
    const request: AIPrayerRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.aiPrayerRequests.set(id, request);
    return request;
  }

  async getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]> {
    return Array.from(this.aiPrayerRequests.values()).filter(r => r.userId === userId);
  }

  // Love Card methods
  async getAllLoveCards(): Promise<LoveCard[]> {
    return Array.from(this.loveCards.values());
  }

  async createLoveCard(insertCard: InsertLoveCard): Promise<LoveCard> {
    const id = randomUUID();
    const card: LoveCard = {
      ...insertCard,
      id,
    };
    this.loveCards.set(id, card);
    return card;
  }

  // Prayer Request methods
  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const id = randomUUID();
    const request: PrayerRequest = {
      ...insertRequest,
      id,
      status: "pending",
      aiResponse: null,
      respondedAt: null,
      createdAt: new Date(),
    };
    this.prayerRequests.set(id, request);
    return request;
  }

  async getUserPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    return Array.from(this.prayerRequests.values()).filter(r => r.userId === userId);
  }

  async updatePrayerRequest(id: string, updateData: Partial<PrayerRequest>): Promise<PrayerRequest | undefined> {
    const request = this.prayerRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updateData };
    this.prayerRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Library methods
  async getAllLibraryCategories(): Promise<LibraryCategory[]> {
    return Array.from(this.libraryCategories.values());
  }

  async createLibraryCategory(insertCategory: InsertLibraryCategory): Promise<LibraryCategory> {
    const id = randomUUID();
    const category: LibraryCategory = {
      ...insertCategory,
      id,
    };
    this.libraryCategories.set(id, category);
    return category;
  }

  async getLibraryContent(categoryId: string): Promise<LibraryContent[]> {
    return Array.from(this.libraryContent.values()).filter(c => c.categoryId === categoryId);
  }

  async createLibraryContent(insertContent: InsertLibraryContent): Promise<LibraryContent> {
    const id = randomUUID();
    const content: LibraryContent = {
      ...insertContent,
      id,
    };
    this.libraryContent.set(id, content);
    return content;
  }

  // Devotional Audio methods
  async getAllDevotionalAudios(): Promise<DevotionalAudio[]> {
    return Array.from(this.devotionalAudios.values());
  }

  async createDevotionalAudio(insertAudio: InsertDevotionalAudio): Promise<DevotionalAudio> {
    const id = randomUUID();
    const audio: DevotionalAudio = {
      ...insertAudio,
      id,
      createdAt: new Date(),
    };
    this.devotionalAudios.set(id, audio);
    return audio;
  }

  // Sponsor methods
  async getAllActiveSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values()).filter(s => s.isActive);
  }

  async createSponsor(insertSponsor: InsertSponsor): Promise<Sponsor> {
    const id = randomUUID();
    const sponsor: Sponsor = {
      ...insertSponsor,
      id,
      createdAt: new Date(),
    };
    this.sponsors.set(id, sponsor);
    return sponsor;
  }

  // Sponsor Ad methods
  async getActiveSponsorAds(): Promise<SponsorAd[]> {
    return Array.from(this.sponsorAds.values()).filter(a => a.isActive);
  }

  async createSponsorAd(insertAd: InsertSponsorAd): Promise<SponsorAd> {
    const id = randomUUID();
    const ad: SponsorAd = {
      ...insertAd,
      id,
      createdAt: new Date(),
    };
    this.sponsorAds.set(id, ad);
    return ad;
  }
}

export const storage = new MemStorage();

// Initialize sample data
const initializeSampleData = () => {
  // Sample emotions
  const emotions = [
    { name: "Alegria", description: "Quando seu coração está cheio de gratidão", color: "text-yellow-600", icon: "Heart" },
    { name: "Tristeza", description: "Momentos de dor e melancolia", color: "text-blue-600", icon: "Heart" },
    { name: "Ansiedade", description: "Preocupações sobre o futuro", color: "text-purple-600", icon: "Heart" },
    { name: "Gratidão", description: "Reconhecendo as bênçãos de Deus", color: "text-green-600", icon: "Heart" },
    { name: "Perdão", description: "Libertando mágoas do coração", color: "text-indigo-600", icon: "Heart" },
    { name: "Esperança", description: "Confiança no plano de Deus", color: "text-emerald-600", icon: "Heart" }
  ];

  emotions.forEach(emotion => {
    storage.createEmotion(emotion);
  });

  // Sample challenges
  storage.createChallenge({
    title: "7 Dias de Oração",
    description: "Fortaleça sua vida de oração em uma semana",
    duration: "7"
  });

  storage.createChallenge({
    title: "21 Dias de Fé",
    description: "Jornada de crescimento espiritual profundo",
    duration: "21"
  });

  // Sample love cards
  const loveCards = [
    {
      title: "Jesus te Ama",
      message: "Não importa o que você tenha feito ou deixado de fazer, Jesus te ama incondicionalmente. Seu amor é eterno e nunca muda.",
      verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito",
      reference: "João 3:16",
      backgroundColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      textColor: "text-white"
    },
    {
      title: "Você é Especial",
      message: "Deus criou você de forma única e maravilhosa. Você tem propósito e valor inestimável aos olhos do Criador.",
      verse: "Pois tu formaste o meu interior, tu me teceste no ventre de minha mãe",
      reference: "Salmos 139:13",
      backgroundColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
      textColor: "text-white"
    },
    {
      title: "Nunca Desista",
      message: "Mesmo nos momentos mais difíceis, Deus está com você. Ele tem planos de bem para sua vida e nunca te abandonará.",
      verse: "Pois eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor",
      reference: "Jeremias 29:11",
      backgroundColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
      textColor: "text-white"
    }
  ];

  loveCards.forEach(card => {
    storage.createLoveCard(card);
  });

  // Sample library categories
  storage.createLibraryCategory({
    name: "Crescimento Espiritual",
    description: "Conteúdos para fortalecer sua fé",
    icon: "Heart",
    color: "text-green-600"
  });

  storage.createLibraryCategory({
    name: "Vida Cristã",
    description: "Orientações para o dia a dia",
    icon: "Target",
    color: "text-blue-600"
  });

  storage.createLibraryCategory({
    name: "Relacionamentos",
    description: "Construindo relacionamentos saudáveis",
    icon: "Users",
    color: "text-purple-600"
  });

  // Sample devotional audios
  storage.createDevotionalAudio({
    title: "Oração da Manhã",
    description: "Comece seu dia com uma oração poderosa",
    audioUrl: "https://example.com/morning-prayer.mp3",
    duration: "5:30"
  });

  storage.createDevotionalAudio({
    title: "Reflexão Noturna",
    description: "Termine o dia em comunhão com Deus",
    audioUrl: "https://example.com/night-reflection.mp3",
    duration: "8:15"
  });

  // Sample sponsors
  storage.createSponsor({
    name: "Livraria Cristã Esperança",
    description: "Livros que transformam vidas",
    website: "https://example.com",
    contactEmail: "contato@esperanca.com",
    isActive: true
  });

  // Sample sponsor ads
  storage.createSponsorAd({
    title: "Bíblia de Estudo Completa",
    description: "Aprofunde seus estudos bíblicos",
    imageUrl: "https://example.com/bible-study.jpg",
    url: "https://example.com/bible",
    isActive: true
  });

  storage.createSponsorAd({
    title: "Curso de Teologia Online",
    description: "Estude teologia no seu ritmo",
    imageUrl: "https://example.com/theology-course.jpg",
    url: "https://example.com/course",
    isActive: true
  });

  storage.createSponsorAd({
    title: "Retiro Espiritual",
    description: "Renovação e crescimento espiritual",
    imageUrl: "https://example.com/retreat.jpg",
    url: "https://example.com/retreat",
    isActive: true
  });
};

// Initialize sample data
initializeSampleData();
