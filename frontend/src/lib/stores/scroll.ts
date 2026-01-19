/**
 * Scroll position store for centralized scroll tracking
 * Provides reactive scroll position and derived scroll state
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { ANIMATION_CONFIG } from '$lib/constants/config';

// Internal store for scrollY position
const scrollYStore = writable<number>(0);

// Initialize scroll position if in browser
if (browser) {
	scrollYStore.set(window.scrollY);

	// Listen to scroll events and update store
	const handleScroll = () => {
		scrollYStore.set(window.scrollY);
	};

	// Use passive listener for better performance
	window.addEventListener('scroll', handleScroll, { passive: true });
}

// Derived store for isScrolled state with hysteresis to prevent rapid toggling
// This prevents the navbar from flickering when scroll position is exactly at the threshold
const isScrolledStore = writable<boolean>(false);

if (browser) {
	let lastScrollY = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	
	const updateIsScrolled = () => {
		const currentScrollY = window.scrollY;
		const threshold = ANIMATION_CONFIG.scrollThreshold.nav;
		
		// Use hysteresis: different thresholds for scrolling up vs down
		// This prevents rapid toggling at the exact threshold position
		if (currentScrollY > lastScrollY) {
			// Scrolling down - use higher threshold
			isScrolledStore.set(currentScrollY > threshold + 5);
		} else {
			// Scrolling up - use lower threshold
			isScrolledStore.set(currentScrollY > threshold - 5);
		}
		
		lastScrollY = currentScrollY;
	};
	
	// Debounce updates slightly to prevent rapid state changes
	const debouncedUpdate = () => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(updateIsScrolled, 10);
	};
	
	window.addEventListener('scroll', debouncedUpdate, { passive: true });
	updateIsScrolled(); // Initial state
}

export const isScrolled = { subscribe: isScrolledStore.subscribe };

// Export scrollY store as the main scroll store
export const scroll = scrollYStore;
