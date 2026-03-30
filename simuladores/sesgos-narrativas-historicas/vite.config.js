import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/sesgos-narrativas-historicas/',
  build: { outDir: 'dist', emptyOutDir: true },
})
