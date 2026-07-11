import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Under Vitest the full sveltekit() plugin can't run (no kit dev server),
  // but the plain svelte plugin is needed to compile runes ($state/$derived)
  // in .svelte.ts modules like db.svelte.ts / simulator.svelte.ts.
  plugins: process.env.VITEST ? [svelte()] : [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    // 'browser' condition so svelte resolves its client runtime (reactive
    // $state/$derived) instead of the SSR build inside jsdom tests.
    conditions: ['browser'],
    alias: {
      $lib: path.resolve(__dirname, './src/lib'),
      '$app/environment': path.resolve(__dirname, './src/app.d.ts'),
    },
  },
});
