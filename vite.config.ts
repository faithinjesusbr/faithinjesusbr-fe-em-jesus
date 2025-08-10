import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // o app está dentro de /client
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@components': path.resolve(__dirname, 'client/src/components'),
      // captura imports que começam com "/@..."
      '/@': path.resolve(__dirname, 'client/src'),
      '/@components': path.resolve(__dirname, 'client/src/components'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'client/dist'),
    emptyOutDir: true,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})
