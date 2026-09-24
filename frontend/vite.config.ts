import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Vital para GitHub Pages (rutas relativas)
  server: {
    port: 3030,
    host: '0.0.0.0'
  }
});
