import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import config from './kit.config.js';

export default defineConfig({
  plugins: [sveltekit(config), tailwindcss()],
  server: {
    port: 5173,
  },
});
