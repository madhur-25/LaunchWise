import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// We no longer need to import tailwindcss here

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  // The CSS config block has been completely removed
})