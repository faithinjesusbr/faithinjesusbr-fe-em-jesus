// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, "client"),
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "client/src") },
      { find: "@components", replacement: resolve(__dirname, "client/src/components") },
      { find: "@shared", replacement: resolve(__dirname, "shared") },
      { find: /^\/@\//, replacement: resolve(__dirname, "client/src") + "/" },
    ],
  },
  build: {
    // 👉 o servidor procura por server/public
    outDir: resolve(__dirname, "server/public"),
    emptyOutDir: true,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});
