import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({
		message: 'Hello from SvelteKit API route!',
		timestamp: new Date().toISOString(),
		framework: 'SvelteKit',
		features: ['SSR', 'API Routes', 'Built-in SPA Mode', 'TypeScript'],
		mode: 'SPA'
	});
};
