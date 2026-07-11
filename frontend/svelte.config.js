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
      // prerendered '/' page. Cloudflare Pages natively serves 200.html for
      // unmatched routes with a 200 status — no _redirects rule needed.
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
