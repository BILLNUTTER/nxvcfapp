import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy all /api requests to your Heroku backend
      '/api': {
        target: 'https://nuttervcf-ccc911dbe67f.herokuapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
