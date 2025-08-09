import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  whatsapp: text("whatsapp"),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  points: text("points").default("0"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devotionals = pgTable("devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  date: text("date").notNull(),
  audioUrl: text("audio_url"),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verses = pgTable("verses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  reference: text("reference").notNull(),
  book: text("book").notNull(),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
});

export const prayers = pgTable("prayers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emotions = pgTable("emotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

// Sistema "Sinto Hoje" - Estados emocionais com IA
export const emotionalStates = pgTable("emotional_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  emotion: text("emotion").notNull(),
  intensity: text("intensity").notNull(), // low, medium, high
  description: text("description"),
  aiResponse: text("ai_response"),
  suggestedVerse: text("suggested_verse"),
  verseReference: text("verse_reference"),
  personalizedPrayer: text("personalized_prayer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emotionDevotionals = pgTable("emotion_devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emotionId: varchar("emotion_id").notNull(),
  emotion: text("emotion").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  prayer: text("prayer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(), // "7" or "21"
  imageUrl: text("image_url"),
  pointsReward: text("points_reward").default("10"),
  order: text("order").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeDays = pgTable("challenge_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull(),
  day: text("day").notNull(),
  dayNumber: text("day_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  reflection: text("reflection").notNull(),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  challengeId: varchar("challenge_id").notNull(),
  dayId: varchar("day_id").notNull(),
  completed: boolean("completed").default(false),
  pointsEarned: text("points_earned").default("0"),
  completedAt: timestamp("completed_at"),
});

export const aiPrayerRequests = pgTable("ai_prayer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  verse: text("verse"),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cartões de amor únicos e compartilháveis
export const loveCards = pgTable("love_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  verse: text("verse"),
  reference: text("reference"),
  imageUrl: text("image_url"),
  backgroundColor: text("background_color").notNull(),
  textColor: text("text_color").notNull(),
  category: text("category").notNull(), // love, encouragement, faith, hope
  isGenerated: boolean("is_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status").default("pending"), // pending, responded
  aiResponse: text("ai_response"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de colaboradores e apoio financeiro
export const contributors = pgTable("contributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  pixKey: text("pix_key").default("faithinjesuseua@gmail.com"),
  donationAmount: text("donation_amount"),
  contributionType: text("contribution_type").notNull(), // financial, content, technical
  specialMessage: text("special_message"),
  certificateUrl: text("certificate_url"),
  specialVerse: text("special_verse"),
  verseReference: text("verse_reference"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// E-books reais da biblioteca
export const ebooks = pgTable("ebooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  readOnlineUrl: text("read_online_url"),
  isReal: boolean("is_real").default(true),
  isFree: boolean("is_free").default(true),
  donationMessage: text("donation_message"),
  downloads: text("downloads").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryCategories = pgTable("library_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  order: text("order").default("0"),
});

export const libraryContent = pgTable("library_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse"),
  reference: text("reference"),
  externalLink: text("external_link"),
  contentType: text("content_type").notNull(), // reflection, verse, link
  createdAt: timestamp("created_at").defaultNow(),
});

export const devotionalAudios = pgTable("devotional_audios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsors = pgTable("sponsors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  whatsapp: text("whatsapp"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorAds = pgTable("sponsor_ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorId: varchar("sponsor_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
});

// Loja Virtual
export const storeProducts = pgTable("store_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // books, accessories, courses, digital
  isAffiliate: boolean("is_affiliate").default(false),
  affiliateLink: text("affiliate_link"),
  internalLink: text("internal_link"),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  tags: text("tags"), // JSON array de tags
  stock: text("stock"), // Para produtos próprios
  createdAt: timestamp("created_at").defaultNow(),
});

// Vídeos do YouTube Canal Faith in Jesus BR
export const youtubeVideos = pgTable("youtube_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  youtubeId: text("youtube_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  duration: text("duration"),
  viewCount: text("view_count"),
  tags: text("tags"), // JSON array
  category: text("category"), // sermon, devotional, music, testimony
  isFeatured: boolean("is_featured").default(false),
  featured: boolean("featured").default(false),
  isActive: boolean("is_active").default(true),
  syncedAt: timestamp("synced_at").defaultNow(),
});

// Sistema de pontuação e gamificação
export const userPoints = pgTable("user_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  points: text("points").default("0"),
  reason: text("reason").notNull(), // devotional_read, challenge_completed, prayer_sent, etc
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Sistema de notificações
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // devotional, prayer, challenge, sponsor, system
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"), // URL para ação específica
  scheduledFor: timestamp("scheduled_for"), // Para notificações agendadas
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de certificados gerados por IA
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientType: text("recipient_type").notNull(), // sponsor, contributor
  recipientId: varchar("recipient_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  aiGeneratedPrayer: text("ai_generated_prayer").notNull(),
  aiGeneratedVerse: text("ai_generated_verse").notNull(),
  verseReference: text("verse_reference").notNull(),
  templateStyle: text("template_style").default("elegant"),
  backgroundColor: text("background_color").default("#ffffff"),
  textColor: text("text_color").default("#333333"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Analytics para o painel admin
export const userInteractions = pgTable("user_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // view, like, share, complete, pray
  entityType: text("entity_type").notNull(), // devotional, verse, prayer, challenge
  entityId: varchar("entity_id").notNull(),
  sessionId: varchar("session_id"),
  deviceType: text("device_type"), // mobile, desktop, tablet
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de transações de pontos
export const pointsTransactions = pgTable("points_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  points: text("points").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de planejamento espiritual
export const spiritualPlannerEntries = pgTable("spiritual_planner_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // prayer, reading, reflection, gratitude
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Devocionais do usuário
export const userDevotionals = pgTable("user_devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  devotionalId: varchar("devotional_id").notNull(),
  date: text("date").notNull(),
  completed: boolean("completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reações aos versículos
export const verseReactions = pgTable("verse_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  verseId: varchar("verse_id").notNull(),
  reaction: text("reaction").notNull(), // like, love, amen, bookmark
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de contribuições dos usuários
export const userContributions = pgTable("user_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // feedback, suggestion, testimony
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").default("pending"), // pending, reviewed, archived, responded
  adminResponse: text("admin_response"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cache offline para versículos do dia
export const verseCache = pgTable("verse_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(),
  verseText: text("verse_text").notNull(),
  verseReference: text("verse_reference").notNull(),
  cachedAt: timestamp("cached_at").defaultNow(),
});

// Sistema de push notifications
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Configurações de notificação do usuário
export const notificationSettings = pgTable("notification_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  dailyVerse: boolean("daily_verse").default(true),
  prayerReminders: boolean("prayer_reminders").default(true),
  challengeUpdates: boolean("challenge_updates").default(true),
  sponsorMessages: boolean("sponsor_messages").default(false),
  preferredTime: text("preferred_time").default("09:00"), // HH:MM format
  createdAt: timestamp("created_at").defaultNow(),
});

// Missão do Dia - Sistema de desafios espirituais diários
export const dailyMissions = pgTable("daily_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "prayer", "share_verse", "help_someone", "read_chapter", etc.
  reward: text("reward").notNull(), // "star", "heart", "crown", "blessing"
  points: text("points").default("10"),
  verse: text("verse"),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progresso das missões do usuário
export const userMissionProgress = pgTable("user_mission_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  missionId: varchar("mission_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  pointsEarned: text("points_earned").default("0"),
  rewardEarned: text("reward_earned"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rede de Apoio - Sistema de mensagens de fé e apoio
export const supportNetwork = pgTable("support_network", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(), // "prayer_request", "encouragement", "testimony", "help"
  isAnonymous: boolean("is_anonymous").default(false),
  status: text("status").default("active"), // "active", "closed", "archived"
  replies: text("replies").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Respostas da rede de apoio
export const supportReplies = pgTable("support_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supportId: varchar("support_id").notNull(),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  verse: text("verse"),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de pontos "Fé em Ação"
export const faithPoints = pgTable("faith_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // "complete_mission", "send_support", "prayer_request", etc.
  points: text("points").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ranking semanal
export const weeklyRanking = pgTable("weekly_ranking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  weekStart: text("week_start").notNull(), // YYYY-MM-DD (segunda-feira)
  weekEnd: text("week_end").notNull(), // YYYY-MM-DD (domingo)
  totalPoints: text("total_points").notNull(),
  position: text("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type LoginUser = z.infer<typeof loginSchema>;
export type Devotional = typeof devotionals.$inferSelect;
export type InsertDevotional = typeof devotionals.$inferInsert;
export type Verse = typeof verses.$inferSelect;
export type InsertVerse = typeof verses.$inferInsert;
export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;
export type Emotion = typeof emotions.$inferSelect;
export type InsertEmotion = typeof emotions.$inferInsert;
export type EmotionalState = typeof emotionalStates.$inferSelect;
export type InsertEmotionalState = typeof emotionalStates.$inferInsert;
export type EmotionDevotional = typeof emotionDevotionals.$inferSelect;
export type InsertEmotionDevotional = typeof emotionDevotionals.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export type ChallengeDay = typeof challengeDays.$inferSelect;
export type InsertChallengeDay = typeof challengeDays.$inferInsert;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = typeof userChallengeProgress.$inferInsert;
export type AIPrayerRequest = typeof aiPrayerRequests.$inferSelect;
export type InsertAIPrayerRequest = typeof aiPrayerRequests.$inferInsert;
export type LoveCard = typeof loveCards.$inferSelect;
export type InsertLoveCard = typeof loveCards.$inferInsert;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = typeof prayerRequests.$inferInsert;
export type Contributor = typeof contributors.$inferSelect;
export type InsertContributor = typeof contributors.$inferInsert;
export type Ebook = typeof ebooks.$inferSelect;
export type InsertEbook = typeof ebooks.$inferInsert;
export type LibraryCategory = typeof libraryCategories.$inferSelect;
export type InsertLibraryCategory = typeof libraryCategories.$inferInsert;
export type LibraryContent = typeof libraryContent.$inferSelect;
export type InsertLibraryContent = typeof libraryContent.$inferInsert;
export type DevotionalAudio = typeof devotionalAudios.$inferSelect;
export type InsertDevotionalAudio = typeof devotionalAudios.$inferInsert;
export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = typeof sponsors.$inferInsert;
export type SponsorAd = typeof sponsorAds.$inferSelect;
export type InsertSponsorAd = typeof sponsorAds.$inferInsert;
export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertStoreProduct = typeof storeProducts.$inferInsert;
export type YoutubeVideo = typeof youtubeVideos.$inferSelect;
export type InsertYoutubeVideo = typeof youtubeVideos.$inferInsert;
export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = typeof userInteractions.$inferInsert;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type InsertPointsTransaction = typeof pointsTransactions.$inferInsert;
export type SpiritualPlannerEntry = typeof spiritualPlannerEntries.$inferSelect;
export type InsertSpiritualPlannerEntry = typeof spiritualPlannerEntries.$inferInsert;
export type UserDevotional = typeof userDevotionals.$inferSelect;
export type InsertUserDevotional = typeof userDevotionals.$inferInsert;
export type VerseReaction = typeof verseReactions.$inferSelect;
export type InsertVerseReaction = typeof verseReactions.$inferInsert;
export type UserContribution = typeof userContributions.$inferSelect;
export type InsertUserContribution = typeof userContributions.$inferInsert;
export type VerseCache = typeof verseCache.$inferSelect;
export type InsertVerseCache = typeof verseCache.$inferInsert;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertNotificationSettings = typeof notificationSettings.$inferInsert;
export type DailyMission = typeof dailyMissions.$inferSelect;
export type InsertDailyMission = typeof dailyMissions.$inferInsert;
export type UserMissionProgress = typeof userMissionProgress.$inferSelect;
export type InsertUserMissionProgress = typeof userMissionProgress.$inferInsert;
export type SupportNetwork = typeof supportNetwork.$inferSelect;
export type InsertSupportNetwork = typeof supportNetwork.$inferInsert;
export type SupportReply = typeof supportReplies.$inferSelect;
export type InsertSupportReply = typeof supportReplies.$inferInsert;
export type FaithPoint = typeof faithPoints.$inferSelect;
export type InsertFaithPoint = typeof faithPoints.$inferInsert;
export type WeeklyRanking = typeof weeklyRanking.$inferSelect;
export type InsertWeeklyRanking = typeof weeklyRanking.$inferInsert;

// Validation Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  whatsapp: true,
}).extend({
  whatsapp: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertDevotionalSchema = createInsertSchema(devotionals).pick({
  title: true,
  content: true,
  verse: true,
  reference: true,
  date: true,
});

export const insertEmotionalStateSchema = createInsertSchema(emotionalStates).pick({
  userId: true,
  emotion: true,
  intensity: true,
  description: true,
});

export const insertContributorSchema = createInsertSchema(contributors).pick({
  name: true,
  email: true,
  donationAmount: true,
  contributionType: true,
});

export const insertEbookSchema = createInsertSchema(ebooks).pick({
  title: true,
  author: true,
  description: true,
  category: true,
  imageUrl: true,
  pdfUrl: true,
  readOnlineUrl: true,
  donationMessage: true,
});

export const insertLoveCardSchema = createInsertSchema(loveCards).pick({
  title: true,
  message: true,
  verse: true,
  reference: true,
  backgroundColor: true,
  textColor: true,
  category: true,
});

export const insertUserPointsSchema = createInsertSchema(userPoints).pick({
  userId: true,
  points: true,
  reason: true,
});

export const insertPrayerSchema = createInsertSchema(prayers).pick({
  userId: true,
  content: true,
});

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).pick({
  userId: true,
  subject: true,
  content: true,
});

export const insertAIPrayerRequestSchema = createInsertSchema(aiPrayerRequests).pick({
  userId: true,
  userMessage: true,
  aiResponse: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  duration: true,
  imageUrl: true,
});

export const insertEmotionSchema = createInsertSchema(emotions).pick({
  name: true,
  description: true,
  color: true,
  icon: true,
});

export const insertVerseSchema = createInsertSchema(verses).pick({
  text: true,
  reference: true,
  book: true,
  chapter: true,
  verse: true,
});

export const insertUserContributionSchema = createInsertSchema(userContributions).pick({
  userId: true,
  type: true,
  title: true,
  content: true,
});

export const insertVerseCacheSchema = createInsertSchema(verseCache).pick({
  date: true,
  verseText: true,
  verseReference: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).pick({
  userId: true,
  endpoint: true,
  p256dh: true,
  auth: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).pick({
  userId: true,
  dailyVerse: true,
  prayerReminders: true,
  challengeUpdates: true,
  sponsorMessages: true,
  preferredTime: true,
});

export const insertDailyMissionSchema = createInsertSchema(dailyMissions).pick({
  date: true,
  title: true,
  description: true,
  type: true,
  reward: true,
  points: true,
  verse: true,
  reference: true,
});

export const insertUserMissionProgressSchema = createInsertSchema(userMissionProgress).pick({
  userId: true,
  missionId: true,
  completed: true,
  pointsEarned: true,
  rewardEarned: true,
});

export const insertSupportNetworkSchema = createInsertSchema(supportNetwork).pick({
  userId: true,
  title: true,
  message: true,
  category: true,
  isAnonymous: true,
});

export const insertSupportReplySchema = createInsertSchema(supportReplies).pick({
  supportId: true,
  userId: true,
  message: true,
  isAnonymous: true,
  verse: true,
  reference: true,
});

export const insertFaithPointSchema = createInsertSchema(faithPoints).pick({
  userId: true,
  action: true,
  points: true,
  description: true,
  date: true,
});

export const insertSponsorSchema = createInsertSchema(sponsors).pick({
  name: true,
  description: true,
  logoUrl: true,
  website: true,
  instagram: true,
  facebook: true,
  whatsapp: true,
});