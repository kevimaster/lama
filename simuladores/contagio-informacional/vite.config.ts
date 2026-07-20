import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cambia 'contagio-informacional' si renombras la carpeta
export default defineConfig({
  plugins: [react()],
  base: '/simuladores/contagio-informacional/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
