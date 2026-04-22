import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/data-mine-simulador/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
