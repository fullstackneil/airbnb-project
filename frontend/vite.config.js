import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Lint during dev/build; tests run ESLint separately (npm run lint).
    mode !== "test" && eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
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
