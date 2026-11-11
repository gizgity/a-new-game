import { defineConfig } from 'vite';

export default defineConfig({
  define: { __HARNESS_REVISION__: JSON.stringify(process.env.GITHUB_SHA || process.env.VITE_REVIEW_REVISION || 'local-unversioned') },
  base: '/a-new-game/',
  build: { rollupOptions: { input: { main: 'index.html', audition: 'audition.html', designHarness: 'design-harness.html' } } },
});
