// server/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes"; // se no seu projeto for export default, troque para: import registerRoutes from "./routes";

// __dirname em ESM/TSX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check simples
app.get("/health", (_req, res) => res.status(200).send("ok"));

// Rotas da API
try {
  registerRoutes?.(app as any);
} catch (err) {
  console.warn("Não consegui registrar as rotas de ./routes:", err);
}

// Em produção, servir os arquivos do Vite (client/dist)
if (process.env.NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "../client/dist");
  const indexHtml = path.join(distDir, "index.html");

  // arquivos estáticos gerados pelo Vite
  app.use(express.static(distDir));

  // SPA fallback: qualquer rota que não comece com /api volta pro index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(indexHtml);
  });
}

export default app;
