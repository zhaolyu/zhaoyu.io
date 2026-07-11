import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // SPA mode configuration with adapter-static
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      // 200.html (not index.html) so the SPA fallback doesn't overwrite the
      // prerendered '/' page. Cloudflare Pages does NOT serve 200.html on its
      // own — without a rule it falls back to the prerendered homepage for
      // unmatched routes — so static/_redirects rewrites /* to /200.html.
      fallback: '200.html',
      precompress: false,
      strict: true,
    }),
    // Prerender configuration - pages will be prerendered at build time
    prerender: {
      handleHttpError: 'warn',
      handleUnseenRoutes: 'ignore', // Ignore dynamic routes that weren't found during crawling (they'll be handled client-side)
    },
  },
};

export default config;
