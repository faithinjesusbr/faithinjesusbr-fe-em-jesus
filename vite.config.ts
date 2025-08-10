import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@components', replacement: path.resolve(__dirname, 'client/src/components') },
      { find: '@shared', replacement: path.resolve(__dirname, 'shared') },
      // pega qualquer import que comece com "/@..."
      { find: /^\/@/, replacement: path.resolve(__dirname, 'client/src') + '/' },
    ],
  },
  build: {
    outDir: path.resolve(__dirname, 'client/dist'),
    emptyOutDir: true,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})
