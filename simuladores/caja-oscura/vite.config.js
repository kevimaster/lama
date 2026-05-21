import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/caja-oscura/',
  build: { outDir: 'dist', emptyOutDir: true },
})
