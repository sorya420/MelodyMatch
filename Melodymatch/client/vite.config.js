import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', // expose only VITE_ envs
  server: {
    proxy: {
      // '/api': 'http://localhost:8000', // optional dev proxy
    },
  },
  build: {
    outDir: 'dist',
  },
});
