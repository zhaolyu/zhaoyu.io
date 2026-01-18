/**
 * Route path constants
 */

export const ROUTES = {
	HOME: '/',
	ABOUT: '/about',
	BLOG: '/blog',
	API_DEMO: '/api-demo',
	COMPARISON: '/comparison'
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
