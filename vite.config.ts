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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@components': path.resolve(__dirname, 'client/src/components'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'client/dist'),
    emptyOutDir: true,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})
