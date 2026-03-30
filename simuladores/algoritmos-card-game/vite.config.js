import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/algoritmos-card-game/',
  build: { outDir: 'dist', emptyOutDir: true },
})
