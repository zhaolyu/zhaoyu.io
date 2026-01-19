/**
 * Application configuration constants
 */

export const APP_CONFIG = {
	name: 'zhaoyu.io',
	description: 'Personal website and learning playground',
	version: '0.0.1'
} as const;

/**
 * Animation and interaction constants
 */
export const ANIMATION_CONFIG = {
	scrollThreshold: {
		nav: 20 // pixels - navbar backdrop blur trigger
	},
	intersectionObserver: {
		threshold: 0.2, // 20% visibility
		rootMargin: '0px 0px -50px 0px'
	},
	touchTarget: {
		min: 44 // pixels - minimum touch target size
	}
} as const;
