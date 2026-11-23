import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Il Caso dell'Orologio Fermo",
        short_name: 'Orologio Fermo',
        description: "Escape Room dell'Avvento per la LIM — Classe 5ª Primaria",
        theme_color: '#0B132B',
        background_color: '#0B132B',
        display: 'fullscreen',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
