/**
 * Route path constants
 */

export const ROUTES = {
	HOME: '/',
	ABOUT: '/about',
	BLOG: '/blog',
	API_DEMO: '/api-demo',
	COMPARISON: '/comparison',
	AI_MANIFESTO: '/ai-manifesto'
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
