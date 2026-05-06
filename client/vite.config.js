import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api':      { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads':  { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached forever once loaded
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Stripe.js (only needed on checkout)
          'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          // Helmet (SEO, used everywhere but small enough to split)
          'vendor-helmet': ['react-helmet-async'],
        },
      },
    },
  },
});
