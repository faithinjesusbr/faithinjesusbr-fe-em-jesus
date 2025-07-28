import { eq, desc, and, or, asc } from "drizzle-orm";
import { db } from "./db";
import {
  users, devotionals, verses, prayers, emotions, emotionDevotionals,
  challenges, challengeDays, userChallengeProgress, aiPrayerRequests,
  prayerRequests, loveCards, libraryCategories, libraryContent,
  devotionalAudios, sponsors, sponsorAds, storeProducts, youtubeVideos,
  notifications, userInteractions, contributors, pointsTransactions,
  spiritualPlannerEntries, userDevotionals, verseReactions,
  type User, type InsertUser, type Devotional, type InsertDevotional,
  type Verse, type InsertVerse, type Prayer, type InsertPrayer,
  type Emotion, type InsertEmotion, type EmotionDevotional, type InsertEmotionDevotional,
  type Challenge, type InsertChallenge, type ChallengeDay, type InsertChallengeDay,
  type UserChallengeProgress, type InsertUserChallengeProgress,
  type AIPrayerRequest, type InsertAIPrayerRequest, type PrayerRequest, type InsertPrayerRequest,
  type LoveCard, type InsertLoveCard, type LibraryCategory, type InsertLibraryCategory,
  type LibraryContent, type InsertLibraryContent, type DevotionalAudio, type InsertDevotionalAudio,
  type Sponsor, type InsertSponsor, type SponsorAd, type InsertSponsorAd,
  type StoreProduct, type InsertStoreProduct, type YoutubeVideo, type InsertYoutubeVideo,
  type Notification, type InsertNotification, type UserInteraction, type InsertUserInteraction,
  type Contributor, type InsertContributor, type PointsTransaction, type InsertPointsTransaction,
  type SpiritualPlannerEntry, type InsertSpiritualPlannerEntry,
  type UserDevotional, type InsertUserDevotional, type VerseReaction, type InsertVerseReaction
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: string, updateData: Partial<User>): Promise<User | undefined>;

  // Devotionals
  getDailyDevotional(date: string): Promise<Devotional | undefined>;
  getAllDevotionals(): Promise<Devotional[]>;
  createDevotional(insertDevotional: InsertDevotional): Promise<Devotional>;

  // Verses
  getAllVerses(): Promise<Verse[]>;
  getRandomVerse(): Promise<Verse | undefined>;
  createVerse(insertVerse: InsertVerse): Promise<Verse>;

  // Prayers
  getAllPrayers(): Promise<Prayer[]>;
  getUserPrayers(userId: string): Promise<Prayer[]>;
  createPrayer(insertPrayer: InsertPrayer): Promise<Prayer>;

  // Emotions
  getAllEmotions(): Promise<Emotion[]>;
  createEmotion(insertEmotion: InsertEmotion): Promise<Emotion>;
  getEmotionDevotionals(emotion: string): Promise<EmotionDevotional[]>;
  createEmotionDevotional(insertEmotionDevotional: InsertEmotionDevotional): Promise<EmotionDevotional>;

  // Challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengeDays(challengeId: string): Promise<ChallengeDay[]>;
  getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]>;
  createChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;

  // AI Prayer
  getAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]>;
  createAIPrayerRequest(insertRequest: InsertAIPrayerRequest): Promise<AIPrayerRequest>;

  // Prayer Requests
  getAllPrayerRequests(): Promise<PrayerRequest[]>;
  createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest>;

  // Love Cards
  getLoveCards(category?: string): Promise<LoveCard[]>;
  createLoveCard(insertCard: InsertLoveCard): Promise<LoveCard>;

  // Library
  getAllLibraryCategories(): Promise<LibraryCategory[]>;
  getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]>;

  // Audio Devotionals
  getDevotionalAudios(): Promise<DevotionalAudio[]>;

  // Sponsors
  getAllSponsors(): Promise<Sponsor[]>;
  getActiveSponsors(): Promise<Sponsor[]>;
  getSponsorAds(): Promise<SponsorAd[]>;

  // Store
  getStoreProducts(category?: string, featured?: boolean): Promise<StoreProduct[]>;

  // YouTube
  getYoutubeVideos(category?: string, featured?: boolean): Promise<YoutubeVideo[]>;

  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(insertNotification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;

  // User Interactions
  createUserInteraction(insertInteraction: InsertUserInteraction): Promise<UserInteraction>;

  // Contributors
  getAllContributors(): Promise<Contributor[]>;
  createContributor(insertContributor: InsertContributor): Promise<Contributor>;

  // Points System
  getUserPoints(userId: string): Promise<{ total: number; transactions: PointsTransaction[] }>;
  addPoints(userId: string, points: number, description: string): Promise<PointsTransaction>;

  // Spiritual Planner
  getSpiritualPlannerEntries(userId: string, date: string): Promise<SpiritualPlannerEntry[]>;
  createOrUpdateSpiritualPlannerEntry(entry: InsertSpiritualPlannerEntry): Promise<SpiritualPlannerEntry>;

  // User Devotionals
  createUserDevotional(devotional: InsertUserDevotional): Promise<UserDevotional>;
  getUserDevotionals(userId: string): Promise<UserDevotional[]>;
  getUserDevotionalByDate(userId: string, date: string): Promise<UserDevotional | undefined>;

  // Verse Reactions
  createVerseReaction(reaction: InsertVerseReaction): Promise<VerseReaction>;
  getUserVerseReaction(userId: string, verseId: string): Promise<VerseReaction | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  // Devotionals
  async getDailyDevotional(date: string): Promise<Devotional | undefined> {
    const [devotional] = await db.select().from(devotionals).where(eq(devotionals.date, date));
    return devotional;
  }

  async getAllDevotionals(): Promise<Devotional[]> {
    return await db.select().from(devotionals).orderBy(desc(devotionals.createdAt));
  }

  async createDevotional(insertDevotional: InsertDevotional): Promise<Devotional> {
    const [devotional] = await db.insert(devotionals).values(insertDevotional).returning();
    return devotional;
  }

  // Verses
  async getAllVerses(): Promise<Verse[]> {
    return await db.select().from(verses).orderBy(asc(verses.book), asc(verses.chapter), asc(verses.verse));
  }

  async getRandomVerse(): Promise<Verse | undefined> {
    const allVerses = await this.getAllVerses();
    if (allVerses.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * allVerses.length);
    return allVerses[randomIndex];
  }

  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const [verse] = await db.insert(verses).values(insertVerse).returning();
    return verse;
  }

  // Prayers
  async getAllPrayers(): Promise<Prayer[]> {
    return await db.select().from(prayers).orderBy(desc(prayers.createdAt));
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return await db.select().from(prayers)
      .where(eq(prayers.userId, userId))
      .orderBy(desc(prayers.createdAt));
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const [prayer] = await db.insert(prayers).values(insertPrayer).returning();
    return prayer;
  }

  // Emotions
  async getAllEmotions(): Promise<Emotion[]> {
    return await db.select().from(emotions);
  }

  async createEmotion(insertEmotion: InsertEmotion): Promise<Emotion> {
    const [emotion] = await db.insert(emotions).values(insertEmotion).returning();
    return emotion;
  }

  async getEmotionDevotionals(emotion: string): Promise<EmotionDevotional[]> {
    return await db.select().from(emotionDevotionals)
      .where(eq(emotionDevotionals.emotion, emotion))
      .orderBy(desc(emotionDevotionals.createdAt));
  }

  async createEmotionDevotional(insertEmotionDevotional: InsertEmotionDevotional): Promise<EmotionDevotional> {
    const [devotional] = await db.insert(emotionDevotionals).values(insertEmotionDevotional).returning();
    return devotional;
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(asc(challenges.order));
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getChallengeDays(challengeId: string): Promise<ChallengeDay[]> {
    return await db.select().from(challengeDays)
      .where(eq(challengeDays.challengeId, challengeId))
      .orderBy(asc(challengeDays.dayNumber));
  }

  async getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]> {
    return await db.select().from(userChallengeProgress)
      .where(and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId)
      ));
  }

  async createChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const [progress] = await db.insert(userChallengeProgress).values(insertProgress).returning();
    return progress;
  }

  // AI Prayer
  async getAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]> {
    return await db.select().from(aiPrayerRequests)
      .where(eq(aiPrayerRequests.userId, userId))
      .orderBy(desc(aiPrayerRequests.createdAt));
  }

  async createAIPrayerRequest(insertRequest: InsertAIPrayerRequest): Promise<AIPrayerRequest> {
    const [request] = await db.insert(aiPrayerRequests).values(insertRequest).returning();
    return request;
  }

  // Prayer Requests
  async getAllPrayerRequests(): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  // Love Cards
  async getLoveCards(category?: string): Promise<LoveCard[]> {
    if (category) {
      return await db.select().from(loveCards)
        .where(eq(loveCards.category, category))
        .orderBy(desc(loveCards.createdAt));
    }
    return await db.select().from(loveCards).orderBy(desc(loveCards.createdAt));
  }

  async createLoveCard(insertCard: InsertLoveCard): Promise<LoveCard> {
    const [card] = await db.insert(loveCards).values(insertCard).returning();
    return card;
  }

  // Library
  async getAllLibraryCategories(): Promise<LibraryCategory[]> {
    return await db.select().from(libraryCategories).orderBy(asc(libraryCategories.order));
  }

  async getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]> {
    return await db.select().from(libraryContent)
      .where(eq(libraryContent.categoryId, categoryId))
      .orderBy(desc(libraryContent.createdAt));
  }

  // Audio Devotionals
  async getDevotionalAudios(): Promise<DevotionalAudio[]> {
    return await db.select().from(devotionalAudios).orderBy(desc(devotionalAudios.createdAt));
  }

  // Sponsors
  async getAllSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).orderBy(desc(sponsors.createdAt));
  }

  async getActiveSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors)
      .where(eq(sponsors.isActive, true))
      .orderBy(desc(sponsors.createdAt));
  }

  async getSponsorAds(): Promise<SponsorAd[]> {
    return await db.select().from(sponsorAds)
      .where(eq(sponsorAds.isActive, true))
      .orderBy(desc(sponsorAds.createdAt));
  }

  // Store
  async getStoreProducts(category?: string, featured?: boolean): Promise<StoreProduct[]> {
    let query = db.select().from(storeProducts).where(eq(storeProducts.isActive, true));
    
    if (category) {
      query = query.where(eq(storeProducts.category, category));
    }
    
    if (featured) {
      query = query.where(eq(storeProducts.featured, true));
    }
    
    return await query.orderBy(desc(storeProducts.createdAt));
  }

  // YouTube
  async getYoutubeVideos(category?: string, featured?: boolean): Promise<YoutubeVideo[]> {
    let query = db.select().from(youtubeVideos).where(eq(youtubeVideos.isActive, true));
    
    if (category) {
      query = query.where(eq(youtubeVideos.category, category));
    }
    
    if (featured) {
      query = query.where(eq(youtubeVideos.featured, true));
    }
    
    return await query.orderBy(desc(youtubeVideos.publishedAt));
  }

  // Notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // User Interactions
  async createUserInteraction(insertInteraction: InsertUserInteraction): Promise<UserInteraction> {
    const [interaction] = await db.insert(userInteractions).values(insertInteraction).returning();
    return interaction;
  }

  // Contributors
  async getAllContributors(): Promise<Contributor[]> {
    return await db.select().from(contributors).orderBy(desc(contributors.createdAt));
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const [contributor] = await db.insert(contributors).values(insertContributor).returning();
    return contributor;
  }

  // Points System
  async getUserPoints(userId: string): Promise<{ total: number; transactions: PointsTransaction[] }> {
    const transactions = await db.select().from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(desc(pointsTransactions.createdAt));
    
    const total = transactions.reduce((sum, transaction) => sum + transaction.points, 0);
    
    return { total, transactions };
  }

  async addPoints(userId: string, points: number, description: string): Promise<PointsTransaction> {
    const [transaction] = await db.insert(pointsTransactions)
      .values({
        userId,
        points,
        description,
        createdAt: new Date().toISOString(),
      })
      .returning();
    
    return transaction;
  }

  // Spiritual Planner
  async getSpiritualPlannerEntries(userId: string, date: string): Promise<SpiritualPlannerEntry[]> {
    return await db.select().from(spiritualPlannerEntries)
      .where(and(
        eq(spiritualPlannerEntries.userId, userId),
        eq(spiritualPlannerEntries.date, date)
      ));
  }

  async createOrUpdateSpiritualPlannerEntry(entry: InsertSpiritualPlannerEntry): Promise<SpiritualPlannerEntry> {
    const [result] = await db.insert(spiritualPlannerEntries)
      .values(entry)
      .onConflictDoUpdate({
        target: [spiritualPlannerEntries.userId, spiritualPlannerEntries.date, spiritualPlannerEntries.type],
        set: {
          content: entry.content,
          completed: entry.completed,
          updatedAt: new Date().toISOString(),
        }
      })
      .returning();
    
    return result;
  }

  // User Devotionals
  async createUserDevotional(devotional: InsertUserDevotional): Promise<UserDevotional> {
    const [result] = await db.insert(userDevotionals).values(devotional).returning();
    return result;
  }

  async getUserDevotionals(userId: string): Promise<UserDevotional[]> {
    return await db.select().from(userDevotionals)
      .where(eq(userDevotionals.userId, userId))
      .orderBy(desc(userDevotionals.createdAt));
  }

  async getUserDevotionalByDate(userId: string, date: string): Promise<UserDevotional | undefined> {
    const [result] = await db.select().from(userDevotionals)
      .where(and(eq(userDevotionals.userId, userId), eq(userDevotionals.date, date)));
    return result;
  }

  // Verse Reactions
  async createVerseReaction(reaction: InsertVerseReaction): Promise<VerseReaction> {
    const [result] = await db.insert(verseReactions).values(reaction).returning();
    return result;
  }

  async getUserVerseReaction(userId: string, verseId: string): Promise<VerseReaction | undefined> {
    const [result] = await db.select().from(verseReactions)
      .where(and(eq(verseReactions.userId, userId), eq(verseReactions.verseId, verseId)));
    return result;
  }
}

export const storage = new DatabaseStorage();