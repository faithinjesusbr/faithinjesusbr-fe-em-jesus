// server/start.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./index"; // importa o app criado no server/index.ts

// __dirname em ESM/TS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir o build do Vite (frontend)
const distDir = path.join(__dirname, "../client/dist");
app.use(express.static(distDir));

// SPA fallback: tudo que NÃO começar com /api volta o index.html
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
