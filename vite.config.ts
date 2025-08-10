import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // o app está dentro de /client
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  resolve: {
    alias: [
      // aliases normais
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@components', replacement: path.resolve(__dirname, 'client/src/components') },
      // 👇 pega QUALQUER import que comece com "/@"
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
