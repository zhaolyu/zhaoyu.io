/**
 * Intersection Observer utilities for scroll-triggered animations
 * Handles mobile vs desktop detection and provides consistent configuration
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
function checkInitialVisibility(
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
 * @param element - Element to observe
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
 * 
 * @example
 * ```svelte
 * <script>
 *   import { observeSection } from '$lib/utils/intersection';
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
 * @param element - Element to observe
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
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

/**
 * Options for observeSvgRedraw
 */
export interface SvgRedrawOptions extends IntersectionObserverOptions {
	/**
	 * Callback when SVG becomes visible (for triggering animations)
	 * Always called when intersecting - component handles reanimation via counter keys
	 */
	onVisible?: () => void;
}

/**
 * Pattern for re-triggering Svelte transitions on scroll into view
 * 
 * When using transitions like `in:draw`, `in:fly`, etc. that need to re-trigger
 * each time an element scrolls into view, use a counter key pattern:
 * 
 * 1. Create a reactive counter: `let animationKey = $state(0);`
 * 2. Increment it in onVisible: `animationKey++;`
 * 3. Use it in {#key}: `{#key animationKey} <element in:transition /> {/key}`
 * 
 * This forces the element to remount and re-run the transition each time the key changes.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { observeSvgRedraw } from '$lib/utils/intersection';
 *   
 *   let sectionVisible = $state(false);
 *   let animationKey = $state(0); // Counter for forcing transition re-trigger
 *   let container: HTMLElement;
 *   
 *   onMount(() => {
 *     return observeSvgRedraw(container, {
 *       onVisible: () => {
 *         sectionVisible = true;
 *         animationKey++; // Increment to force remount and re-trigger transition
 *       }
 *     });
 *   });
 * </script>
 * 
 * <div bind:this={container}>
 *   {#if sectionVisible}
 *     {#key animationKey}
 *       <path in:draw={{ duration: 2000 }} />
 *     {/key}
 *   {/if}
 * </div>
 * ```
 * 
 * @see CareerChart.svelte for a complete working example
 */

/**
 * Observes an element and triggers SVG redraw when it enters view
 * Designed for SVG animations that should trigger on scroll
 * 
 * This utility:
 * - Prevents layout shifts by keeping content rendered (use CSS opacity/visibility)
 * - Handles intersection observer setup and cleanup
 * - Works with Svelte transitions and CSS animations
 * - Always calls onVisible when intersecting (component handles reanimation via counter keys)
 * 
 * @param element - Element to observe (typically the container with the SVG)
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
 * 
 * @example
 * ```svelte
 * <script>
 *   import { observeSvgRedraw } from '$lib/utils/intersection';
 *   
 *   let container: HTMLElement;
 *   let sectionVisible = $state(false);
 *   let animationKey = $state(0);
 *   
 *   onMount(() => {
 *     return observeSvgRedraw(container, {
 *       onVisible: () => {
 *         sectionVisible = true;
 *         animationKey++; // Force transition re-trigger
 *       },
 *       threshold: 0.2
 *     });
 *   });
 * </script>
 * 
 * <div bind:this={container}>
 *   {#if sectionVisible}
 *     {#key animationKey}
 *       <path in:draw={{ duration: 2000 }} />
 *     {/key}
 *   {/if}
 * </div>
 * ```
 */
export function observeSvgRedraw(
	element: HTMLElement | null,
	options: SvgRedrawOptions = {}
): () => void {
	if (!element) {
		return () => {}; // No-op cleanup if element doesn't exist
	}

	const { onVisible, ...observerOptions } = options;
	
	let hasBeenVisible = false;
	let observer: IntersectionObserver | null = null;

	// Set up observer callback
	const observerCallback = (entry: IntersectionObserverEntry, isIntersecting: boolean) => {
		if (isIntersecting) {
			// Always trigger onVisible when intersecting - let the component handle state
			// The component's conditional rendering and counter keys prevent duplicate animations
			hasBeenVisible = true;
			onVisible?.();
		}
		// Keep visible once shown to prevent layout shifts
	};

	observer = createIntersectionObserver(observerCallback, observerOptions);
	observer.observe(element);
	
	// Check initial visibility - IntersectionObserver doesn't fire immediately
	// when observe() is called, so we need to manually check if element is already visible
	const actualThreshold = observerOptions.threshold ?? 0.2;
	checkInitialVisibility(element, actualThreshold, () => {
		if (!hasBeenVisible) {
			hasBeenVisible = true;
			onVisible?.();
		}
	});

	return () => {
		observer?.disconnect();
	};
}
