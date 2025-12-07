import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: 'Smart-lib-web.test',
    origin: 'http://Smart-lib-web.test:5173',
    hmr: {
      host: 'Smart-lib-web.test',
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },
  build: {
    outDir: 'public/build',
    manifest: true,
  },
});
