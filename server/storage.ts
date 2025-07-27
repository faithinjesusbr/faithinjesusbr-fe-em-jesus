import { eq, desc, and, like, count, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  devotionals, 
  verses, 
  prayers, 
  emotions, 
  emotionDevotionals,
  challenges,
  challengeDays,
  userChallengeProgress,
  aiPrayerRequests,
  loveCards,
  prayerRequests,
  libraryCategories,
  libraryContent,
  devotionalAudios,
  sponsors,
  sponsorAds,
  contributors,
  notifications,
  userNotificationSettings,
  userInteractions,
  certificates,
  appSettings
} from "@shared/schema";
import type {
  User,
  InsertUser,
  Devotional,
  InsertDevotional,
  Verse,
  InsertVerse,
  Prayer,
  InsertPrayer,
  Emotion,
  InsertEmotion,
  EmotionDevotional,
  InsertEmotionDevotional,
  Challenge,
  InsertChallenge,
  ChallengeDay,
  InsertChallengeDay,
  UserChallengeProgress,
  InsertUserChallengeProgress,
  AIPrayerRequest,
  InsertAIPrayerRequest,
  LoveCard,
  InsertLoveCard,
  PrayerRequest,
  InsertPrayerRequest,
  LibraryCategory,
  InsertLibraryCategory,
  LibraryContent,
  InsertLibraryContent,
  DevotionalAudio,
  InsertDevotionalAudio,
  Sponsor,
  InsertSponsor,
  SponsorAd,
  InsertSponsorAd,
  Contributor,
  InsertContributor,
  Notification,
  InsertNotification,
  UserNotificationSettings,
  InsertUserNotificationSettings,
  UserInteraction,
  InsertUserInteraction,
  Certificate,
  InsertCertificate,
  AppSettings,
  InsertAppSettings,
} from "@shared/schema";

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
  updatePrayerRequest(id: string, updates: Partial<PrayerRequest>): Promise<PrayerRequest | undefined>;
  getUserPrayerRequests(userId: string): Promise<PrayerRequest[]>;
  
  // Library
  getAllLibraryCategories(): Promise<LibraryCategory[]>;
  createLibraryCategory(category: InsertLibraryCategory): Promise<LibraryCategory>;
  getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]>;
  createLibraryContent(content: InsertLibraryContent): Promise<LibraryContent>;
  
  // Devotional Audios
  getAllDevotionalAudios(): Promise<DevotionalAudio[]>;
  createDevotionalAudio(audio: InsertDevotionalAudio): Promise<DevotionalAudio>;
  
  // Sponsors
  getAllSponsors(): Promise<Sponsor[]>;
  getActiveSponsorAds(): Promise<SponsorAd[]>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  createSponsorAd(ad: InsertSponsorAd): Promise<SponsorAd>;
  
  // Novas funcionalidades
  // Contributors
  getAllContributors(): Promise<Contributor[]>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  updateContributor(id: string, updates: Partial<Contributor>): Promise<Contributor | undefined>;
  
  // Notifications
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<boolean>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  
  // User Notification Settings
  getUserNotificationSettings(userId: string): Promise<UserNotificationSettings | undefined>;
  updateUserNotificationSettings(userId: string, settings: InsertUserNotificationSettings): Promise<UserNotificationSettings>;
  
  // User Interactions (Analytics)
  trackUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  getInteractionStats(entityType?: string, startDate?: Date, endDate?: Date): Promise<any>;
  
  // Certificates
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificatesForRecipient(recipientType: string, recipientId: string): Promise<Certificate[]>;
  
  // App Settings
  getSetting(key: string): Promise<AppSettings | undefined>;
  updateSetting(key: string, value: string): Promise<AppSettings>;
  getPublicSettings(): Promise<AppSettings[]>;
  
  // Admin Dashboard Data
  getAdminDashboardData(): Promise<{
    totalUsers: number;
    totalPrayers: number;
    totalDevotionals: number;
    activeSponsors: number;
    recentInteractions: UserInteraction[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
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

  // Devotional methods
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

  async updateDevotional(id: string, updateData: Partial<Devotional>): Promise<Devotional | undefined> {
    const [devotional] = await db.update(devotionals).set(updateData).where(eq(devotionals.id, id)).returning();
    return devotional;
  }

  async deleteDevotional(id: string): Promise<boolean> {
    const result = await db.delete(devotionals).where(eq(devotionals.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Verse methods
  async getAllVerses(): Promise<Verse[]> {
    return await db.select().from(verses);
  }

  async getRandomVerse(): Promise<Verse | undefined> {
    const [verse] = await db.select().from(verses).orderBy(sql`RANDOM()`).limit(1);
    return verse;
  }

  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const [verse] = await db.insert(verses).values(insertVerse).returning();
    return verse;
  }

  async updateVerse(id: string, updateData: Partial<Verse>): Promise<Verse | undefined> {
    const [verse] = await db.update(verses).set(updateData).where(eq(verses.id, id)).returning();
    return verse;
  }

  async deleteVerse(id: string): Promise<boolean> {
    const result = await db.delete(verses).where(eq(verses.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Prayer methods
  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const [prayer] = await db.insert(prayers).values(insertPrayer).returning();
    return prayer;
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return await db.select().from(prayers).where(eq(prayers.userId, userId)).orderBy(desc(prayers.createdAt));
  }

  async getPrayerStats(): Promise<{ total: number; today: number }> {
    const [totalResult] = await db.select({ count: count() }).from(prayers);
    const today = new Date().toISOString().split('T')[0];
    const [todayResult] = await db.select({ count: count() }).from(prayers)
      .where(sql`DATE(created_at) = ${today}`);
    
    return {
      total: totalResult.count,
      today: todayResult.count
    };
  }

  // Emotion methods
  async getAllEmotions(): Promise<Emotion[]> {
    return await db.select().from(emotions);
  }

  async createEmotion(insertEmotion: InsertEmotion): Promise<Emotion> {
    const [emotion] = await db.insert(emotions).values(insertEmotion).returning();
    return emotion;
  }

  // Emotion Devotional methods
  async getEmotionDevotional(emotionId: string): Promise<EmotionDevotional | undefined> {
    const [devotional] = await db.select().from(emotionDevotionals).where(eq(emotionDevotionals.emotionId, emotionId));
    return devotional;
  }

  async createEmotionDevotional(insertDevotional: InsertEmotionDevotional): Promise<EmotionDevotional> {
    const [devotional] = await db.insert(emotionDevotionals).values(insertDevotional).returning();
    return devotional;
  }

  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values(insertChallenge).returning();
    return challenge;
  }

  // Challenge Day methods
  async getChallengeDays(challengeId: string): Promise<ChallengeDay[]> {
    return await db.select().from(challengeDays).where(eq(challengeDays.challengeId, challengeId));
  }

  async createChallengeDay(insertDay: InsertChallengeDay): Promise<ChallengeDay> {
    const [day] = await db.insert(challengeDays).values(insertDay).returning();
    return day;
  }

  // User Challenge Progress methods
  async getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]> {
    return await db.select().from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.challengeId, challengeId)));
  }

  async updateChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const [progress] = await db.insert(userChallengeProgress).values(insertProgress)
      .onConflictDoUpdate({
        target: [userChallengeProgress.userId, userChallengeProgress.challengeId, userChallengeProgress.dayId],
        set: {
          completed: insertProgress.completed,
          completedAt: new Date()
        }
      }).returning();
    return progress;
  }

  // AI Prayer Request methods
  async createAIPrayerRequest(insertRequest: InsertAIPrayerRequest): Promise<AIPrayerRequest> {
    const [request] = await db.insert(aiPrayerRequests).values(insertRequest).returning();
    return request;
  }

  async getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]> {
    return await db.select().from(aiPrayerRequests).where(eq(aiPrayerRequests.userId, userId))
      .orderBy(desc(aiPrayerRequests.createdAt));
  }

  // Love Card methods
  async getAllLoveCards(): Promise<LoveCard[]> {
    return await db.select().from(loveCards);
  }

  async createLoveCard(insertCard: InsertLoveCard): Promise<LoveCard> {
    const [card] = await db.insert(loveCards).values(insertCard).returning();
    return card;
  }

  // Prayer Request methods
  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  async updatePrayerRequest(id: string, updates: Partial<PrayerRequest>): Promise<PrayerRequest | undefined> {
    const [request] = await db.update(prayerRequests).set(updates).where(eq(prayerRequests.id, id)).returning();
    return request;
  }

  async getUserPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests).where(eq(prayerRequests.userId, userId))
      .orderBy(desc(prayerRequests.createdAt));
  }

  // Library methods
  async getAllLibraryCategories(): Promise<LibraryCategory[]> {
    return await db.select().from(libraryCategories);
  }

  async createLibraryCategory(insertCategory: InsertLibraryCategory): Promise<LibraryCategory> {
    const [category] = await db.insert(libraryCategories).values(insertCategory).returning();
    return category;
  }

  async getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]> {
    return await db.select().from(libraryContent).where(eq(libraryContent.categoryId, categoryId));
  }

  async createLibraryContent(insertContent: InsertLibraryContent): Promise<LibraryContent> {
    const [content] = await db.insert(libraryContent).values(insertContent).returning();
    return content;
  }

  // Devotional Audio methods
  async getAllDevotionalAudios(): Promise<DevotionalAudio[]> {
    return await db.select().from(devotionalAudios).orderBy(desc(devotionalAudios.createdAt));
  }

  async createDevotionalAudio(insertAudio: InsertDevotionalAudio): Promise<DevotionalAudio> {
    const [audio] = await db.insert(devotionalAudios).values(insertAudio).returning();
    return audio;
  }

  // Sponsor methods
  async getAllSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).where(eq(sponsors.isActive, true))
      .orderBy(desc(sponsors.createdAt));
  }

  async getActiveSponsorAds(): Promise<SponsorAd[]> {
    return await db.select().from(sponsorAds).where(eq(sponsorAds.isActive, true))
      .orderBy(desc(sponsorAds.createdAt));
  }

  async createSponsor(insertSponsor: InsertSponsor): Promise<Sponsor> {
    const [sponsor] = await db.insert(sponsors).values(insertSponsor).returning();
    return sponsor;
  }

  async createSponsorAd(insertAd: InsertSponsorAd): Promise<SponsorAd> {
    const [ad] = await db.insert(sponsorAds).values(insertAd).returning();
    return ad;
  }

  // Contributor methods (Novo)
  async getAllContributors(): Promise<Contributor[]> {
    return await db.select().from(contributors).where(eq(contributors.isActive, true))
      .orderBy(desc(contributors.createdAt));
  }

  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const [contributor] = await db.insert(contributors).values(insertContributor).returning();
    return contributor;
  }

  async updateContributor(id: string, updates: Partial<Contributor>): Promise<Contributor | undefined> {
    const [contributor] = await db.update(contributors).set(updates).where(eq(contributors.id, id)).returning();
    return contributor;
  }

  // Notification methods (Novo)
  async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt)).limit(limit);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const result = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db.select({ count: count() }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.count;
  }

  // User Notification Settings methods (Novo)
  async getUserNotificationSettings(userId: string): Promise<UserNotificationSettings | undefined> {
    const [settings] = await db.select().from(userNotificationSettings).where(eq(userNotificationSettings.userId, userId));
    return settings;
  }

  async updateUserNotificationSettings(userId: string, insertSettings: InsertUserNotificationSettings): Promise<UserNotificationSettings> {
    const [settings] = await db.insert(userNotificationSettings).values({ ...insertSettings, userId })
      .onConflictDoUpdate({
        target: userNotificationSettings.userId,
        set: {
          ...insertSettings,
          updatedAt: new Date()
        }
      }).returning();
    return settings;
  }

  // User Interaction methods (Novo - para analytics)
  async trackUserInteraction(insertInteraction: InsertUserInteraction): Promise<UserInteraction> {
    const [interaction] = await db.insert(userInteractions).values(insertInteraction).returning();
    return interaction;
  }

  async getInteractionStats(entityType?: string, startDate?: Date, endDate?: Date): Promise<any> {
    let query = db.select({
      action: userInteractions.action,
      count: count()
    }).from(userInteractions);

    if (entityType) {
      query = query.where(eq(userInteractions.entityType, entityType));
    }

    const results = await query.groupBy(userInteractions.action);
    return results;
  }

  // Certificate methods (Novo)
  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db.insert(certificates).values(insertCertificate).returning();
    return certificate;
  }

  async getCertificatesForRecipient(recipientType: string, recipientId: string): Promise<Certificate[]> {
    return await db.select().from(certificates)
      .where(and(eq(certificates.recipientType, recipientType), eq(certificates.recipientId, recipientId)))
      .orderBy(desc(certificates.issuedAt));
  }

  // App Settings methods (Novo)
  async getSetting(key: string): Promise<AppSettings | undefined> {
    const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key));
    return setting;
  }

  async updateSetting(key: string, value: string): Promise<AppSettings> {
    const [setting] = await db.insert(appSettings).values({ key, value })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value, updatedAt: new Date() }
      }).returning();
    return setting;
  }

  async getPublicSettings(): Promise<AppSettings[]> {
    return await db.select().from(appSettings).where(eq(appSettings.isPublic, true));
  }

  // Admin Dashboard Data (Novo)
  async getAdminDashboardData(): Promise<{
    totalUsers: number;
    totalPrayers: number;
    totalDevotionals: number;
    activeSponsors: number;
    recentInteractions: UserInteraction[];
  }> {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [prayersCount] = await db.select({ count: count() }).from(prayers);
    const [devotionalsCount] = await db.select({ count: count() }).from(devotionals);
    const [sponsorsCount] = await db.select({ count: count() }).from(sponsors).where(eq(sponsors.isActive, true));
    
    const recentInteractions = await db.select().from(userInteractions)
      .orderBy(desc(userInteractions.createdAt)).limit(10);

    return {
      totalUsers: usersCount.count,
      totalPrayers: prayersCount.count,
      totalDevotionals: devotionalsCount.count,
      activeSponsors: sponsorsCount.count,
      recentInteractions
    };
  }
}

export const storage = new DatabaseStorage();