import { Router } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const adminRoutes = Router();

// Middleware para verificar se é admin (daviddkoog@gmail.com)
const requireAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  // Para simplificar, vamos verificar se o email foi enviado no header
  const userEmail = req.headers['x-user-email'];
  
  if (!userEmail || userEmail !== "daviddkoog@gmail.com") {
    return res.status(403).json({ error: "Acesso negado - Apenas administrador" });
  }
  
  next();
};

// Rota para listar todos os usuários (apenas admin)
adminRoutes.get("/users", requireAdmin, async (req, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        whatsapp: users.whatsapp,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    res.json(allUsers);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para estatísticas de usuários (apenas admin)
adminRoutes.get("/users/stats", requireAdmin, async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    
    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(user => user.isActive).length,
      usersWithWhatsApp: allUsers.filter(user => user.whatsapp).length,
      newUsersThisWeek: allUsers.filter(user => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(user.createdAt) > oneWeekAgo;
      }).length
    };

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default adminRoutes;