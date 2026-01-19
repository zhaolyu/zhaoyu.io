/**
 * Core Intersection Observer utilities
 * Low-level building blocks for creating intersection observers with mobile-aware configuration
 * 
 * These utilities provide:
 * - Mobile/desktop detection and caching
 * - IntersectionObserver creation with debouncing
 * - Scroll-past detection helpers
 * - Initial visibility checking
 */

import { ANIMATION_CONFIG } from '$lib/constants/config';

export interface IntersectionObserverOptions {
	threshold?: number;
	rootMargin?: string;
	debounceMs?: number; // Optional debouncing for mobile to prevent flickering
}

/* eslint-disable no-unused-vars */
export type IntersectionObserverCallback = (
	entry: IntersectionObserverEntry,
	isIntersecting: boolean
) => void;
/* eslint-enable no-unused-vars */

// Cache mobile viewport result to avoid repeated checks
let cachedIsMobile: boolean | null = null;
let cachedWindowWidth: number | null = null;

/**
 * Detects if the current viewport is mobile (< 768px)
 * Caches result to avoid repeated checks within the same frame
 * 
 * @param forceCheck - If true, bypasses cache and checks again
 */
export function isMobileViewport(forceCheck: boolean = false): boolean {
	if (typeof window === 'undefined') return false;
	
	// Use cache if available and window width hasn't changed
	if (!forceCheck && cachedIsMobile !== null && cachedWindowWidth === window.innerWidth) {
		return cachedIsMobile;
	}
	
	cachedWindowWidth = window.innerWidth;
	cachedIsMobile = window.innerWidth < 768;
	return cachedIsMobile;
}

/**
 * Creates an IntersectionObserver with mobile-aware configuration
 * 
 * @param callback - Function called when intersection changes
 * @param options - Optional overrides for threshold, rootMargin, or debounce
 * @returns Configured IntersectionObserver instance
 */
export function createIntersectionObserver(
	callback: IntersectionObserverCallback,
	options: IntersectionObserverOptions = {}
): IntersectionObserver {
	const isMobile = isMobileViewport();
	const config = ANIMATION_CONFIG.intersectionObserver;

	// Use mobile config if on mobile, otherwise use desktop defaults
	const threshold = options.threshold ?? (isMobile ? config.mobile.threshold : config.threshold);
	const rootMargin = options.rootMargin ?? (isMobile ? config.mobile.rootMargin : config.rootMargin);
	const debounceMs = options.debounceMs ?? (isMobile ? 150 : 50);

	let lastIntersectionState: boolean | null = null;
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	let pendingEntry: IntersectionObserverEntry | null = null;
	let pendingIsIntersecting: boolean | null = null;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const isIntersecting = entry.isIntersecting;
				pendingEntry = entry;
				pendingIsIntersecting = isIntersecting;

				// Apply debouncing if specified
				if (debounceMs > 0) {
					if (debounceTimeout) {
						clearTimeout(debounceTimeout);
					}

					debounceTimeout = setTimeout(() => {
						// Only call callback if state actually changed and we have a pending entry
						if (pendingEntry && pendingIsIntersecting !== null && pendingIsIntersecting !== lastIntersectionState) {
							callback(pendingEntry, pendingIsIntersecting);
							lastIntersectionState = pendingIsIntersecting;
						}
						pendingEntry = null;
						pendingIsIntersecting = null;
					}, debounceMs);
				} else {
					// No debouncing - call immediately if state changed
					if (isIntersecting !== lastIntersectionState) {
						callback(entry, isIntersecting);
						lastIntersectionState = isIntersecting;
					}
				}
			});
		},
		{
			threshold,
			rootMargin
		}
	);

	return observer;
}


/**
 * Checks if an element has been scrolled past a given threshold
 * 
 * @param entry - IntersectionObserverEntry to check
 * @param threshold - Threshold in pixels (defaults to ANIMATION_CONFIG.scrollPastThreshold)
 * @returns true if element's top is above the viewport by more than threshold
 */
export function isScrolledPast(
	entry: IntersectionObserverEntry,
	threshold: number = ANIMATION_CONFIG.scrollPastThreshold
): boolean {
	return entry.boundingClientRect.top < -threshold;
}

/**
 * Checks if an element is initially visible on mount and triggers callback if so
 * Uses requestAnimationFrame to ensure DOM is ready and layout is complete
 * 
 * @param element - Element to check
 * @param threshold - Visibility threshold (0-1 ratio, e.g., 0.2 means 20% visible)
 * @param callback - Function to call if element is already visible
 */
export function checkInitialVisibility(
	element: HTMLElement,
	threshold: number,
	callback: () => void
): void {
	if (typeof window === 'undefined') return;

	requestAnimationFrame(() => {
		const rect = element.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		
		// Calculate visible ratio based on threshold
		const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
		const elementHeight = rect.height;
		const visibleRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;
		
		// If element is already visible, trigger callback immediately
		if (visibleRatio >= threshold) {
			callback();
		}
	});
}
