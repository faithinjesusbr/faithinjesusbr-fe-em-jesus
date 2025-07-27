import { type User, type InsertUser, type Devotional, type InsertDevotional, type Verse, type InsertVerse, type Prayer, type InsertPrayer } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private devotionals: Map<string, Devotional>;
  private verses: Map<string, Verse>;
  private prayers: Map<string, Prayer>;

  constructor() {
    this.users = new Map();
    this.devotionals = new Map();
    this.verses = new Map();
    this.prayers = new Map();
    
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
}

export const storage = new MemStorage();
