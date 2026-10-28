import { defineConfig } from 'vite';

export default defineConfig({
  base: '/a-new-game/',
  build: { rollupOptions: { input: { main: 'index.html', audition: 'audition.html' } } },
});
