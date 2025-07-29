import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, loginSchema, insertDevotionalSchema, insertVerseSchema, insertPrayerSchema,
  insertAIPrayerRequestSchema, insertPrayerRequestSchema
} from "@shared/schema";
import { z } from "zod";
import { freeBibleAPIService } from "./free-bible-api-service";
import { freeHuggingFaceAIService } from "./free-huggingface-ai-service";

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

  // Rotas básicas sem dependências externas
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
      res.json(devotional);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/verses", async (req, res) => {
    try {
      const verses = await storage.getAllVerses();
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/verses", async (req, res) => {
    try {
      const verseData = insertVerseSchema.parse(req.body);
      const verse = await storage.createVerse(verseData);
      res.json(verse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/prayers", async (req, res) => {
    try {
      const prayers = await storage.getAllPrayers();
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/prayers", async (req, res) => {
    try {
      const prayerData = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(prayerData);
      res.json(prayer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Prayer Requests
  app.get("/api/prayer-requests", async (req, res) => {
    try {
      const prayerRequests = await storage.getAllPrayerRequests();
      res.json(prayerRequests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/prayer-requests", async (req, res) => {
    try {
      const prayerRequestData = insertPrayerRequestSchema.parse(req.body);
      const prayerRequest = await storage.createPrayerRequest(prayerRequestData);
      res.json(prayerRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/prayer-requests/:userId", async (req, res) => {
    try {
      const prayerRequests = await storage.getUserPrayerRequests(req.params.userId);
      res.json(prayerRequests);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}