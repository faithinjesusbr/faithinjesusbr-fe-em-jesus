import { eq, desc, and, or, asc } from "drizzle-orm";
import { db } from "./db";
import {
  users, devotionals, verses, prayers, emotions, emotionDevotionals,
  challenges, challengeDays, userChallengeProgress, aiPrayerRequests,
  prayerRequests, loveCards, libraryCategories, libraryContent,
  devotionalAudios, sponsors, sponsorAds, storeProducts, youtubeVideos,
  notifications, userInteractions, contributors, pointsTransactions,
  spiritualPlannerEntries, userDevotionals, verseReactions, userContributions,
  verseCache, pushSubscriptions, notificationSettings,
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
  type UserDevotional, type InsertUserDevotional, type VerseReaction, type InsertVerseReaction,
  type UserContribution, type InsertUserContribution, type VerseCache, type InsertVerseCache,
  type PushSubscription, type InsertPushSubscription, type NotificationSettings, type InsertNotificationSettings
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
  getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]>;
  createAIPrayerRequest(insertRequest: InsertAIPrayerRequest): Promise<AIPrayerRequest>;

  // Prayer Requests
  getAllPrayerRequests(): Promise<PrayerRequest[]>;
  getRecentPrayerRequests(limit: number): Promise<PrayerRequest[]>;
  createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest>;
  getUserPrayerRequests(userId: string): Promise<PrayerRequest[]>;
  updatePrayerRequest(id: string, updateData: Partial<PrayerRequest>): Promise<PrayerRequest | undefined>;
  getPrayerStats(): Promise<any>;

  // Love Cards
  getLoveCards(category?: string): Promise<LoveCard[]>;
  getAllLoveCards(): Promise<LoveCard[]>;
  getLoveCardsByCategory(category: string): Promise<LoveCard[]>;
  createLoveCard(insertCard: InsertLoveCard): Promise<LoveCard>;

  // Library
  getAllLibraryCategories(): Promise<LibraryCategory[]>;
  getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]>;

  // Audio Devotionals
  getDevotionalAudios(): Promise<DevotionalAudio[]>;
  getAllDevotionalAudios(): Promise<DevotionalAudio[]>;

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

  // User Contributions
  getAllUserContributions(): Promise<UserContribution[]>;
  getUserContributions(userId: string): Promise<UserContribution[]>;
  createUserContribution(contribution: InsertUserContribution): Promise<UserContribution>;
  updateUserContribution(id: string, updateData: Partial<UserContribution>): Promise<UserContribution | undefined>;
  deleteUserContribution(id: string): Promise<void>;

  // Verse Cache (Offline Support)
  getCachedVerse(date: string): Promise<VerseCache | undefined>;
  setCachedVerse(cache: InsertVerseCache): Promise<VerseCache>;
  clearOldCache(daysOld: number): Promise<void>;

  // Push Notifications
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getUserPushSubscriptions(userId: string): Promise<PushSubscription[]>;
  deletePushSubscription(id: string): Promise<void>;

  // Notification Settings
  getUserNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;
  createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;

  // Admin functionality
  updateDevotional(id: string, updateData: Partial<Devotional>): Promise<Devotional | undefined>;
  deleteDevotional(id: string): Promise<void>;
  updateVerse(id: string, updateData: Partial<Verse>): Promise<Verse | undefined>;
  deleteVerse(id: string): Promise<void>;
  updateSponsor(id: string, updateData: Partial<Sponsor>): Promise<Sponsor | undefined>;
  deleteSponsor(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void>;
  getAllStoreProducts(): Promise<StoreProduct[]>;
  getFeaturedProducts(): Promise<StoreProduct[]>;
  getProductsByCategory(category: string): Promise<StoreProduct[]>;
  getAllYoutubeVideos(): Promise<YoutubeVideo[]>;
  getFeaturedVideos(): Promise<YoutubeVideo[]>;
  getVideosByCategory(category: string): Promise<YoutubeVideo[]>;
  getAllEbooks(): Promise<any[]>;
  getEbooksByCategory(category: string): Promise<any[]>;
  updateEbookDownloads(id: string): Promise<void>;
  getUserTotalPoints(userId: string): Promise<number>;
  getCertificatesForContributor(contributorId: string): Promise<any[]>;
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

  async getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]> {
    return await db
      .select()
      .from(aiPrayerRequests)
      .where(eq(aiPrayerRequests.userId, userId))
      .orderBy(desc(aiPrayerRequests.createdAt));
  }

  // Prayer Requests
  async getAllPrayerRequests(): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  async getUserPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests)
      .where(eq(prayerRequests.userId, userId))
      .orderBy(desc(prayerRequests.createdAt));
  }

  async updatePrayerRequest(id: string, updateData: Partial<PrayerRequest>): Promise<PrayerRequest | undefined> {
    const [updated] = await db.update(prayerRequests)
      .set(updateData)
      .where(eq(prayerRequests.id, id))
      .returning();
    return updated;
  }

  async getPrayerStats(): Promise<any> {
    const totalPrayers = await db.select().from(prayers);
    const totalRequests = await db.select().from(prayerRequests);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return {
      totalPrayers: totalPrayers.length,
      totalRequests: totalRequests.length,
      thisMonth: {
        prayers: totalPrayers.filter(p => {
          const date = p.createdAt ? new Date(p.createdAt) : new Date();
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length,
        requests: totalRequests.filter(r => {
          const date = r.createdAt ? new Date(r.createdAt) : new Date();
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length
      }
    };
  }

  async getAllDevotionalAudios(): Promise<DevotionalAudio[]> {
    return await db.select().from(devotionalAudios).orderBy(desc(devotionalAudios.createdAt));
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

  async getAllLoveCards(): Promise<LoveCard[]> {
    return await db.select().from(loveCards).orderBy(desc(loveCards.createdAt));
  }

  async getLoveCardsByCategory(category: string): Promise<LoveCard[]> {
    return await db.select().from(loveCards)
      .where(eq(loveCards.category, category))
      .orderBy(desc(loveCards.createdAt));
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

  async getActiveSponsorAds(): Promise<SponsorAd[]> {
    return await db.select().from(sponsorAds)
      .where(eq(sponsorAds.isActive, true))
      .orderBy(desc(sponsorAds.createdAt));
  }

  async getRecentPrayerRequests(limit: number = 10): Promise<PrayerRequest[]> {
    try {
      console.log("Querying recent prayer requests...");
      const result = await db.select().from(prayerRequests)
        .orderBy(desc(prayerRequests.createdAt))
        .limit(limit);
      console.log("Prayer requests result:", result);
      return result;
    } catch (error) {
      console.error("Error in getRecentPrayerRequests:", error);
      throw error;
    }
  }

  // Store
  async getStoreProducts(category?: string, featured?: boolean): Promise<StoreProduct[]> {
    const conditions = [eq(storeProducts.isActive, true)];
    
    if (category) {
      conditions.push(eq(storeProducts.category, category));
    }
    
    if (featured) {
      conditions.push(eq(storeProducts.featured, true));
    }
    
    return await db.select().from(storeProducts)
      .where(and(...conditions))
      .orderBy(desc(storeProducts.createdAt));
  }

  // YouTube
  async getYoutubeVideos(category?: string, featured?: boolean): Promise<YoutubeVideo[]> {
    const conditions = [eq(youtubeVideos.isActive, true)];
    
    if (category) {
      conditions.push(eq(youtubeVideos.category, category));
    }
    
    if (featured) {
      conditions.push(eq(youtubeVideos.featured, true));
    }
    
    return await db.select().from(youtubeVideos)
      .where(and(...conditions))
      .orderBy(desc(youtubeVideos.publishedAt));
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

  async getContributorById(id: string): Promise<Contributor | undefined> {
    const [contributor] = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, id));
    return contributor;
  }

  // Points System
  async getUserPoints(userId: string): Promise<{ total: number; transactions: PointsTransaction[] }> {
    const transactions = await db.select().from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(desc(pointsTransactions.createdAt));
    
    const total = transactions.reduce((sum, transaction) => sum + parseInt(transaction.points), 0);
    
    return { total, transactions };
  }

  async addPoints(userId: string, points: number, description: string): Promise<PointsTransaction> {
    const [transaction] = await db.insert(pointsTransactions)
      .values({
        userId,
        points: points.toString(),
        description,
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

  // User Contributions
  async getAllUserContributions(): Promise<UserContribution[]> {
    return await db.select().from(userContributions).orderBy(desc(userContributions.createdAt));
  }

  async getUserContributions(userId: string): Promise<UserContribution[]> {
    return await db.select().from(userContributions)
      .where(eq(userContributions.userId, userId))
      .orderBy(desc(userContributions.createdAt));
  }

  async createUserContribution(contribution: InsertUserContribution): Promise<UserContribution> {
    const [result] = await db.insert(userContributions).values(contribution).returning();
    return result;
  }

  async updateUserContribution(id: string, updateData: Partial<UserContribution>): Promise<UserContribution | undefined> {
    const [result] = await db.update(userContributions)
      .set(updateData)
      .where(eq(userContributions.id, id))
      .returning();
    return result;
  }

  async deleteUserContribution(id: string): Promise<void> {
    await db.delete(userContributions).where(eq(userContributions.id, id));
  }

  // Verse Cache (Offline Support)
  async getCachedVerse(date: string): Promise<VerseCache | undefined> {
    const [result] = await db.select().from(verseCache).where(eq(verseCache.date, date));
    return result;
  }

  async setCachedVerse(cache: InsertVerseCache): Promise<VerseCache> {
    const [result] = await db.insert(verseCache)
      .values(cache)
      .onConflictDoUpdate({
        target: verseCache.date,
        set: {
          verseText: cache.verseText,
          verseReference: cache.verseReference,
          cachedAt: new Date()
        }
      })
      .returning();
    return result;
  }

  async clearOldCache(daysOld: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    await db.delete(verseCache).where(eq(verseCache.cachedAt, cutoffDate.toISOString()));
  }

  // Push Notifications
  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const [result] = await db.insert(pushSubscriptions).values(subscription).returning();
    return result;
  }

  async getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    return await db.select().from(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.isActive, true)));
  }

  async deletePushSubscription(id: string): Promise<void> {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
  }

  // Notification Settings
  async getUserNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    const [result] = await db.select().from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));
    return result;
  }

  async createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const [result] = await db.insert(notificationSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: notificationSettings.userId,
        set: {
          dailyVerse: settings.dailyVerse,
          prayerReminders: settings.prayerReminders,
          challengeUpdates: settings.challengeUpdates,
          sponsorMessages: settings.sponsorMessages,
          preferredTime: settings.preferredTime
        }
      })
      .returning();
    return result;
  }

  // Admin functionality
  async updateDevotional(id: string, updateData: Partial<Devotional>): Promise<Devotional | undefined> {
    const [result] = await db.update(devotionals)
      .set(updateData)
      .where(eq(devotionals.id, id))
      .returning();
    return result;
  }

  async deleteDevotional(id: string): Promise<void> {
    await db.delete(devotionals).where(eq(devotionals.id, id));
  }

  async updateVerse(id: string, updateData: Partial<Verse>): Promise<Verse | undefined> {
    const [result] = await db.update(verses)
      .set(updateData)
      .where(eq(verses.id, id))
      .returning();
    return result;
  }

  async deleteVerse(id: string): Promise<void> {
    await db.delete(verses).where(eq(verses.id, id));
  }

  async updateSponsor(id: string, updateData: Partial<Sponsor>): Promise<Sponsor | undefined> {
    const [result] = await db.update(sponsors)
      .set(updateData)
      .where(eq(sponsors.id, id))
      .returning();
    return result;
  }

  async deleteSponsor(id: string): Promise<void> {
    await db.delete(sponsors).where(eq(sponsors.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllStoreProducts(): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts)
      .where(eq(storeProducts.isActive, true))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getFeaturedProducts(): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts)
      .where(and(eq(storeProducts.isActive, true), eq(storeProducts.featured, true)))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getProductsByCategory(category: string): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts)
      .where(and(eq(storeProducts.isActive, true), eq(storeProducts.category, category)))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getAllYoutubeVideos(): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos)
      .where(eq(youtubeVideos.isActive, true))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  async getFeaturedVideos(): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos)
      .where(and(eq(youtubeVideos.isActive, true), eq(youtubeVideos.featured, true)))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  async getVideosByCategory(category: string): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos)
      .where(and(eq(youtubeVideos.isActive, true), eq(youtubeVideos.category, category)))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  async getAllEbooks(): Promise<any[]> {
    return await db.select().from(libraryContent).orderBy(desc(libraryContent.createdAt));
  }

  async getEbooksByCategory(category: string): Promise<any[]> {
    return await db.select().from(libraryContent)
      .where(eq(libraryContent.categoryId, category))
      .orderBy(desc(libraryContent.createdAt));
  }

  async updateEbookDownloads(id: string): Promise<void> {
    // This would need to be implemented if we track download counts
    console.log(`Download tracked for ebook: ${id}`);
  }

  async getUserTotalPoints(userId: string): Promise<number> {
    const transactions = await db.select().from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId));
    
    return transactions.reduce((total, transaction) => {
      return total + parseInt(transaction.points || "0");
    }, 0);
  }

  async getCertificatesForContributor(contributorId: string): Promise<any[]> {
    // This would need to be implemented with proper certificate table
    return [];
  }
}

export const storage = new DatabaseStorage();