import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/analizador-sesgos-busquedas/',
  build: { outDir: 'dist', emptyOutDir: true },
})
