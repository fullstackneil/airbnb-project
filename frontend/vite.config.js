import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  // Linting runs as its own step (npm run lint, and in CI).
  plugins: [react()],
  css: {
    modules: {
      // Keep the original class name visible (e.g. "gallery_x1Y2z") so
      // scoped classes are still easy to find in dev tools.
      generateScopedName: "[local]_[hash:base64:5]",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
    // To automatically open the app in the browser whenever the server starts,
    // uncomment the following line:
    // open: true
  }
}));
