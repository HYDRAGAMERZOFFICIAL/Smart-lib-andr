import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { inertiaHelpers } from '@inertiajs/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    inertiaHelpers(),
    react(),
  ],
  server: {
    origin: 'http://localhost:5173',
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
