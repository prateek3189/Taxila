import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: { allow: ['..', '../..'] },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@vital-track/shared-types': path.resolve(workspaceRoot, 'packages/shared-types/src/index.ts'),
      '@vital-track/config': path.resolve(workspaceRoot, 'packages/config/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
