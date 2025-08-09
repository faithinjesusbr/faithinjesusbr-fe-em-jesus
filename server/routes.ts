import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, loginSchema, insertDevotionalSchema, insertVerseSchema, insertPrayerSchema,
  insertAIPrayerRequestSchema, insertPrayerRequestSchema, insertUserContributionSchema,
  insertVerseCacheSchema, insertPushSubscriptionSchema, insertNotificationSettingsSchema,
  insertSponsorSchema, insertDailyMissionSchema, insertUserMissionProgressSchema,
  insertSupportNetworkSchema, insertSupportReplySchema, insertFaithPointSchema
} from "@shared/schema";
import { z } from "zod";
import { freeBibleAPIService } from "./free-bible-api-service";
import { freeHuggingFaceAIService } from "./free-huggingface-ai-service";
import { sendPrayerRequest } from "./email-service";
import adminRoutes from "./admin-routes";

// Import AI functions from the advanced AI service
async function generateAssistantResponse(message: string) {
  try {
    // Try to generate AI response using HuggingFace service
    const aiResponse = await freeHuggingFaceAIService.generateResponse(message);
    
    // Get a relevant Bible verse
    const verse = await freeBibleAPIService.getRandomVerse();
    
    return {
      response: aiResponse.response,
      verse: verse.text,
      reference: verse.reference,
      prayer: "Senhor, abençoe nossa conversa e que ela seja para Tua glória. Amém."
    };
  } catch (error) {
    console.error('Erro ao gerar resposta do assistente:', error);
    
    // Fallback response in case of error
    return {
      response: "Que a paz de Cristo esteja contigo! Mesmo que eu não consiga responder perfeitamente agora, saiba que Deus te ama e está sempre contigo.",
      verse: "Porque eu sei os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano, planos de dar esperança e um futuro.",
      reference: "Jeremias 29:11",
      prayer: "Senhor, abençoe nossa conversa e que ela seja para Tua glória. Amém."
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin routes
  app.use("/api/admin", adminRoutes);
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
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Sistema "Sinto Hoje" - Gera devocionais baseados em emoções
  app.post("/api/emotions/generate-devotional", async (req, res) => {
    try {
      const { emotion, intensity = 5, description } = req.body;
      
      if (!emotion) {
        return res.status(400).json({ message: "Emoção é obrigatória" });
      }
      
      console.log(`Gerando devocional para emoção: ${emotion}`);
      
      // Usar serviço gratuito de IA
      const aiResponse = await freeHuggingFaceAIService.generateEmotionalGuidance(emotion, intensity, description);
      const verse = await freeBibleAPIService.getVerseByTheme(emotion);
      
      const devotional = {
        title: `Devocional sobre ${emotion}`,
        content: aiResponse.response,
        verse: verse.text,
        reference: verse.reference,
        prayer: aiResponse.prayer || `Senhor, console nosso coração neste momento de ${emotion}. Amém.`,
        emotion,
        intensity,
        timestamp: new Date().toISOString()
      };
      
      console.log(`Devocional gerado com sucesso: ${devotional.title}`);
      
      res.json(devotional);
    } catch (error) {
      console.error("Erro ao gerar devocional emocional:", error);
      res.status(500).json({ message: "Erro ao gerar devocional" });
    }
  });

  // Sistema simplificado de orientação emocional  
  app.post("/api/emotions/guidance", async (req, res) => {
    try {
      const { emotion, intensity = 5, description } = req.body;
      
      if (!emotion) {
        return res.status(400).json({ message: "Emoção é obrigatória" });
      }
      
      console.log(`Gerando orientação para emoção: ${emotion}, intensidade: ${intensity}`);
      
      // Gerar resposta de IA para a emoção
      const aiGuidance = await freeHuggingFaceAIService.generateEmotionalGuidance(emotion, intensity, description);
      const verse = await freeBibleAPIService.getVerseByTheme(emotion);
      
      console.log(`Orientação gerada com sucesso para ${emotion}`);
      
      res.json({
        emotion,
        intensity,
        description,
        response: aiGuidance.response,
        verse: verse.text,
        reference: verse.reference,
        prayer: `Senhor, Te agradecemos por estar conosco neste momento de ${emotion}. Amém.`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar orientação emocional:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Agente Digital IA Cristo (ATUALIZADO - IA gratuita)
  app.post("/api/ai-prayer", async (req, res) => {
    try {
      const { userId, userMessage } = req.body;
      
      if (!userId || !userMessage) {
        return res.status(400).json({ message: "UserId e userMessage são obrigatórios" });
      }
      
      console.log(`IA Cristo processando: ${userMessage}`);
      
      // Usar serviço gratuito de IA
      const aiResponse = await freeHuggingFaceAIService.generatePrayerResponse(userMessage);
      const dailyVerse = await freeBibleAPIService.getDailyVerse();
      
      const prayerRequest = await storage.createAIPrayerRequest({
        userId,
        userMessage,
        aiResponse: aiResponse.response,
        verse: dailyVerse.text,
        reference: dailyVerse.reference,
      });
      
      console.log(`Resposta gerada com ${aiResponse.confidence} confiança via ${aiResponse.source}`);
      
      res.json(prayerRequest);
    } catch (error) {
      console.error("Erro ao processar oração com IA:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Novo endpoint para assistente IA conversacional
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message, type = 'general' } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Mensagem é obrigatória" });
      }
      
      console.log(`Assistente IA processando: ${message}`);
      
      // Usar serviço gratuito de IA
      const aiResponse = await freeHuggingFaceAIService.generateResponse(message);
      
      // Adicionar versículo relacionado
      const verse = await freeBibleAPIService.getRandomVerse();
      
      res.json({
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        source: aiResponse.source,
        verse: verse.text,
        verseReference: verse.reference,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Erro no assistente IA:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/ai-prayer/:userId", async (req, res) => {
    try {
      const requests = await storage.getUserAIPrayerRequests(req.params.userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Sistema de Versículos Bíblicos (NOVO - APIs 100% gratuitas)
  app.get("/api/verses/daily", async (req, res) => {
    try {
      console.log('🔍 Buscando versículo do dia...');
      const dailyVerse = await freeBibleAPIService.getDailyVerse();
      console.log('✅ Versículo do dia obtido:', dailyVerse.reference);
      res.json(dailyVerse);
    } catch (error) {
      console.error("Erro ao buscar versículo do dia:", error);
      res.status(500).json({ message: "Erro ao buscar versículo do dia" });
    }
  });

  // Novo endpoint para versículo aleatório
  app.get("/api/verses/random", async (req, res) => {
    try {
      console.log('🎲 Buscando versículo aleatório...');
      const randomVerse = await freeBibleAPIService.getRandomVerse();
      console.log('✅ Versículo aleatório obtido:', randomVerse.reference);
      res.json(randomVerse);
    } catch (error) {
      console.error("Erro ao buscar versículo aleatório:", error);
      res.status(500).json({ message: "Erro ao buscar versículo aleatório" });
    }
  });

  // Endpoint para versículo por tema
  app.get("/api/verses/theme/:theme", async (req, res) => {
    try {
      const { theme } = req.params;
      console.log(`🎯 Buscando versículo para tema: ${theme}`);
      const themeVerse = await freeBibleAPIService.getVerseByTheme(theme);
      console.log('✅ Versículo temático obtido:', themeVerse.reference);
      res.json(themeVerse);
    } catch (error) {
      console.error("Erro ao buscar versículo temático:", error);
      res.status(500).json({ message: "Erro ao buscar versículo temático" });
    }
  });

  app.get("/api/verses/new", async (req, res) => {
    try {
      const newVerse = await freeBibleAPIService.getRandomVerse();
      res.json(newVerse);
    } catch (error) {
      console.error("Erro ao buscar novo versículo:", error);
      res.status(500).json({ message: "Erro ao buscar novo versículo" });
    }
  });

  app.get("/api/verses/emotion/:emotion", async (req, res) => {
    try {
      const { emotion } = req.params;
      const emotionVerse = bibleService.getVerseForEmotion(emotion);
      res.json(emotionVerse);
    } catch (error) {
      console.error("Erro ao buscar versículo para emoção:", error);
      res.status(500).json({ message: "Erro ao buscar versículo para emoção" });
    }
  });

  // Sistema de apoio via PIX - Contribuidores (REMOVIDO - duplicado)

  app.get("/api/contributors", async (req, res) => {
    try {
      const contributors = await storage.getAllContributors();
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Cartões de amor
  app.get("/api/love-cards", async (req, res) => {
    try {
      const category = req.query.category as string;
      const cards = category 
        ? await storage.getLoveCardsByCategory(category)
        : await storage.getAllLoveCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/love-cards/generate", async (req, res) => {
    try {
      const { category } = req.body;
      
      const cardData = await generateLoveCard(category);
      
      const card = await storage.createLoveCard({
        title: cardData.title,
        message: cardData.message,
        verse: cardData.verse,
        reference: cardData.reference,
        backgroundColor: cardData.backgroundColor,
        textColor: cardData.textColor,
        category,
        isGenerated: true,
      });
      
      res.json(card);
    } catch (error) {
      console.error("Erro ao gerar cartão de amor:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // E-books da biblioteca
  app.get("/api/ebooks", async (req, res) => {
    try {
      const category = req.query.category as string;
      const ebooks = category 
        ? await storage.getEbooksByCategory(category)
        : await storage.getAllEbooks();
      res.json(ebooks);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/ebooks/:id/download", async (req, res) => {
    try {
      await storage.updateEbookDownloads(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Sistema de pontuação devocional
  app.get("/api/user-points/:userId", async (req, res) => {
    try {
      const points = await storage.getUserPoints(req.params.userId);
      const total = await storage.getUserTotalPoints(req.params.userId);
      res.json({ points, total });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/user-points", async (req, res) => {
    try {
      const data = insertUserPointsSchema.parse(req.body);
      const points = await storage.createUserPoints(data);
      res.json(points);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Certificados
  app.get("/api/certificates/:contributorId", async (req, res) => {
    try {
      const certificates = await storage.getCertificatesForContributor(req.params.contributorId);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Loja virtual
  app.get("/api/store-products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const featured = req.query.featured === "true";
      
      let products;
      if (featured) {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllStoreProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Vídeos do YouTube
  app.get("/api/youtube-videos", async (req, res) => {
    try {
      const category = req.query.category as string;
      const featured = req.query.featured === "true";
      
      let videos;
      if (featured) {
        videos = await storage.getFeaturedVideos();
      } else if (category) {
        videos = await storage.getVideosByCategory(category);
      } else {
        videos = await storage.getAllYoutubeVideos();
      }
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Devotionals
  app.get("/api/devotionals", async (req, res) => {
    try {
      const date = req.query.date as string;
      if (date) {
        const devotional = await storage.getDailyDevotional(date);
        res.json(devotional);
      } else {
        const devotionals = await storage.getAllDevotionals();
        res.json(devotionals);
      }
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/devotionals", async (req, res) => {
    try {
      const data = insertDevotionalSchema.parse(req.body);
      const devotional = await storage.createDevotional(data);
      res.json(devotional);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Versículos
  app.get("/api/verses", async (req, res) => {
    try {
      const random = req.query.random === "true";
      if (random) {
        const verse = await storage.getRandomVerse();
        res.json(verse);
      } else {
        const verses = await storage.getAllVerses();
        res.json(verses);
      }
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Orações
  app.post("/api/prayers", async (req, res) => {
    try {
      const data = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(data);
      
      // Adicionar pontos
      await storage.createUserPoints({
        userId: data.userId,
        points: "2",
        reason: "prayer_submitted",
      });
      
      res.json(prayer);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/prayers/:userId", async (req, res) => {
    try {
      const prayers = await storage.getUserPrayers(req.params.userId);
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Estatísticas de oração
  app.get("/api/prayer-stats", async (req, res) => {
    try {
      const stats = await storage.getPrayerStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Desafios espirituais
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/challenges/:id/days", async (req, res) => {
    try {
      const days = await storage.getChallengeDays(req.params.id);
      res.json(days);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Solicitações de oração
  app.post("/api/prayer-requests", async (req, res) => {
    try {
      const data = insertPrayerRequestSchema.parse(req.body);
      const request = await storage.createPrayerRequest(data);
      
      // Enviar email para faithinjesuseua@gmail.com
      try {
        const user = await storage.getUserById(data.userId);
        await sendPrayerRequest(
          data.subject,
          data.content,
          user?.email,
          user?.name
        );
        console.log('Email de pedido de oração enviado com sucesso');
      } catch (emailError) {
        console.error('Erro ao enviar email do pedido de oração:', emailError);
        // Não falha a requisição se o email não for enviado
      }
      
      res.json(request);
    } catch (error) {
      console.error('Erro no endpoint de pedidos de oração:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Biblioteca
  app.get("/api/library/categories", async (req, res) => {
    try {
      const categories = await storage.getAllLibraryCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/library/content/:categoryId", async (req, res) => {
    try {
      const content = await storage.getLibraryContentByCategory(req.params.categoryId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Patrocinadores
  app.get("/api/sponsors", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const sponsors = active 
        ? await storage.getActiveSponsors()
        : await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Devotional routes
  app.get("/api/devotionals/daily", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let devotional = await storage.getDailyDevotional(today);
      
      // If no devotional found for today, create a fallback using AI and Bible API
      if (!devotional) {
        console.log('📖 Gerando devocional do dia automaticamente...');
        
        const verse = await freeBibleAPIService.getDailyVerse();
        const aiResponse = await freeHuggingFaceAIService.generateResponse(
          `Crie uma reflexão devocional cristã baseada no versículo: ${verse.text} (${verse.reference})`
        );
        
        // Create and save the devotional for today
        const devotionalData = {
          title: `Devocional do Dia - ${new Date().toLocaleDateString('pt-BR')}`,
          content: aiResponse.response,
          verse: verse.text,
          reference: verse.reference,
          date: today,
          audioUrl: "",
          duration: "5 min"
        };
        
        devotional = await storage.createDevotional(devotionalData);
        console.log('✅ Devocional do dia criado:', devotional.title);
      }
      
      res.json(devotional);
    } catch (error) {
      console.error("Erro ao buscar devocional diário:", error);
      
      // Ultimate fallback with a static devotional
      const fallbackDevotional = {
        title: "Devocional do Dia",
        content: "Que este dia seja abençoado pelo Senhor. Lembre-se de que Ele tem planos de bem para sua vida e está sempre ao seu lado em cada momento.",
        verse: "Porque eu sei os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar esperança e um futuro.",
        reference: "Jeremias 29:11",
        date: new Date().toISOString().split('T')[0],
        audioUrl: "",
        duration: "3 min"
      };
      
      res.json(fallbackDevotional);
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

  // REMOVIDO - Endpoint duplicado, usar /api/emotions/generate-devotional

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

  // AI Prayer Agent routes - REMOVED DUPLICATE

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
      const content = await storage.getLibraryContentByCategory(categoryId);
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
      const sponsors = await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/sponsor-ads", async (req, res) => {
    try {
      const ads = await storage.getActiveSponsorAds();
      res.json(ads || []);
    } catch (error) {
      console.error("Error fetching sponsor ads:", error);
      res.json([]); // Return empty array instead of error for UI stability
    }
  });

  app.get("/api/prayer-requests/recent", async (req, res) => {
    try {
      console.log("Fetching recent prayer requests...");
      const requests = await storage.getRecentPrayerRequests(5);
      console.log("Recent prayer requests:", requests);
      res.json(requests || []);
    } catch (error) {
      console.error("Error fetching recent prayer requests:", error);
      res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
  });

  app.post("/api/sponsors/:sponsorId/certificate", async (req, res) => {
    try {
      const { sponsorId } = req.params;
      const sponsors = await storage.getAllSponsors();
      const sponsor = sponsors.find(s => s.id === sponsorId);
      
      if (!sponsor) {
        return res.status(404).json({ message: "Patrocinador não encontrado" });
      }

      const certificate = await generateSponsorCertificate(sponsor.name);
      
      // Criar certificado no banco de dados
      const certificateData = await storage.createCertificate({
        recipientType: "sponsor",
        recipientId: sponsorId,
        title: certificate.title,
        description: certificate.certificateText,
        aiGeneratedPrayer: certificate.prayer,
        aiGeneratedVerse: certificate.verse,
        verseReference: certificate.reference,
      });
      
      res.json(certificateData);
    } catch (error) {
      console.error("Error generating sponsor certificate:", error);
      res.status(500).json({ message: "Erro ao gerar certificado" });
    }
  });

  // Contributor routes (Novas funcionalidades)
  app.get("/api/contributors", async (req, res) => {
    try {
      const contributors = await storage.getAllContributors();
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/contributors", async (req, res) => {
    try {
      const { name, email, donationAmount, contributionType, specialMessage } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: "Nome e email são obrigatórios" });
      }

      console.log(`🙏 Processando pedido de colaborador: ${name}...`);

      // Initialize variables for fallback
      let aiResponse = null;
      let verse = null;
      
      try {
        // Try to generate AI response and get verse
        console.log('🤖 Gerando oração personalizada...');
        aiResponse = await freeHuggingFaceAIService.generatePrayerResponse(`Oração de gratidão para ${name} que contribuiu com nossa missão`);
        console.log('✅ Oração IA gerada');
        
        console.log('📖 Buscando versículo temático...');
        verse = await freeBibleAPIService.getVerseByTheme("gratidão");
        console.log('✅ Versículo obtido:', verse.reference);
        
      } catch (aiError) {
        console.warn('⚠️ Erro na geração de IA, usando fallback:', aiError.message);
        
        // Fallback AI response and verse
        aiResponse = {
          response: `Senhor, abençoe abundantemente a vida de ${name}. Que Sua paz e alegria estejam sempre presentes em seu coração. Que cada dia seja uma nova oportunidade de crescer em fé e amor. Obrigado por sua generosidade e por contribuir com nossa missão. Em nome de Jesus, amém.`
        };
        
        verse = {
          text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
          reference: "1 Tessalonicenses 5:18"
        };
      }
      
      // Criar dados do colaborador para salvar no banco
      const contributorData = {
        name: name.trim(),
        email: email.trim(),
        donationAmount: donationAmount || "50",
        contributionType: contributionType || "donation",
        specialMessage: specialMessage || "Gratidão a Deus",
        certificateUrl: "",
        specialVerse: verse.text,
        verseReference: verse.reference,
        isActive: true,
      };

      console.log('💾 Salvando colaborador no banco...');
      const savedContributor = await storage.createContributor(contributorData);

      console.log(`✅ Colaborador salvo no banco: ${savedContributor.id}`);
      
      // Verificar se foi realmente salvo
      const allContributors = await storage.getAllContributors();
      console.log(`📊 Total de colaboradores no banco: ${allContributors.length}`);
      
      const certificate = {
        title: "Certificado de Gratidão",
        description: `Reconhecemos com gratidão a valiosa contribuição de ${name} em nossa missão de espalhar a Palavra de Deus. Que Deus continue abençoando abundantemente sua vida e ministério.`,
        aiGeneratedPrayer: aiResponse.response,
        aiGeneratedVerse: verse.text,
        verseReference: verse.reference
      };
      
      console.log('✅ Certificado preparado para envio');
      
      res.json({
        contributor: savedContributor,
        certificate,
        message: "Colaborador cadastrado e certificado gerado com sucesso!"
      });
    } catch (error) {
      console.error('❌ Erro crítico ao criar colaborador:', error);
      res.status(500).json({ 
        message: "Erro interno do servidor", 
        details: error.message || "Erro desconhecido",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.post("/api/contributors/:contributorId/certificate", async (req, res) => {
    try {
      const { contributorId } = req.params;
      const contributors = await storage.getAllContributors();
      const contributor = contributors.find(c => c.id === contributorId);
      
      if (!contributor) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }

      const certificate = await generateContributorCertificate(
        contributor.name, 
        contributor.contribution, 
        contributor.amount
      );
      
      // Criar certificado no banco de dados
      const certificateData = await storage.createCertificate({
        recipientType: "contributor",
        recipientId: contributorId,
        title: certificate.title,
        description: certificate.certificateText,
        aiGeneratedPrayer: certificate.prayer,
        aiGeneratedVerse: certificate.verse,
        verseReference: certificate.reference,
      });
      
      res.json(certificateData);
    } catch (error) {
      console.error("Error generating contributor certificate:", error);
      res.status(500).json({ message: "Erro ao gerar certificado" });
    }
  });

  // Notification routes (Sistema de notificações)
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.patch("/api/notifications/:notificationId/read", async (req, res) => {
    try {
      const { notificationId } = req.params;
      const success = await storage.markNotificationAsRead(notificationId);
      if (!success) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    try {
      const { userId } = req.params;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // User Notification Settings routes
  app.get("/api/users/:userId/notification-settings", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getUserNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/users/:userId/notification-settings", async (req, res) => {
    try {
      const { userId } = req.params;
      const settingsData = insertUserNotificationSettingsSchema.parse(req.body);
      const settings = await storage.updateUserNotificationSettings(userId, settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // User Interaction tracking (Analytics)
  app.post("/api/interactions", async (req, res) => {
    try {
      const interactionData = insertUserInteractionSchema.parse(req.body);
      const interaction = await storage.trackUserInteraction(interactionData);
      res.status(201).json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/interaction-stats", async (req, res) => {
    try {
      const { entityType, startDate, endDate } = req.query;
      const stats = await storage.getInteractionStats(
        entityType as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Certificate routes
  app.get("/api/certificates/:recipientType/:recipientId", async (req, res) => {
    try {
      const { recipientType, recipientId } = req.params;
      const certificates = await storage.getCertificatesForRecipient(recipientType, recipientId);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // App Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getPublicSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({ message: "Configuração não encontrada" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/admin/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const setting = await storage.updateSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin Dashboard routes
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      const dashboardData = await storage.getAdminDashboardData();
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Criar sponsor route (admin)
  app.post("/api/admin/sponsors", async (req, res) => {
    try {
      const sponsorData = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.createSponsor(sponsorData);
      
      // Gerar oração e versículo exclusivos para o patrocinador
      try {
        const exclusive = await generateExclusivePrayerAndVerse(
          sponsor.name, 
          'sponsor', 
          sponsor.description
        );
        
        // Aqui você poderia salvar na tabela do sponsor se tiver esses campos
        // await storage.updateSponsor(sponsor.id, { exclusivePrayer: exclusive.prayer, ... });
      } catch (aiError) {
        console.error("Error generating exclusive content for sponsor:", aiError);
      }
      
      res.status(201).json(sponsor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Criar sponsor ad route (admin)
  app.post("/api/admin/sponsor-ads", async (req, res) => {
    try {
      const adData = insertSponsorAdSchema.parse(req.body);
      const ad = await storage.createSponsorAd(adData);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Store Products routes
  app.get("/api/store/products", async (req, res) => {
    try {
      const products = await storage.getActiveStoreProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/store/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedStoreProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/admin/store/products", async (req, res) => {
    try {
      const productData = insertStoreProductSchema.parse(req.body);
      const product = await storage.createStoreProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.patch("/api/admin/store/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const product = await storage.updateStoreProduct(id, updates);
      
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/admin/store/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteStoreProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // YouTube Videos routes
  app.get("/api/youtube/videos", async (req, res) => {
    try {
      const videos = await storage.getAllYoutubeVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/youtube/videos/featured", async (req, res) => {
    try {
      const videos = await storage.getFeaturedYoutubeVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/admin/youtube/videos", async (req, res) => {
    try {
      const videoData = insertYoutubeVideoSchema.parse(req.body);
      const video = await storage.createYoutubeVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/admin/youtube/sync", async (req, res) => {
    try {
      const videos = req.body.videos;
      const syncedVideos = await storage.syncYoutubeVideos(videos);
      res.json({ 
        message: `${syncedVideos.length} vídeos sincronizados com sucesso`,
        videos: syncedVideos 
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.patch("/api/admin/youtube/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const video = await storage.updateYoutubeVideo(id, updates);
      
      if (!video) {
        return res.status(404).json({ message: "Vídeo não encontrado" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markNotificationAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      
      res.json({ message: "Notificação marcada como lida" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // User Devotional routes (Core Features)
  app.get("/api/user-devotionals/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      const devotional = await storage.getUserDevotionalByDate(userId, date);
      res.json(devotional);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/user-devotionals/generate", async (req, res) => {
    try {
      const { userId, date } = req.body;
      
      // Gerar devocional com IA
      const aiDevotional = await generateDailyDevotional(userId);
      
      // Salvar no banco
      const devotional = await storage.createUserDevotional({
        userId,
        date,
        title: aiDevotional.title,
        content: aiDevotional.content,
        verse: aiDevotional.verse,
        reference: aiDevotional.reference,
        application: aiDevotional.application
      });
      
      res.json(devotional);
    } catch (error) {
      console.error("Error generating devotional:", error);
      res.status(500).json({ message: "Erro ao gerar devocional" });
    }
  });

  // Verse reactions
  app.get("/api/verse-reactions/:userId/:verseId", async (req, res) => {
    try {
      const { userId, verseId } = req.params;
      const reaction = await storage.getUserVerseReaction(userId, verseId);
      res.json(!!reaction);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/verse-reactions", async (req, res) => {
    try {
      const reactionData = insertVerseReactionSchema.parse(req.body);
      const reaction = await storage.createVerseReaction(reactionData);
      res.json(reaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // AI Prayer routes with OpenAI integration - REMOVED DUPLICATE

  // Contributors routes with AI certificate generation (REMOVIDO - usar a versão mais simples da linha 926)

  app.get("/api/contributors/:id/certificate", async (req, res) => {
    try {
      const { id } = req.params;
      const contributor = await storage.getContributorById(id);
      
      if (!contributor) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }

      const { generateCertificateContent } = await import('./ai-service');
      const certificate = await generateCertificateContent(
        contributor.name, 
        contributor.contributionType || 'donation'
      );

      res.json(certificate);
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Emotion-based devotionals with AI
  app.post("/api/emotion-devotionals", async (req, res) => {
    try {
      const { emotion } = req.body;
      
      if (!emotion) {
        return res.status(400).json({ message: "Emoção é obrigatória" });
      }

      const { generateDevotional } = await import('./ai-service');
      const devotional = await generateDevotional(emotion);
      
      res.json(devotional);
    } catch (error) {
      console.error('Erro ao gerar devocional:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Digital Assistant route
  app.post("/api/digital-assistant", async (req, res) => {
    try {
      console.log('📨 Recebida mensagem para assistente digital:', req.body);
      
      const { userId, message } = req.body;
      
      if (!message) {
        console.log('❌ Mensagem não fornecida');
        return res.status(400).json({ message: "Mensagem é obrigatória" });
      }

      console.log('🤖 Gerando resposta do assistente...');
      const response = await generateAssistantResponse(message);
      console.log('✅ Resposta gerada:', response);
      
      // Save interaction for analytics (simplified - skip if fails)
      if (userId) {
        try {
          await storage.createUserInteraction({
            userId,
            action: "digital_assistant_chat",
            entityType: "assistant",
            entityId: "digital_assistant"
          });
        } catch (interactionError) {
          console.log('⚠️ Erro ao salvar interação (ignorado):', interactionError.message);
        }
      }
      
      res.json(response);
    } catch (error) {
      console.error('❌ Erro no assistente digital:', error);
      res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
  });

  // Spiritual Planner routes
  app.get("/api/spiritual-planner/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      const entries = await storage.getSpiritualPlannerEntries(userId, date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/spiritual-planner", async (req, res) => {
    try {
      const plannerData = insertSpiritualPlannerEntrySchema.parse(req.body);
      const entry = await storage.createOrUpdateSpiritualPlannerEntry(plannerData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Challenge Progress routes
  app.get("/api/challenge-progress/:userId/:challengeId", async (req, res) => {
    try {
      const { userId, challengeId } = req.params;
      const progress = await storage.getChallengeProgress(userId, challengeId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/challenge-progress", async (req, res) => {
    try {
      const progressData = insertUserChallengeProgressSchema.parse(req.body);
      const progress = await storage.createChallengeProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // AI Prayer Agent routes
  app.post("/api/ai-prayer/generate", async (req, res) => {
    try {
      const { userId, userMessage } = req.body;
      
      // Gerar oração personalizada com IA
      const aiPrayer = await generatePersonalizedPrayer(userMessage);
      
      // Salvar interação no banco
      const interaction = await storage.trackUserInteraction({
        userId,
        interactionType: "prayer_request",
        userMessage,
        aiResponse: aiPrayer.prayer,
        additionalData: JSON.stringify({
          verse: aiPrayer.verse,
          reference: aiPrayer.reference
        })
      });
      
      res.json({
        aiResponse: aiPrayer.prayer,
        verse: aiPrayer.verse,
        reference: aiPrayer.reference,
        interaction
      });
    } catch (error) {
      console.error("Error generating AI prayer:", error);
      res.status(500).json({ message: "Erro ao gerar oração" });
    }
  });

  // ============ ADMIN ROUTES - PROTECTED ============
  
  // Middleware to check admin permissions
  const isAdmin = (req: any, res: any, next: any) => {
    // In a real app, you'd validate JWT or session
    // For now, we'll assume the client sends user info in headers
    const isAdminUser = req.headers['x-user-admin'] === 'true';
    if (!isAdminUser) {
      return res.status(403).json({ message: "Acesso negado - apenas administradores" });
    }
    next();
  };

  // Admin Dashboard Stats
  app.get("/api/admin/dashboard", isAdmin, async (req, res) => {
    try {
      const [totalUsers, totalPrayers, totalDevotionals, activeSponsors] = await Promise.all([
        storage.getAllUsers().then(users => users.length),
        storage.getAllPrayers().then(prayers => prayers.length),
        storage.getAllDevotionals().then(devotionals => devotionals.length),
        storage.getActiveSponsors().then(sponsors => sponsors.length)
      ]);

      res.json({
        totalUsers,
        totalPrayers,
        totalDevotionals,
        activeSponsors,
        recentInteractions: []
      });
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin - Manage Devotionals
  app.get("/api/admin/devotionals", isAdmin, async (req, res) => {
    try {
      const devotionals = await storage.getAllDevotionals();
      res.json(devotionals);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/admin/devotionals/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertDevotionalSchema.partial().parse(req.body);
      const devotional = await storage.updateDevotional(id, updateData);
      res.json(devotional);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/admin/devotionals/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteDevotional(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin - Manage Verses
  app.get("/api/admin/verses", isAdmin, async (req, res) => {
    try {
      const verses = await storage.getAllVerses();
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/admin/verses/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertVerseSchema.partial().parse(req.body);
      const verse = await storage.updateVerse(id, updateData);
      res.json(verse);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/admin/verses/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteVerse(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin - Manage Users
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin - Manage Sponsors
  app.get("/api/admin/sponsors", isAdmin, async (req, res) => {
    try {
      const sponsors = await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/admin/sponsors", isAdmin, async (req, res) => {
    try {
      const sponsorData = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.createContributor(sponsorData);
      res.json(sponsor);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/admin/sponsors/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertSponsorSchema.partial().parse(req.body);
      const sponsor = await storage.updateSponsor(id, updateData);
      res.json(sponsor);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/admin/sponsors/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteSponsor(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ USER CONTRIBUTIONS SYSTEM ============
  
  // Get all contributions (for admin)
  app.get("/api/admin/contributions", isAdmin, async (req, res) => {
    try {
      const contributions = await storage.getAllUserContributions();
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Update contribution status (admin response)
  app.put("/api/admin/contributions/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminResponse } = req.body;
      
      const updateData: any = { status };
      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.respondedAt = new Date();
      }
      
      const contribution = await storage.updateUserContribution(id, updateData);
      res.json(contribution);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Create user contribution
  app.post("/api/contributions", async (req, res) => {
    try {
      const contributionData = insertUserContributionSchema.parse(req.body);
      const contribution = await storage.createUserContribution(contributionData);
      res.json(contribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user contributions
  app.get("/api/contributions/:userId", async (req, res) => {
    try {
      const contributions = await storage.getUserContributions(req.params.userId);
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ OFFLINE CACHE SYSTEM ============
  
  // Get cached verse
  app.get("/api/verse-cache/:date", async (req, res) => {
    try {
      const cached = await storage.getCachedVerse(req.params.date);
      res.json(cached);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Set verse cache
  app.post("/api/verse-cache", async (req, res) => {
    try {
      const cacheData = insertVerseCacheSchema.parse(req.body);
      const cached = await storage.setCachedVerse(cacheData);
      res.json(cached);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ PUSH NOTIFICATIONS SYSTEM ============
  
  // Subscribe to push notifications
  app.post("/api/push-subscribe", async (req, res) => {
    try {
      const subscriptionData = insertPushSubscriptionSchema.parse(req.body);
      const subscription = await storage.createPushSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user push subscriptions
  app.get("/api/push-subscriptions/:userId", async (req, res) => {
    try {
      const subscriptions = await storage.getUserPushSubscriptions(req.params.userId);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Unsubscribe from push notifications
  app.delete("/api/push-subscribe/:id", async (req, res) => {
    try {
      await storage.deletePushSubscription(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Send push notification (admin only)
  app.post("/api/admin/send-notification", isAdmin, async (req, res) => {
    try {
      const { title, message, userId } = req.body;
      
      // Get user's push subscriptions
      const subscriptions = await storage.getUserPushSubscriptions(userId);
      
      // In a real implementation, you would send push notifications here
      // For now, we'll just log the notification
      console.log(`Sending notification: ${title} - ${message} to ${subscriptions.length} devices`);
      
      res.json({ 
        success: true, 
        message: `Notificação enviada para ${subscriptions.length} dispositivos` 
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ NOTIFICATION SETTINGS ============
  
  // Get user notification settings
  app.get("/api/notification-settings/:userId", async (req, res) => {
    try {
      const settings = await storage.getUserNotificationSettings(req.params.userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Update notification settings
  app.post("/api/notification-settings", async (req, res) => {
    try {
      const settingsData = insertNotificationSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ MISSÃO DO DIA - DAILY MISSIONS ============
  
  // Get today's mission
  app.get("/api/daily-mission/today", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let mission = await storage.getDailyMission(today);
      
      // If no mission for today, create a new one
      if (!mission) {
        const missions = [
          {
            title: "Oração pela Manhã",
            description: "Comece seu dia orando por 5 minutos e entregando suas preocupações a Deus",
            type: "prayer",
            reward: "star",
            points: "10",
            verse: "Pela manhã, Senhor, tu ouves a minha voz; pela manhã te faço a minha oração e aguardo com esperança.",
            reference: "Salmos 5:3"
          },
          {
            title: "Compartilhe um Versículo",
            description: "Compartilhe um versículo bíblico inspirador com alguém hoje",
            type: "share_verse",
            reward: "heart",
            points: "15",
            verse: "A palavra de Deus é viva, eficaz e mais cortante que qualquer espada de dois gumes.",
            reference: "Hebreus 4:12"
          },
          {
            title: "Ajude Alguém",
            description: "Pratique o amor de Cristo ajudando alguém necessitado hoje",
            type: "help_someone", 
            reward: "crown",
            points: "20",
            verse: "Levem os fardos pesados uns dos outros e, assim, cumpram a lei de Cristo.",
            reference: "Gálatas 6:2"
          }
        ];
        
        const randomMission = missions[Math.floor(Math.random() * missions.length)];
        mission = await storage.createDailyMission({
          date: today,
          ...randomMission
        });
      }
      
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user's mission progress for today
  app.get("/api/daily-mission/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const today = new Date().toISOString().split('T')[0];
      const mission = await storage.getDailyMission(today);
      
      if (!mission) {
        return res.json({ progress: null, mission: null });
      }
      
      const progress = await storage.getUserMissionProgress(userId, mission.id);
      res.json({ progress, mission });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Complete a mission
  app.post("/api/daily-mission/complete", async (req, res) => {
    try {
      const { userId, missionId } = req.body;
      
      // Check if mission progress exists
      let progress = await storage.getUserMissionProgress(userId, missionId);
      
      if (!progress) {
        // Create progress entry
        progress = await storage.createUserMissionProgress({
          userId,
          missionId,
          completed: true,
          pointsEarned: "0",
          rewardEarned: ""
        });
      }
      
      // Mark as completed
      progress = await storage.completeMission(userId, missionId);
      
      // Get mission details for points and reward
      const mission = await storage.getDailyMission(new Date().toISOString().split('T')[0]);
      if (mission) {
        // Add faith points
        await storage.addFaithPoints({
          userId,
          action: "complete_mission",
          points: mission.points || "10",
          description: `Missão completada: ${mission.title}`,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user's completed missions
  app.get("/api/daily-mission/completed/:userId", async (req, res) => {
    try {
      const missions = await storage.getUserCompletedMissions(req.params.userId);
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ REDE DE APOIO - SUPPORT NETWORK ============
  
  // Get all support requests
  app.get("/api/support-network", async (req, res) => {
    try {
      const requests = await storage.getAllSupportRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Create support request
  app.post("/api/support-network", async (req, res) => {
    try {
      const requestData = insertSupportNetworkSchema.parse(req.body);
      const request = await storage.createSupportRequest(requestData);
      
      // Add faith points for creating support request
      await storage.addFaithPoints({
        userId: request.userId,
        action: "create_support_request",
        points: "5",
        description: "Pedido de apoio criado",
        date: new Date().toISOString().split('T')[0]
      });
      
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get support request with replies
  app.get("/api/support-network/:id", async (req, res) => {
    try {
      const request = await storage.getSupportRequest(req.params.id);
      const replies = await storage.getSupportReplies(req.params.id);
      res.json({ request, replies });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Create support reply
  app.post("/api/support-network/:id/reply", async (req, res) => {
    try {
      const replyData = insertSupportReplySchema.parse({
        ...req.body,
        supportId: req.params.id
      });
      
      const reply = await storage.createSupportReply(replyData);
      
      // Add faith points for sending support
      await storage.addFaithPoints({
        userId: reply.userId,
        action: "send_support",
        points: "10",
        description: "Mensagem de apoio enviada",
        date: new Date().toISOString().split('T')[0]
      });
      
      res.json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user's support requests
  app.get("/api/support-network/user/:userId", async (req, res) => {
    try {
      const requests = await storage.getUserSupportRequests(req.params.userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ============ FÉ EM AÇÃO - FAITH POINTS SYSTEM ============
  
  // Get user's faith points history
  app.get("/api/faith-points/:userId", async (req, res) => {
    try {
      const points = await storage.getUserFaithPoints(req.params.userId);
      res.json(points);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user's total points
  app.get("/api/faith-points/total/:userId", async (req, res) => {
    try {
      const total = await storage.getUserTotalPoints(req.params.userId);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Add faith points (manual - for testing)
  app.post("/api/faith-points", async (req, res) => {
    try {
      const pointsData = insertFaithPointSchema.parse(req.body);
      const points = await storage.addFaithPoints(pointsData);
      res.json(points);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get current week's ranking
  app.get("/api/faith-points/ranking/current", async (req, res) => {
    try {
      const ranking = await storage.getCurrentWeekRanking();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get ranking for specific week
  app.get("/api/faith-points/ranking/:weekStart", async (req, res) => {
    try {
      const ranking = await storage.getWeeklyRanking(req.params.weekStart);
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Update weekly ranking (admin or cron job)
  app.post("/api/faith-points/ranking/update", async (req, res) => {
    try {
      const { userId, weekStart, weekEnd } = req.body;
      await storage.updateWeeklyRanking(userId, weekStart, weekEnd);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
