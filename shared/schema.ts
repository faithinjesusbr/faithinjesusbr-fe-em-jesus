import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devotionals = pgTable("devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  date: text("date").notNull(),
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

export const emotionDevotionals = pgTable("emotion_devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emotionId: varchar("emotion_id").notNull(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeDays = pgTable("challenge_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull(),
  day: text("day").notNull(),
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

export const loveCards = pgTable("love_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  verse: text("verse"),
  reference: text("reference"),
  imageUrl: text("image_url"),
  backgroundColor: text("background_color").notNull(),
  textColor: text("text_color").notNull(),
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

export const libraryCategories = pgTable("library_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
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

// Tabela para colaboradores/contribuintes
export const contributors = pgTable("contributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  description: text("description"),
  profileImageUrl: text("profile_image_url"),
  contribution: text("contribution").notNull(), // donation, volunteer, prayer, tech
  amount: text("amount"), // Para doações monetárias
  isActive: boolean("is_active").default(true),
  certificate: text("certificate"), // Certificado gerado por IA
  exclusivePrayer: text("exclusive_prayer"), // Oração exclusiva gerada por IA
  exclusiveVerse: text("exclusive_verse"), // Versículo exclusivo
  verseReference: text("verse_reference"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Configurações de notificação do usuário
export const userNotificationSettings = pgTable("user_notification_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  dailyDevotional: boolean("daily_devotional").default(true),
  prayerReminders: boolean("prayer_reminders").default(true),
  challengeUpdates: boolean("challenge_updates").default(true),
  sponsorContent: boolean("sponsor_content").default(true),
  weeklyDigest: boolean("weekly_digest").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  preferredTime: text("preferred_time").default("09:00"), // Horário preferido para notificações
  timezone: text("timezone").default("America/Sao_Paulo"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics e interações para o painel admin
export const userInteractions = pgTable("user_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // view, like, share, complete, pray
  entityType: text("entity_type").notNull(), // devotional, verse, prayer, challenge
  entityId: varchar("entity_id").notNull(),
  sessionId: varchar("session_id"),
  deviceType: text("device_type"), // mobile, desktop, tablet
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  metadata: text("metadata"), // JSON adicional
  createdAt: timestamp("created_at").defaultNow(),
});

// Sistema de certificados
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientType: text("recipient_type").notNull(), // sponsor, contributor
  recipientId: varchar("recipient_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  aiGeneratedPrayer: text("ai_generated_prayer").notNull(),
  aiGeneratedVerse: text("ai_generated_verse").notNull(),
  verseReference: text("verse_reference").notNull(),
  templateStyle: text("template_style").default("elegant"), // elegant, modern, classic
  backgroundColor: text("background_color").default("#ffffff"),
  textColor: text("text_color").default("#333333"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Configurações gerais do app
export const appSettings = pgTable("app_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: text("category").default("general"), // general, notifications, appearance, sponsor
  isPublic: boolean("is_public").default(false), // Se pode ser acessado pelo frontend
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Vídeos do YouTube
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
  syncedAt: timestamp("synced_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
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

export const insertVerseSchema = createInsertSchema(verses).pick({
  text: true,
  reference: true,
  book: true,
  chapter: true,
  verse: true,
});

export const insertPrayerSchema = createInsertSchema(prayers).pick({
  userId: true,
  content: true,
});

export const insertEmotionSchema = createInsertSchema(emotions).pick({
  name: true,
  description: true,
  color: true,
  icon: true,
});

export const insertEmotionDevotionalSchema = createInsertSchema(emotionDevotionals).pick({
  emotionId: true,
  title: true,
  content: true,
  verse: true,
  reference: true,
  prayer: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  duration: true,
  imageUrl: true,
});

export const insertChallengeDaySchema = createInsertSchema(challengeDays).pick({
  challengeId: true,
  day: true,
  title: true,
  content: true,
  verse: true,
  reference: true,
  reflection: true,
});

export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress).pick({
  userId: true,
  challengeId: true,
  dayId: true,
  completed: true,
});

export const insertAIPrayerRequestSchema = createInsertSchema(aiPrayerRequests).pick({
  userId: true,
  userMessage: true,
  aiResponse: true,
  verse: true,
  reference: true,
});

export const insertLoveCardSchema = createInsertSchema(loveCards).pick({
  title: true,
  message: true,
  verse: true,
  reference: true,
  imageUrl: true,
  backgroundColor: true,
  textColor: true,
});

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).pick({
  userId: true,
  subject: true,
  content: true,
});

export const insertLibraryCategorySchema = createInsertSchema(libraryCategories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
});

export const insertLibraryContentSchema = createInsertSchema(libraryContent).pick({
  categoryId: true,
  title: true,
  content: true,
  verse: true,
  reference: true,
  externalLink: true,
  contentType: true,
});

export const insertDevotionalAudioSchema = createInsertSchema(devotionalAudios).pick({
  title: true,
  description: true,
  audioUrl: true,
  duration: true,
});

export const insertSponsorSchema = createInsertSchema(sponsors).pick({
  name: true,
  description: true,
  logoUrl: true,
  website: true,
  instagram: true,
  facebook: true,
  whatsapp: true,
  isActive: true,
});

export const insertSponsorAdSchema = createInsertSchema(sponsorAds).pick({
  sponsorId: true,
  title: true,
  message: true,
  imageUrl: true,
  isActive: true,
  priority: true,
});

export const insertContributorSchema = createInsertSchema(contributors).pick({
  name: true,
  email: true,
  description: true,
  profileImageUrl: true,
  contribution: true,
  amount: true,
  isActive: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  actionUrl: true,
  scheduledFor: true,
});

export const insertUserNotificationSettingsSchema = createInsertSchema(userNotificationSettings).pick({
  userId: true,
  dailyDevotional: true,
  prayerReminders: true,
  challengeUpdates: true,
  sponsorContent: true,
  weeklyDigest: true,
  emailNotifications: true,
  pushNotifications: true,
  preferredTime: true,
  timezone: true,
});

export const insertUserInteractionSchema = createInsertSchema(userInteractions).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  sessionId: true,
  deviceType: true,
  userAgent: true,
  ipAddress: true,
  metadata: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  recipientType: true,
  recipientId: true,
  title: true,
  description: true,
  aiGeneratedPrayer: true,
  aiGeneratedVerse: true,
  verseReference: true,
  templateStyle: true,
  backgroundColor: true,
  textColor: true,
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).pick({
  key: true,
  value: true,
  description: true,
  category: true,
  isPublic: true,
});

export const insertStoreProductSchema = createInsertSchema(storeProducts).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  isAffiliate: true,
  affiliateLink: true,
  internalLink: true,
  isActive: true,
  featured: true,
  tags: true,
  stock: true,
});

export const insertYoutubeVideoSchema = createInsertSchema(youtubeVideos).pick({
  youtubeId: true,
  title: true,
  description: true,
  thumbnailUrl: true,
  publishedAt: true,
  duration: true,
  viewCount: true,
  tags: true,
  category: true,
  isFeatured: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type InsertDevotional = z.infer<typeof insertDevotionalSchema>;
export type Devotional = typeof devotionals.$inferSelect;
export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type Prayer = typeof prayers.$inferSelect;

export type InsertEmotion = z.infer<typeof insertEmotionSchema>;
export type Emotion = typeof emotions.$inferSelect;
export type InsertEmotionDevotional = z.infer<typeof insertEmotionDevotionalSchema>;
export type EmotionDevotional = typeof emotionDevotionals.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallengeDay = z.infer<typeof insertChallengeDaySchema>;
export type ChallengeDay = typeof challengeDays.$inferSelect;
export type InsertUserChallengeProgress = z.infer<typeof insertUserChallengeProgressSchema>;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertAIPrayerRequest = z.infer<typeof insertAIPrayerRequestSchema>;
export type AIPrayerRequest = typeof aiPrayerRequests.$inferSelect;
export type InsertLoveCard = z.infer<typeof insertLoveCardSchema>;
export type LoveCard = typeof loveCards.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertLibraryCategory = z.infer<typeof insertLibraryCategorySchema>;
export type LibraryCategory = typeof libraryCategories.$inferSelect;
export type InsertLibraryContent = z.infer<typeof insertLibraryContentSchema>;
export type LibraryContent = typeof libraryContent.$inferSelect;
export type InsertDevotionalAudio = z.infer<typeof insertDevotionalAudioSchema>;
export type DevotionalAudio = typeof devotionalAudios.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsorAd = z.infer<typeof insertSponsorAdSchema>;
export type SponsorAd = typeof sponsorAds.$inferSelect;

export type InsertContributor = z.infer<typeof insertContributorSchema>;
export type Contributor = typeof contributors.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertUserNotificationSettings = z.infer<typeof insertUserNotificationSettingsSchema>;
export type UserNotificationSettings = typeof userNotificationSettings.$inferSelect;
export type InsertUserInteraction = z.infer<typeof insertUserInteractionSchema>;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
export type AppSettings = typeof appSettings.$inferSelect;
export type InsertStoreProduct = z.infer<typeof insertStoreProductSchema>;
export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertYoutubeVideo = z.infer<typeof insertYoutubeVideoSchema>;
export type YoutubeVideo = typeof youtubeVideos.$inferSelect;

// Novos schemas para as funcionalidades solicitadas
export const spiritualPlannerEntry = pgTable("spiritual_planner_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // segunda, terca, quarta, quinta, sexta, sabado, domingo
  prayer: text("prayer"),
  favoriteVerse: text("favorite_verse"),
  spiritualGoal: text("spiritual_goal"),
  gratitude: text("gratitude"),
  specialRequest: text("special_request"),
  date: text("date").notNull(), // YYYY-MM-DD for the week
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userDevotionals = pgTable("user_devotionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  application: text("application").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verseReactions = pgTable("verse_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  verseId: varchar("verse_id").notNull(),
  reaction: text("reaction").notNull(), // "amen"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpiritualPlannerEntrySchema = createInsertSchema(spiritualPlannerEntry).pick({
  userId: true,
  dayOfWeek: true,
  prayer: true,
  favoriteVerse: true,
  spiritualGoal: true,
  gratitude: true,
  specialRequest: true,
  date: true,
});

export const insertUserDevotionalSchema = createInsertSchema(userDevotionals).pick({
  userId: true,
  title: true,
  content: true,
  verse: true,
  reference: true,
  application: true,
  date: true,
});

export const insertVerseReactionSchema = createInsertSchema(verseReactions).pick({
  userId: true,
  verseId: true,
  reaction: true,
});

export type SpiritualPlannerEntry = typeof spiritualPlannerEntry.$inferSelect;
export type InsertSpiritualPlannerEntry = z.infer<typeof insertSpiritualPlannerEntrySchema>;
export type UserDevotional = typeof userDevotionals.$inferSelect;
export type InsertUserDevotional = z.infer<typeof insertUserDevotionalSchema>;
export type VerseReaction = typeof verseReactions.$inferSelect;
export type InsertVerseReaction = z.infer<typeof insertVerseReactionSchema>;


