import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cambia 'lama-xx' por el nombre de carpeta de tu simulador
export default defineConfig({
  plugins: [react()],
  base: '/simuladores/lama-xx/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
