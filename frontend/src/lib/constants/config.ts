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
	scrollPastThreshold: 200, // pixels - threshold for "scrolled past" detection (used in intersection observers)
	intersectionObserver: {
		threshold: 0.2, // 20% visibility (desktop)
		rootMargin: '0px 0px -50px 0px', // desktop
		mobile: {
			threshold: 0.15, // 15% visibility (more lenient for smaller viewports)
			rootMargin: '0px 0px -80px 0px' // larger bottom margin to prevent premature triggers
		}
	},
	touchTarget: {
		min: 44 // pixels - minimum touch target size
	}
} as const;
