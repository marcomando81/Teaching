import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/apps/scuola/escaperoom/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Il Caso dell'Orologio Fermo",
        short_name: 'Orologio Fermo',
        description: "Escape Room dell'Avvento per la LIM — Classe 5ª Primaria",
        id: '/apps/scuola/escaperoom/',
        start_url: '/apps/scuola/escaperoom/',
        scope: '/apps/scuola/escaperoom/',
        theme_color: '#162646',
        background_color: '#162646',
        display: 'fullscreen',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
