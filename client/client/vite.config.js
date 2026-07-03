import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // Tailwind v4 via Vite plugin — no tailwind.config.js needed
    ],
    server: {
        port: 5173,
        // Proxy /api requests to the backend during development
        // This avoids CORS issues when running both dev servers simultaneously
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
