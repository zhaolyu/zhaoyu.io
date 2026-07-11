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
      // 404.html (not index.html) so the SPA fallback doesn't overwrite the
      // prerendered '/' page. Cloudflare Pages natively serves 404.html for
      // unmatched paths (with a correct 404 status), so no _redirects rule is
      // needed — a /* -> /200.html rewrite loops, because Pages 308-redirects
      // *.html URLs to their extensionless form, which matches /* again.
      fallback: '404.html',
      precompress: false,
      strict: true,
    }),
    // Prerender configuration - pages will be prerendered at build time
    prerender: {
      handleHttpError: 'warn',
      handleUnseenRoutes: 'ignore', // Ignore dynamic routes that weren't found during crawling (they'll be handled client-side)
    },
    // Content Security Policy — injected as a <meta> tag on prerendered pages.
    // mode 'hash' lets SvelteKit hash its own per-page inline hydration script;
    // the extra sha256 below is the inline theme-init script in app.html
    // (recompute if that script changes: sha256+base64 of the exact tag body).
    // frame-ancestors can't be set via <meta>, so it lives in static/_headers.
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': [
          'self',
          'wasm-unsafe-eval', // PGlite (WASM Postgres) on /infra
          'sha256-OeL7jzJbFrONBWQFnrqtx6SxmNiAoG1JvmtdhwveVDw=', // app.html theme script
        ],
        'style-src': ['self', 'unsafe-inline'], // inline style attrs + Svelte transition styles
        'img-src': ['self', 'data:'], // data: for inline SVG noise/grain textures
        'font-src': ['self', 'data:'], // Vite inlines small font subsets as data: URIs
        'connect-src': [
          'self',
          'https://ingestion-api-240dd81-538316597788.us-central1.run.app', // ElectricSQL sync
        ],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self'],
      },
    },
  },
};

export default config;
