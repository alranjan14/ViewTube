import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        // Split large, rarely-changing vendor libs into long-cacheable chunks.
        // Vite 8 bundles with rolldown, which requires the function form.
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return;
          if (
            /[/\\]node_modules[/\\](react|react-dom|react-router-dom|react-router|scheduler)[/\\]/.test(
              id
            )
          ) {
            return 'react-vendor';
          }
          if (
            /[/\\]node_modules[/\\](@tanstack|@reduxjs|react-redux|redux|immer|reselect)[/\\]/.test(
              id
            )
          ) {
            return 'data-vendor';
          }
          return;
        },
      },
    },
  },
});
