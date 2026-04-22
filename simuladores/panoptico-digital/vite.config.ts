import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simuladores/panoptico-digital/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
