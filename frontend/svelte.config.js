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
			fallback: 'index.html', // Required for SPA mode - enables client-side routing
			precompress: false,
			strict: true
		}),
		// Prerender configuration - pages will be prerendered at build time
		prerender: {
			handleHttpError: 'warn',
			handleUnseenRoutes: 'ignore' // Ignore dynamic routes that weren't found during crawling (they'll be handled client-side)
		}
	}
};

export default config;
