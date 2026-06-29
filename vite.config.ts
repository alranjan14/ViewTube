import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load *all* env vars (including non-VITE ones) so the dev proxy can read the
  // server-side YouTube key. This key is used only inside the dev server and is
  // never exposed to the client bundle (only VITE_-prefixed vars are inlined).
  const env = loadEnv(mode, process.cwd(), '');
  const youtubeKey = env.YOUTUBE_API_KEY ?? '';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      // Local stand-in for the Vercel BFF functions in `api/`, so `npm run dev`
      // works in live mode without exposing the API key to the browser.
      proxy: {
        '/api/youtube': {
          target: 'https://youtube.googleapis.com',
          changeOrigin: true,
          rewrite: (p) => {
            const [pathname = '', search = ''] = p.split('?');
            const params = new URLSearchParams(search);
            params.delete('key');
            if (youtubeKey) params.set('key', youtubeKey);
            const resource = pathname.replace(/^\/api\/youtube/, '');
            return `/youtube/v3${resource}?${params.toString()}`;
          },
        },
        '/api/suggest': {
          target: 'https://suggestqueries.google.com',
          changeOrigin: true,
          rewrite: (p) => {
            const [, search = ''] = p.split('?');
            const params = new URLSearchParams(search);
            params.set('client', 'firefox');
            params.set('ds', 'yt');
            return `/complete/search?${params.toString()}`;
          },
        },
      },
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
  };
});
