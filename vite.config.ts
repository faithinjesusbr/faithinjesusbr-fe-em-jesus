import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Diz ao Vite que a raiz do app está em /client
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  build: {
    // Gera o build dentro de client/dist
    outDir: path.resolve(__dirname, 'client/dist'),
    emptyOutDir: true
  },
  server: { port: 5173 },
  preview: { port: 4173 }
})
