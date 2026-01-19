/**
 * Navigation utilities for handling anchor links and smooth scrolling
 */

import { browser } from '$app/environment';

/**
 * Handles anchor link navigation with smooth scrolling
 * Prevents default anchor behavior and uses scrollIntoView for smooth scrolling
 * that respects CSS scroll-margin-top
 *
 * @param e - Mouse event from click handler
 * @param href - The href value (should start with '/#' for anchor links)
 */
export function handleAnchorNavigation(e: MouseEvent, href: string): void {
	if (!browser) return;

	// Check if it's an anchor link
	if (href.startsWith('/#')) {
		e.preventDefault();
		e.stopPropagation();
		const targetId = href.substring(2); // Remove '/#'
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			// Use scrollIntoView which respects scroll-margin-top automatically
			// The smooth behavior will be slower due to CSS scroll-behavior: smooth
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}
}

/**
 * Scrolls to the top of the page smoothly
 * If already on the home page, scrolls to top. Otherwise navigates to home first.
 *
 * @param e - Mouse event from click handler
 */
export function scrollToTop(e: MouseEvent): void {
	if (!browser) return;

	// Check if we're already on the home page
	if (window.location.pathname === '/') {
		e.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
	// Otherwise, let the default navigation happen (href="/" will navigate)
}
