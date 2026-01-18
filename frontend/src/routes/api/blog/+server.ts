import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Blog API endpoint
 * Placeholder for future blog functionality
 */
export const GET: RequestHandler = async () => {
	// TODO: Implement blog listing
	return json({
		posts: [],
		message: 'Blog API endpoint - coming soon'
	});
};
