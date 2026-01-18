/**
 * API endpoint definitions
 */

export const API_ENDPOINTS = {
	test: '/api/test',
	blog: {
		list: '/api/blog',
		detail: (slug: string) => `/api/blog/${slug}`
	}
} as const;
