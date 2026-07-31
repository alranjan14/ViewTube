import { readFileSync } from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
) as { version: string };

export default defineConfig({
  plugins: [react()],
  // Keep the compile-time app version available in the test env too.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
        statements: 63,
        branches: 53,
        functions: 55,
        lines: 66,
      },
    },
  },
});
