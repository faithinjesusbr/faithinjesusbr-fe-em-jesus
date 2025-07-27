import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertDevotionalSchema, insertVerseSchema, insertPrayerSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
