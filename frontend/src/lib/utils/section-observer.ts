/**
 * Section observer utilities for scroll-triggered visibility and animations
 * Built on top of the core intersection observer utilities
 */

import {
	createIntersectionObserver,
	checkInitialVisibility,
	isScrolledPast,
	isMobileViewport,
	type IntersectionObserverOptions
} from './intersection-core';
import { ANIMATION_CONFIG } from '$lib/constants/config';

/**
 * Options for observeSection
 */
export interface ObserveSectionOptions {
	/**
	 * Callback when section becomes visible
	 */
	onVisible: () => void;
	/**
	 * Visibility threshold (0-1 ratio, e.g., 0.1 means 10% visible)
	 * Defaults to mobile/desktop config from ANIMATION_CONFIG
	 */
	threshold?: number;
	/**
	 * Whether to check initial visibility on mount
	 * Defaults to true
	 */
	checkInitialVisibility?: boolean;
}

/**
 * Simple utility for observing section visibility
 * Handles element null check, observer setup, initial visibility check, and cleanup
 * 
 * Use this for basic show/hide functionality when sections enter view.
 * 
 * @param element - Element to observe
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
 * 
 * @example
 * ```svelte
 * <script>
 *   import { observeSection } from '$lib/utils/section-observer';
 *   
 *   let sectionVisible = $state(false);
 *   let container: HTMLElement;
 *   
 *   onMount(() => {
 *     return observeSection(container, {
 *       onVisible: () => {
 *         sectionVisible = true;
 *       },
 *       threshold: 0.1
 *     });
 *   });
 * </script>
 * ```
 */
export function observeSection(
	element: HTMLElement | null,
	options: ObserveSectionOptions
): () => void {
	if (!element) {
		return () => {}; // No-op cleanup if element doesn't exist
	}

	const { onVisible, threshold, checkInitialVisibility: shouldCheckInitialVisibility = true } = options;

	const observer = createIntersectionObserver(
		(entry, isIntersecting) => {
			if (isIntersecting) {
				onVisible();
			}
		},
		{ threshold }
	);

	observer.observe(element);

	// Check initial visibility if requested
	if (shouldCheckInitialVisibility) {
		const actualThreshold = threshold ?? (isMobileViewport() 
			? ANIMATION_CONFIG.intersectionObserver.mobile.threshold 
			: ANIMATION_CONFIG.intersectionObserver.threshold);
		checkInitialVisibility(element, actualThreshold, onVisible);
	}

	return () => {
		observer.disconnect();
	};
}

/**
 * Options for createSectionObserver
 */
export interface SectionObserverOptions extends IntersectionObserverOptions {
	/**
	 * Threshold for "scrolled past" detection in pixels
	 * Defaults to ANIMATION_CONFIG.scrollPastThreshold
	 */
	scrollPastThreshold?: number;
	/**
	 * Whether to enable reanimation when section is re-entered after being scrolled past
	 * Defaults to false
	 */
	enableReanimation?: boolean;
	/**
	 * Callback when section becomes visible
	 */
	onVisible?: () => void;
	/**
	 * Callback when section becomes hidden
	 */
	onHidden?: () => void;
	/**
	 * Callback when section is scrolled past (only called if enableReanimation is true)
	 */
	onScrolledPast?: () => void;
}

/**
 * Creates a higher-level intersection observer for section visibility with optional reanimation support
 * Handles common patterns like "scrolled past" detection and reanimation logic
 * 
 * Use this for advanced cases where you need:
 * - Reanimation when scrolling back into view
 * - Scroll-past detection
 * - Conditional visibility callbacks
 * - SVG animations that need to re-trigger
 * 
 * @param element - Element to observe
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
 * 
 * @example
 * ```svelte
 * <script>
 *   import { createSectionObserver } from '$lib/utils/section-observer';
 *   
 *   let sectionVisible = $state(false);
 *   let animationKey = $state(0);
 *   let container: HTMLElement;
 *   
 *   onMount(() => {
 *     return createSectionObserver(container, {
 *       enableReanimation: true,
 *       onVisible: () => {
 *         sectionVisible = true;
 *         animationKey++; // Force transition re-trigger
 *       },
 *       onScrolledPast: () => {
 *         sectionVisible = false; // Reset for next animation
 *       }
 *     });
 *   });
 * </script>
 * ```
 */
export function createSectionObserver(
	element: HTMLElement | null,
	options: SectionObserverOptions = {}
): () => void {
	if (!element) {
		return () => {}; // No-op cleanup if element doesn't exist
	}

	const {
		scrollPastThreshold = ANIMATION_CONFIG.scrollPastThreshold,
		enableReanimation = false,
		onVisible,
		onHidden,
		onScrolledPast,
		...observerOptions
	} = options;

	// Track state for reanimation logic
	let lastWasIntersecting = false;
	let hasScrolledPast = false;

	const observer = createIntersectionObserver(
		(entry, isIntersecting) => {
			if (isIntersecting) {
				// Section entered view
				if (enableReanimation) {
					// Reanimate if: first time entering OR re-entering after being scrolled past
					if (!lastWasIntersecting || hasScrolledPast) {
						onVisible?.();
						hasScrolledPast = false;
					}
				} else {
					onVisible?.();
				}
				lastWasIntersecting = true;
			} else {
				// Section left view
				lastWasIntersecting = false;

				if (enableReanimation) {
					// Check if scrolled well past
					if (isScrolledPast(entry, scrollPastThreshold)) {
						// Scrolled well past - mark for reanimation on next entry
						hasScrolledPast = true;
						onScrolledPast?.();
						onHidden?.();
					}
					// If not scrolled past enough, keep visible to prevent flickering
				} else {
					// Simple visibility tracking - only hide if scrolled well past
					if (isScrolledPast(entry, scrollPastThreshold)) {
						onHidden?.();
					}
				}
			}
		},
		observerOptions
	);

	observer.observe(element);

	// Check initial visibility - IntersectionObserver doesn't fire immediately
	// when observe() is called, so we need to manually check if element is already visible
	const actualThreshold = observerOptions.threshold ?? (isMobileViewport()
		? ANIMATION_CONFIG.intersectionObserver.mobile.threshold
		: ANIMATION_CONFIG.intersectionObserver.threshold);
	
	checkInitialVisibility(element, actualThreshold, () => {
		// Only trigger onVisible if not already triggered by observer
		if (!lastWasIntersecting) {
			onVisible?.();
		}
	});

	return () => {
		observer.disconnect();
	};
}
