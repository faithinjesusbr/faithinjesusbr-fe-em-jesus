import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, loginSchema, insertDevotionalSchema, insertVerseSchema, insertPrayerSchema,
  insertEmotionDevotionalSchema, insertUserChallengeProgressSchema, insertAIPrayerRequestSchema,
  insertLoveCardSchema, insertPrayerRequestSchema, insertLibraryContentSchema, insertDevotionalAudioSchema,
  insertSponsorSchema, insertSponsorAdSchema
} from "@shared/schema";
import { z } from "zod";
import { 
  generateEmotionDevotional, generatePrayerResponse, generatePrayerRequestResponse,
  generateSponsorCertificate, generateChallengeCertificate, generateNightDevotional
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Devotional routes
  app.get("/api/devotionals/daily", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const devotional = await storage.getDailyDevotional(today);
      
      if (!devotional) {
        return res.status(404).json({ message: "Nenhuma devoção encontrada para hoje" });
      }
      
      res.json(devotional);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/devotionals", async (req, res) => {
    try {
      const devotionals = await storage.getAllDevotionals();
      res.json(devotionals);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/devotionals", async (req, res) => {
    try {
      const devotionalData = insertDevotionalSchema.parse(req.body);
      const devotional = await storage.createDevotional(devotionalData);
      res.status(201).json(devotional);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Verse routes
  app.get("/api/verses", async (req, res) => {
    try {
      const verses = await storage.getAllVerses();
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/verses/random", async (req, res) => {
    try {
      const verse = await storage.getRandomVerse();
      
      if (!verse) {
        return res.status(404).json({ message: "Nenhum versículo encontrado" });
      }
      
      res.json(verse);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/verses", async (req, res) => {
    try {
      const verseData = insertVerseSchema.parse(req.body);
      const verse = await storage.createVerse(verseData);
      res.status(201).json(verse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Prayer routes
  app.post("/api/prayers", async (req, res) => {
    try {
      const prayerData = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(prayerData);
      res.status(201).json(prayer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/prayers/stats", async (req, res) => {
    try {
      const stats = await storage.getPrayerStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Stats route for admin
  app.get("/api/stats", async (req, res) => {
    try {
      const devotionals = await storage.getAllDevotionals();
      const verses = await storage.getAllVerses();
      const prayerStats = await storage.getPrayerStats();
      
      const stats = {
        totalUsers: 127, // Mock data as requested in design
        totalPrayers: prayerStats.total,
        versesGenerated: verses.length,
        dailyActive: 45, // Mock data
        totalDevotionals: devotionals.length,
        totalVerses: verses.length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Emotion routes
  app.get("/api/emotions", async (req, res) => {
    try {
      const emotions = await storage.getAllEmotions();
      res.json(emotions);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/emotions/:emotionId/devotional", async (req, res) => {
    try {
      const { emotionId } = req.params;
      const emotions = await storage.getAllEmotions();
      const emotion = emotions.find(e => e.id === emotionId);
      
      if (!emotion) {
        return res.status(404).json({ message: "Emoção não encontrada" });
      }

      // Check if devotional already exists
      let devotional = await storage.getEmotionDevotional(emotionId);
      
      if (!devotional) {
        // Generate new devotional using AI
        const aiDevotional = await generateEmotionDevotional(emotion.name);
        
        const devotionalData = {
          emotionId,
          ...aiDevotional
        };
        
        devotional = await storage.createEmotionDevotional(devotionalData);
      }
      
      res.json(devotional);
    } catch (error) {
      console.error("Error in emotion devotional route:", error);
      res.status(500).json({ message: "Erro ao gerar devocional" });
    }
  });

  // Challenge routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/challenges/:challengeId/days", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const days = await storage.getChallengeDays(challengeId);
      res.json(days);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/challenges/:challengeId/progress/:userId", async (req, res) => {
    try {
      const { challengeId, userId } = req.params;
      const progress = await storage.getUserChallengeProgress(userId, challengeId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/challenges/progress", async (req, res) => {
    try {
      const progressData = insertUserChallengeProgressSchema.parse(req.body);
      const progress = await storage.updateChallengeProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/challenges/:challengeId/certificate", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userName } = req.body;
      
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Desafio não encontrado" });
      }

      const certificate = await generateChallengeCertificate(userName, challenge.title);
      res.json(certificate);
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Erro ao gerar certificado" });
    }
  });

  // AI Prayer Agent routes
  app.post("/api/ai-prayer", async (req, res) => {
    try {
      const { userId, userMessage } = req.body;
      
      if (!userId || !userMessage) {
        return res.status(400).json({ message: "UserId e mensagem são obrigatórios" });
      }

      const aiResponse = await generatePrayerResponse(userMessage);
      
      const requestData = {
        userId,
        userMessage,
        aiResponse: aiResponse.prayer,
        verse: aiResponse.verse,
        reference: aiResponse.reference
      };
      
      const request = await storage.createAIPrayerRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error in AI prayer route:", error);
      res.status(500).json({ message: "Erro ao processar pedido de oração" });
    }
  });

  app.get("/api/ai-prayer/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const requests = await storage.getUserAIPrayerRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Love Cards routes
  app.get("/api/love-cards", async (req, res) => {
    try {
      const cards = await storage.getAllLoveCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Prayer Requests routes
  app.post("/api/prayer-requests", async (req, res) => {
    try {
      const requestData = insertPrayerRequestSchema.parse(req.body);
      const request = await storage.createPrayerRequest(requestData);
      
      // Generate AI response
      try {
        const aiResponse = await generatePrayerRequestResponse(request.subject, request.content);
        await storage.updatePrayerRequest(request.id, {
          aiResponse,
          status: "responded",
          respondedAt: new Date()
        });
      } catch (aiError) {
        console.error("AI response error:", aiError);
      }
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/prayer-requests/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const requests = await storage.getUserPrayerRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Library routes
  app.get("/api/library/categories", async (req, res) => {
    try {
      const categories = await storage.getAllLibraryCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/library/categories/:categoryId/content", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const content = await storage.getLibraryContent(categoryId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Devotional Audio routes
  app.get("/api/devotional-audios", async (req, res) => {
    try {
      const audios = await storage.getAllDevotionalAudios();
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Night Mode Devotional route
  app.get("/api/night-devotional", async (req, res) => {
    try {
      const devotional = await generateNightDevotional();
      res.json(devotional);
    } catch (error) {
      console.error("Error generating night devotional:", error);
      res.status(500).json({ message: "Erro ao gerar devocional noturno" });
    }
  });

  // Sponsor routes
  app.get("/api/sponsors", async (req, res) => {
    try {
      const sponsors = await storage.getAllActiveSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/sponsor-ads", async (req, res) => {
    try {
      const ads = await storage.getActiveSponsorAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/sponsors/:sponsorId/certificate", async (req, res) => {
    try {
      const { sponsorId } = req.params;
      const sponsors = await storage.getAllActiveSponsors();
      const sponsor = sponsors.find(s => s.id === sponsorId);
      
      if (!sponsor) {
        return res.status(404).json({ message: "Patrocinador não encontrado" });
      }

      const certificate = await generateSponsorCertificate(sponsor.name);
      res.json(certificate);
    } catch (error) {
      console.error("Error generating sponsor certificate:", error);
      res.status(500).json({ message: "Erro ao gerar certificado" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
