import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy is CRITICAL for development.
    // It tells Vite to forward any requests to '/api'
    // to your backend server running on port 3001.
    // This avoids CORS errors.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
