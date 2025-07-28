import { eq, desc, and, like, count, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  devotionals, 
  verses, 
  prayers, 
  emotions, 
  emotionDevotionals,
  emotionalStates,
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
  ebooks,
  userPoints,
  notifications,
  userInteractions,
  certificates,
  storeProducts,
  youtubeVideos
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
  EmotionalState,
  InsertEmotionalState,
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
  Contributor,
  InsertContributor,
  Ebook,
  InsertEbook,
  UserPoints,
  InsertUserPoints,
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
  Ebook,
  InsertEbook,
  UserPoints,
  InsertUserPoints,
  Notification,
  InsertNotification,
  UserInteraction,
  InsertUserInteraction,
  Certificate,
  InsertCertificate,
  StoreProduct,
  InsertStoreProduct,
  YoutubeVideo,
  InsertYoutubeVideo,
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
  
  // Emotional States (Sinto Hoje)
  createEmotionalState(state: InsertEmotionalState): Promise<EmotionalState>;
  getUserEmotionalStates(userId: string): Promise<EmotionalState[]>;
  
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
  getLoveCardsByCategory(category: string): Promise<LoveCard[]>;
  
  // Prayer Requests
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  getUserPrayerRequests(userId: string): Promise<PrayerRequest[]>;
  
  // Contributors  
  getAllContributors(): Promise<Contributor[]>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  getContributor(id: string): Promise<Contributor | undefined>;
  
  // E-books
  getAllEbooks(): Promise<Ebook[]>;
  getEbooksByCategory(category: string): Promise<Ebook[]>;
  createEbook(ebook: InsertEbook): Promise<Ebook>;
  updateEbookDownloads(id: string): Promise<void>;
  
  // User Points
  createUserPoints(points: InsertUserPoints): Promise<UserPoints>;
  getUserPoints(userId: string): Promise<UserPoints[]>;
  getUserTotalPoints(userId: string): Promise<number>;
  
  // Store Products
  getAllStoreProducts(): Promise<StoreProduct[]>;
  getFeaturedProducts(): Promise<StoreProduct[]>;
  getProductsByCategory(category: string): Promise<StoreProduct[]>;
  
  // YouTube Videos
  getAllYoutubeVideos(): Promise<YoutubeVideo[]>;
  getFeaturedVideos(): Promise<YoutubeVideo[]>;
  getVideosByCategory(category: string): Promise<YoutubeVideo[]>;
  
  // Library
  getAllLibraryCategories(): Promise<LibraryCategory[]>;
  getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]>;
  
  // Sponsors
  getAllSponsors(): Promise<Sponsor[]>;
  getActiveSponsors(): Promise<Sponsor[]>;
  
  // Certificates
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificatesForContributor(contributorId: string): Promise<Certificate[]>;
  
  // User Interactions (Analytics)
  createUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  
  // Notifications  
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Devotionals
  async getDailyDevotional(date: string): Promise<Devotional | undefined> {
    const [devotional] = await db
      .select()
      .from(devotionals)
      .where(eq(devotionals.date, date));
    return devotional || undefined;
  }

  async getAllDevotionals(): Promise<Devotional[]> {
    return await db.select().from(devotionals).orderBy(desc(devotionals.createdAt));
  }

  async createDevotional(devotional: InsertDevotional): Promise<Devotional> {
    const [newDevotional] = await db
      .insert(devotionals)
      .values(devotional)
      .returning();
    return newDevotional;
  }

  async updateDevotional(id: string, devotional: Partial<Devotional>): Promise<Devotional | undefined> {
    const [updated] = await db
      .update(devotionals)
      .set(devotional)
      .where(eq(devotionals.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteDevotional(id: string): Promise<boolean> {
    const result = await db.delete(devotionals).where(eq(devotionals.id, id));
    return result.rowCount > 0;
  }

  // Verses
  async getAllVerses(): Promise<Verse[]> {
    return await db.select().from(verses);
  }

  async getRandomVerse(): Promise<Verse | undefined> {
    const allVerses = await this.getAllVerses();
    if (allVerses.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * allVerses.length);
    return allVerses[randomIndex];
  }

  async createVerse(verse: InsertVerse): Promise<Verse> {
    const [newVerse] = await db
      .insert(verses)
      .values(verse)
      .returning();
    return newVerse;
  }

  async updateVerse(id: string, verse: Partial<Verse>): Promise<Verse | undefined> {
    const [updated] = await db
      .update(verses)
      .set(verse)
      .where(eq(verses.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteVerse(id: string): Promise<boolean> {
    const result = await db.delete(verses).where(eq(verses.id, id));
    return result.rowCount > 0;
  }

  // Prayers
  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
    const [newPrayer] = await db
      .insert(prayers)
      .values(prayer)
      .returning();
    return newPrayer;
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return await db
      .select()
      .from(prayers)
      .where(eq(prayers.userId, userId))
      .orderBy(desc(prayers.createdAt));
  }

  async getPrayerStats(): Promise<{ total: number; today: number }> {
    const today = new Date().toISOString().split('T')[0];
    
    const [totalResult] = await db
      .select({ count: count() })
      .from(prayers);
    
    const [todayResult] = await db
      .select({ count: count() })
      .from(prayers)
      .where(sql`DATE(${prayers.createdAt}) = ${today}`);
    
    return {
      total: totalResult.count,
      today: todayResult.count,
    };
  }

  // Emotions
  async getAllEmotions(): Promise<Emotion[]> {
    return await db.select().from(emotions);
  }

  async createEmotion(emotion: InsertEmotion): Promise<Emotion> {
    const [newEmotion] = await db
      .insert(emotions)
      .values(emotion)
      .returning();
    return newEmotion;
  }

  // Emotional States (Sinto Hoje)
  async createEmotionalState(state: InsertEmotionalState): Promise<EmotionalState> {
    const [newState] = await db
      .insert(emotionalStates)
      .values(state)
      .returning();
    return newState;
  }

  async getUserEmotionalStates(userId: string): Promise<EmotionalState[]> {
    return await db
      .select()
      .from(emotionalStates)
      .where(eq(emotionalStates.userId, userId))
      .orderBy(desc(emotionalStates.createdAt));
  }

  // Emotion Devotionals
  async getEmotionDevotional(emotionId: string): Promise<EmotionDevotional | undefined> {
    const [devotional] = await db
      .select()
      .from(emotionDevotionals)
      .where(eq(emotionDevotionals.emotionId, emotionId));
    return devotional || undefined;
  }

  async createEmotionDevotional(devotional: InsertEmotionDevotional): Promise<EmotionDevotional> {
    const [newDevotional] = await db
      .insert(emotionDevotionals)
      .values(devotional)
      .returning();
    return newDevotional;
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id));
    return challenge || undefined;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db
      .insert(challenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }

  // Challenge Days
  async getChallengeDays(challengeId: string): Promise<ChallengeDay[]> {
    return await db
      .select()
      .from(challengeDays)
      .where(eq(challengeDays.challengeId, challengeId))
      .orderBy(challengeDays.day);
  }

  async createChallengeDay(day: InsertChallengeDay): Promise<ChallengeDay> {
    const [newDay] = await db
      .insert(challengeDays)
      .values(day)
      .returning();
    return newDay;
  }

  // User Challenge Progress
  async getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress[]> {
    return await db
      .select()
      .from(userChallengeProgress)
      .where(and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId)
      ));
  }

  async updateChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const [newProgress] = await db
      .insert(userChallengeProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  // AI Prayer Requests
  async createAIPrayerRequest(request: InsertAIPrayerRequest): Promise<AIPrayerRequest> {
    const [newRequest] = await db
      .insert(aiPrayerRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getUserAIPrayerRequests(userId: string): Promise<AIPrayerRequest[]> {
    return await db
      .select()
      .from(aiPrayerRequests)
      .where(eq(aiPrayerRequests.userId, userId))
      .orderBy(desc(aiPrayerRequests.createdAt));
  }

  // Love Cards
  async getAllLoveCards(): Promise<LoveCard[]> {
    return await db.select().from(loveCards).orderBy(desc(loveCards.createdAt));
  }

  async createLoveCard(card: InsertLoveCard): Promise<LoveCard> {
    const [newCard] = await db
      .insert(loveCards)
      .values(card)
      .returning();
    return newCard;
  }

  async getLoveCardsByCategory(category: string): Promise<LoveCard[]> {
    return await db
      .select()
      .from(loveCards)
      .where(eq(loveCards.category, category))
      .orderBy(desc(loveCards.createdAt));
  }

  // Prayer Requests
  async createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest> {
    const [newRequest] = await db
      .insert(prayerRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getUserPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    return await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.userId, userId))
      .orderBy(desc(prayerRequests.createdAt));
  }

  // Contributors  
  async getAllContributors(): Promise<Contributor[]> {
    return await db
      .select()
      .from(contributors)
      .where(eq(contributors.isActive, true))
      .orderBy(desc(contributors.createdAt));
  }

  async createContributor(contributor: InsertContributor): Promise<Contributor> {
    const [newContributor] = await db
      .insert(contributors)
      .values(contributor)
      .returning();
    return newContributor;
  }

  async getContributor(id: string): Promise<Contributor | undefined> {
    const [contributor] = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, id));
    return contributor || undefined;
  }

  // E-books
  async getAllEbooks(): Promise<Ebook[]> {
    return await db
      .select()
      .from(ebooks)
      .where(eq(ebooks.isReal, true))
      .orderBy(desc(ebooks.createdAt));
  }

  async getEbooksByCategory(category: string): Promise<Ebook[]> {
    return await db
      .select()
      .from(ebooks)
      .where(and(
        eq(ebooks.category, category),
        eq(ebooks.isReal, true)
      ))
      .orderBy(desc(ebooks.createdAt));
  }

  async createEbook(ebook: InsertEbook): Promise<Ebook> {
    const [newEbook] = await db
      .insert(ebooks)
      .values(ebook)
      .returning();
    return newEbook;
  }

  async updateEbookDownloads(id: string): Promise<void> {
    await db
      .update(ebooks)
      .set({ 
        downloads: sql`CAST(${ebooks.downloads} AS INTEGER) + 1`
      })
      .where(eq(ebooks.id, id));
  }

  // User Points
  async createUserPoints(points: InsertUserPoints): Promise<UserPoints> {
    const [newPoints] = await db
      .insert(userPoints)
      .values(points)
      .returning();
    return newPoints;
  }

  async getUserPoints(userId: string): Promise<UserPoints[]> {
    return await db
      .select()
      .from(userPoints)
      .where(eq(userPoints.userId, userId))
      .orderBy(desc(userPoints.earnedAt));
  }

  async getUserTotalPoints(userId: string): Promise<number> {
    const [result] = await db
      .select({ 
        total: sql<number>`SUM(CAST(${userPoints.points} AS INTEGER))`
      })
      .from(userPoints)
      .where(eq(userPoints.userId, userId));
    
    return result?.total || 0;
  }

  // Store Products
  async getAllStoreProducts(): Promise<StoreProduct[]> {
    return await db
      .select()
      .from(storeProducts)
      .where(eq(storeProducts.isActive, true))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getFeaturedProducts(): Promise<StoreProduct[]> {
    return await db
      .select()
      .from(storeProducts)
      .where(and(
        eq(storeProducts.isActive, true),
        eq(storeProducts.featured, true)
      ))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getProductsByCategory(category: string): Promise<StoreProduct[]> {
    return await db
      .select()
      .from(storeProducts)
      .where(and(
        eq(storeProducts.category, category),
        eq(storeProducts.isActive, true)
      ))
      .orderBy(desc(storeProducts.createdAt));
  }

  // YouTube Videos
  async getAllYoutubeVideos(): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos).orderBy(desc(youtubeVideos.publishedAt));
  }

  async getFeaturedVideos(): Promise<YoutubeVideo[]> {
    return await db
      .select()
      .from(youtubeVideos)
      .where(eq(youtubeVideos.isFeatured, true))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  async getVideosByCategory(category: string): Promise<YoutubeVideo[]> {
    return await db
      .select()
      .from(youtubeVideos)
      .where(eq(youtubeVideos.category, category))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  // Library
  async getAllLibraryCategories(): Promise<LibraryCategory[]> {
    return await db.select().from(libraryCategories);
  }

  async getLibraryContentByCategory(categoryId: string): Promise<LibraryContent[]> {
    return await db
      .select()
      .from(libraryContent)
      .where(eq(libraryContent.categoryId, categoryId));
  }

  // Sponsors
  async getAllSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).orderBy(desc(sponsors.createdAt));
  }

  async getActiveSponsors(): Promise<Sponsor[]> {
    return await db
      .select()
      .from(sponsors)
      .where(eq(sponsors.isActive, true))
      .orderBy(desc(sponsors.createdAt));
  }

  // Certificates
  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [newCertificate] = await db
      .insert(certificates)
      .values(certificate)
      .returning();
    return newCertificate;
  }

  async getCertificatesForContributor(contributorId: string): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.recipientId, contributorId))
      .orderBy(desc(certificates.issuedAt));
  }

  // User Interactions (Analytics)
  async createUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    const [newInteraction] = await db
      .insert(userInteractions)
      .values(interaction)
      .returning();
    return newInteraction;
  }

  // Notifications  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }
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
  
  // Store Products
  getAllStoreProducts(): Promise<StoreProduct[]>;
  getActiveStoreProducts(): Promise<StoreProduct[]>;
  getFeaturedStoreProducts(): Promise<StoreProduct[]>;
  createStoreProduct(product: InsertStoreProduct): Promise<StoreProduct>;
  updateStoreProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | undefined>;
  deleteStoreProduct(id: string): Promise<boolean>;
  
  // YouTube Videos
  getAllYoutubeVideos(): Promise<YoutubeVideo[]>;
  getFeaturedYoutubeVideos(): Promise<YoutubeVideo[]>;
  createYoutubeVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo>;
  updateYoutubeVideo(id: string, updates: Partial<YoutubeVideo>): Promise<YoutubeVideo | undefined>;
  deleteYoutubeVideo(id: string): Promise<boolean>;
  syncYoutubeVideos(videos: InsertYoutubeVideo[]): Promise<YoutubeVideo[]>;

  // Admin Dashboard Data
  getAdminDashboardData(): Promise<{
    totalUsers: number;
    totalPrayers: number;
    totalDevotionals: number;
    activeSponsors: number;
    recentInteractions: UserInteraction[];
  }>;

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



  // Store Products methods
  async getAllStoreProducts(): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts).orderBy(desc(storeProducts.createdAt));
  }

  async getActiveStoreProducts(): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts)
      .where(eq(storeProducts.isActive, true))
      .orderBy(desc(storeProducts.createdAt));
  }

  async getFeaturedStoreProducts(): Promise<StoreProduct[]> {
    return await db.select().from(storeProducts)
      .where(and(eq(storeProducts.isActive, true), eq(storeProducts.featured, true)))
      .orderBy(desc(storeProducts.createdAt));
  }

  async createStoreProduct(insertProduct: InsertStoreProduct): Promise<StoreProduct> {
    const [product] = await db.insert(storeProducts).values(insertProduct).returning();
    return product;
  }

  async updateStoreProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | undefined> {
    const [product] = await db.update(storeProducts).set(updates).where(eq(storeProducts.id, id)).returning();
    return product;
  }

  async deleteStoreProduct(id: string): Promise<boolean> {
    const result = await db.delete(storeProducts).where(eq(storeProducts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // YouTube Videos methods
  async getAllYoutubeVideos(): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos).orderBy(desc(youtubeVideos.publishedAt));
  }

  async getFeaturedYoutubeVideos(): Promise<YoutubeVideo[]> {
    return await db.select().from(youtubeVideos)
      .where(eq(youtubeVideos.isFeatured, true))
      .orderBy(desc(youtubeVideos.publishedAt));
  }

  async createYoutubeVideo(insertVideo: InsertYoutubeVideo): Promise<YoutubeVideo> {
    const [video] = await db.insert(youtubeVideos).values(insertVideo).returning();
    return video;
  }

  async updateYoutubeVideo(id: string, updates: Partial<YoutubeVideo>): Promise<YoutubeVideo | undefined> {
    const [video] = await db.update(youtubeVideos).set(updates).where(eq(youtubeVideos.id, id)).returning();
    return video;
  }

  async deleteYoutubeVideo(id: string): Promise<boolean> {
    const result = await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async syncYoutubeVideos(videos: InsertYoutubeVideo[]): Promise<YoutubeVideo[]> {
    const results: YoutubeVideo[] = [];
    for (const video of videos) {
      try {
        const [existingVideo] = await db.select().from(youtubeVideos)
          .where(eq(youtubeVideos.youtubeId, video.youtubeId));
        
        if (existingVideo) {
          // Update existing video
          const [updatedVideo] = await db.update(youtubeVideos)
            .set({ ...video, syncedAt: new Date() })
            .where(eq(youtubeVideos.youtubeId, video.youtubeId))
            .returning();
          results.push(updatedVideo);
        } else {
          // Create new video
          const [newVideo] = await db.insert(youtubeVideos).values(video).returning();
          results.push(newVideo);
        }
      } catch (error) {
        console.error(`Error syncing video ${video.youtubeId}:`, error);
      }
    }
    return results;
  }

  // Admin Dashboard Data
  async getAdminDashboardData(): Promise<{
    totalUsers: number;
    totalPrayers: number;
    totalDevotionals: number;
    activeSponsors: number;
    recentInteractions: UserInteraction[];
  }> {
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [totalPrayersResult] = await db.select({ count: count() }).from(prayers);
    const [totalDevotionalsResult] = await db.select({ count: count() }).from(devotionals);
    const [activeSponsorsResult] = await db.select({ count: count() }).from(sponsors).where(eq(sponsors.isActive, true));
    
    const recentInteractions = await db.select().from(userInteractions)
      .orderBy(desc(userInteractions.createdAt))
      .limit(10);

    return {
      totalUsers: totalUsersResult.count,
      totalPrayers: totalPrayersResult.count,
      totalDevotionals: totalDevotionalsResult.count,
      activeSponsors: activeSponsorsResult.count,
      recentInteractions,
    };
  }

  // Spiritual Planner methods
  async getSpiritualPlannerEntries(userId: string, date: string): Promise<SpiritualPlannerEntry[]> {
    return await db.select().from(spiritualPlannerEntry)
      .where(and(eq(spiritualPlannerEntry.userId, userId), eq(spiritualPlannerEntry.date, date)));
  }

  async createOrUpdateSpiritualPlannerEntry(entry: InsertSpiritualPlannerEntry): Promise<SpiritualPlannerEntry> {
    const [result] = await db.insert(spiritualPlannerEntry).values(entry)
      .onConflictDoUpdate({
        target: [spiritualPlannerEntry.userId, spiritualPlannerEntry.dayOfWeek, spiritualPlannerEntry.date],
        set: {
          ...entry,
          updatedAt: new Date()
        }
      }).returning();
    return result;
  }

  // User Devotionals methods
  async createUserDevotional(devotional: InsertUserDevotional): Promise<UserDevotional> {
    const [result] = await db.insert(userDevotionals).values(devotional).returning();
    return result;
  }

  // Add missing methods for Challenge Progress
  async createChallengeProgress(progressData: any): Promise<any> {
    // Placeholder for challenge progress
    return { id: "1", userId: progressData.userId, challengeId: progressData.challengeId, completed: false };
  }

  async getChallengeProgress(userId: string, challengeId: string): Promise<any[]> {
    // Placeholder for challenge progress
    return [];
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

  // Verse Reactions methods
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