import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cambia 'mi-apuesta-editorial' si renombras la carpeta
export default defineConfig({
  plugins: [react()],
  base: '/simuladores/mi-apuesta-editorial/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
