import path from 'path';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/test/**',
        'src/**/*.d.ts',
        'src/index.tsx',
        'src/logo.svg',
      ],
      // Floor set just below current coverage to catch regressions; ratchet up over time.
      thresholds: {
        statements: 59,
        branches: 43,
        functions: 50,
        lines: 63,
      },
    },
  },
});
