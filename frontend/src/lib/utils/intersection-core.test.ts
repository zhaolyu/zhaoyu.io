import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	isMobileViewport,
	createIntersectionObserver,
	isScrolledPast,
	checkInitialVisibility
} from './intersection-core';
import { ANIMATION_CONFIG } from '../constants/config';

// Test helper: Mock window.innerWidth
const mockWindowWidth = (width: number) => {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width
	});
};

describe('isMobileViewport', () => {
	beforeEach(() => {
		// Reset cache by accessing the module
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic functionality', () => {
		it('should return false for desktop viewport', () => {
			mockWindowWidth(1024);
			expect(isMobileViewport()).toBe(false);
		});

		it('should return true for mobile viewport', () => {
			mockWindowWidth(375);
			expect(isMobileViewport()).toBe(true);
		});

		it('should return false for viewport exactly at breakpoint', () => {
			mockWindowWidth(768);
			expect(isMobileViewport()).toBe(false);
		});

		it('should return true for viewport just below breakpoint', () => {
			mockWindowWidth(767);
			expect(isMobileViewport()).toBe(true);
		});
	});

	describe('Caching behavior', () => {
		it('should cache result for same window width', () => {
			mockWindowWidth(1024);

			const result1 = isMobileViewport();
			const result2 = isMobileViewport();

			expect(result1).toBe(result2);
			expect(result1).toBe(false);
		});

		it('should re-check when window width changes', () => {
			mockWindowWidth(1024);
			expect(isMobileViewport()).toBe(false);

			mockWindowWidth(375);
			expect(isMobileViewport()).toBe(true);
		});

		it('should bypass cache when forceCheck is true', () => {
			mockWindowWidth(1024);
			// First call caches result
			isMobileViewport();

			// Change width but cache should still be used
			mockWindowWidth(375);

			// Without forceCheck, might use cache
			// With forceCheck, should re-check
			expect(isMobileViewport(true)).toBe(true);
		});
	});

	describe('SSR safety', () => {
		it('should return false when window is undefined', () => {
			const originalWindow = global.window;
			// @ts-expect-error - intentionally undefined for SSR test
			global.window = undefined;

			// In SSR, should return false
			expect(isMobileViewport()).toBe(false);

			global.window = originalWindow;
		});
	});

	describe('Regression prevention', () => {
		it('should maintain 768px breakpoint', () => {
			// Would catch if breakpoint changes
			mockWindowWidth(767);
			expect(isMobileViewport()).toBe(true);

			mockWindowWidth(768);
			expect(isMobileViewport()).toBe(false);
		});
	});
});

describe('createIntersectionObserver', () => {
	let mockObserver: {
		observe: ReturnType<typeof vi.fn>;
		disconnect: ReturnType<typeof vi.fn>;
		takeRecords: ReturnType<typeof vi.fn>;
	};
	let mockCallback: ReturnType<typeof vi.fn>;
	let mockIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		vi.useFakeTimers();

		mockCallback = vi.fn();
		mockObserver = {
			observe: vi.fn(),
			disconnect: vi.fn(),
			takeRecords: vi.fn()
		};

		mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
			// Store callback for triggering
			(mockObserver as any).callback = callback;
			return mockObserver;
		}) as any;

		global.IntersectionObserver = mockIntersectionObserver as any;
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	describe('Basic functionality', () => {
		it('should create IntersectionObserver with correct config', () => {
			mockWindowWidth(1024);

			createIntersectionObserver(mockCallback);

			expect(mockIntersectionObserver).toHaveBeenCalled();
			const callArgs = (mockIntersectionObserver as any).mock.calls[0];
			expect(callArgs[1]).toHaveProperty('threshold');
			expect(callArgs[1]).toHaveProperty('rootMargin');
		});

		it('should use desktop config for desktop viewport', () => {
			mockWindowWidth(1024);

			createIntersectionObserver(mockCallback);

			const callArgs = (mockIntersectionObserver as any).mock.calls[0];
			expect(callArgs[1].threshold).toBe(ANIMATION_CONFIG.intersectionObserver.threshold);
			expect(callArgs[1].rootMargin).toBe(ANIMATION_CONFIG.intersectionObserver.rootMargin);
		});

		it('should use mobile config for mobile viewport', () => {
			mockWindowWidth(375);

			createIntersectionObserver(mockCallback);

			const callArgs = (mockIntersectionObserver as any).mock.calls[0];
			expect(callArgs[1].threshold).toBe(ANIMATION_CONFIG.intersectionObserver.mobile.threshold);
			expect(callArgs[1].rootMargin).toBe(ANIMATION_CONFIG.intersectionObserver.mobile.rootMargin);
		});

		it('should allow custom options to override defaults', () => {
			mockWindowWidth(1024);

			createIntersectionObserver(mockCallback, {
				threshold: 0.5,
				rootMargin: '100px'
			});

			const callArgs = (mockIntersectionObserver as any).mock.calls[0];
			expect(callArgs[1].threshold).toBe(0.5);
			expect(callArgs[1].rootMargin).toBe('100px');
		});
	});

	describe('Callback behavior', () => {
		it('should call callback when intersection state changes', () => {
			const _observer = createIntersectionObserver(mockCallback, { debounceMs: 0 });

			// Simulate intersection change
			const mockEntry = {
				isIntersecting: true,
				boundingClientRect: { top: 0 }
			} as IntersectionObserverEntry;

			// Trigger callback
			(mockObserver as any).callback([mockEntry]);

			expect(mockCallback).toHaveBeenCalledWith(mockEntry, true);
		});

		it('should not call callback if state has not changed', () => {
			const _observer = createIntersectionObserver(mockCallback, { debounceMs: 0 });

			const mockEntry = {
				isIntersecting: true,
				boundingClientRect: { top: 0 }
			} as IntersectionObserverEntry;

			// First call
			(mockObserver as any).callback([mockEntry]);
			expect(mockCallback).toHaveBeenCalledTimes(1);

			// Second call with same state
			(mockObserver as any).callback([mockEntry]);
			expect(mockCallback).toHaveBeenCalledTimes(1); // Should not be called again
		});
	});

	describe('Debouncing', () => {
		it('should debounce callbacks on mobile', () => {
			mockWindowWidth(375);

			const _observer = createIntersectionObserver(mockCallback);
			const mockEntry = {
				isIntersecting: true,
				boundingClientRect: { top: 0 }
			} as IntersectionObserverEntry;

			// Trigger multiple rapid changes
			(mockObserver as any).callback([mockEntry]);
			(mockObserver as any).callback([mockEntry]);
			(mockObserver as any).callback([mockEntry]);

			// Callback should not be called immediately
			expect(mockCallback).not.toHaveBeenCalled();

			// After debounce time
			vi.advanceTimersByTime(150);
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		it('should use custom debounce time when provided', () => {
			const _observer = createIntersectionObserver(mockCallback, { debounceMs: 200 });
			const mockEntry = {
				isIntersecting: true,
				boundingClientRect: { top: 0 }
			} as IntersectionObserverEntry;

			(mockObserver as any).callback([mockEntry]);

			vi.advanceTimersByTime(100);
			expect(mockCallback).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);
			expect(mockCallback).toHaveBeenCalled();
		});

		it('should clear previous timeout on new intersection', () => {
			const _observer = createIntersectionObserver(mockCallback, { debounceMs: 200 });
			const mockEntry = {
				isIntersecting: true,
				boundingClientRect: { top: 0 }
			} as IntersectionObserverEntry;

			(mockObserver as any).callback([mockEntry]);
			vi.advanceTimersByTime(100);

			// New intersection should reset timer
			(mockObserver as any).callback([mockEntry]);
			vi.advanceTimersByTime(100);
			expect(mockCallback).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});
	});

	describe('Regression prevention', () => {
		it('should maintain correct mobile vs desktop config switching', () => {
			// Would catch if config switching logic breaks
			mockWindowWidth(1024);

			vi.clearAllMocks();
			const _desktopObserver = createIntersectionObserver(mockCallback);
			const desktopCallArgs = (mockIntersectionObserver as any).mock.calls[0];

			mockWindowWidth(375);

			// Clear cache by forcing check
			vi.clearAllMocks();
			const _mobileObserver = createIntersectionObserver(mockCallback);
			const mobileCallArgs = (mockIntersectionObserver as any).mock.calls[0];

			expect(desktopCallArgs[1].threshold).not.toBe(mobileCallArgs[1].threshold);
		});
	});
});

describe('isScrolledPast', () => {
	describe('Basic functionality', () => {
		it('should return true when element is scrolled past threshold', () => {
			const entry = {
				boundingClientRect: {
					top: -250, // 250px above viewport
					bottom: -200,
					left: 0,
					right: 100,
					width: 100,
					height: 50,
					x: 0,
					y: -250
				}
			} as IntersectionObserverEntry;

			expect(isScrolledPast(entry, 200)).toBe(true);
		});

		it('should return false when element is not scrolled past threshold', () => {
			const entry = {
				boundingClientRect: {
					top: -100, // Only 100px above viewport
					bottom: -50,
					left: 0,
					right: 100,
					width: 100,
					height: 50,
					x: 0,
					y: -100
				}
			} as IntersectionObserverEntry;

			expect(isScrolledPast(entry, 200)).toBe(false);
		});

		it('should use default threshold from config', () => {
			const entry = {
				boundingClientRect: {
					top: -250,
					bottom: -200,
					left: 0,
					right: 100,
					width: 100,
					height: 50,
					x: 0,
					y: -250
				}
			} as IntersectionObserverEntry;

			expect(isScrolledPast(entry)).toBe(true);
		});

		it('should accept custom threshold', () => {
			const entry = {
				boundingClientRect: {
					top: -150,
					bottom: -100,
					left: 0,
					right: 100,
					width: 100,
					height: 50,
					x: 0,
					y: -150
				}
			} as IntersectionObserverEntry;

			expect(isScrolledPast(entry, 100)).toBe(true);
			expect(isScrolledPast(entry, 200)).toBe(false);
		});
	});

	describe('Regression prevention', () => {
		it('should correctly calculate scroll-past for various positions', () => {
			const testCases = [
				{ top: -250, threshold: 200, expected: true },
				{ top: -199, threshold: 200, expected: false },
				{ top: -200, threshold: 200, expected: false }, // Exactly at threshold
				{ top: 0, threshold: 200, expected: false }, // In viewport
				{ top: 100, threshold: 200, expected: false } // Below viewport
			];

			testCases.forEach(({ top, threshold, expected }) => {
				const entry = {
					boundingClientRect: {
						top,
						bottom: top + 50,
						left: 0,
						right: 100,
						width: 100,
						height: 50,
						x: 0,
						y: top
					}
				} as IntersectionObserverEntry;

				expect(isScrolledPast(entry, threshold)).toBe(expected);
			});
		});
	});
});

describe('checkInitialVisibility', () => {
	let mockRAF: ReturnType<typeof vi.fn>;
	let mockCallback: ReturnType<typeof vi.fn>;
	let mockElement: HTMLElement;

	beforeEach(() => {
		vi.useFakeTimers();
		mockRAF = vi.fn((cb) => {
			// Execute callback immediately for testing
			setTimeout(cb, 0);
		});
		global.requestAnimationFrame = mockRAF as any;

		mockCallback = vi.fn();
		mockElement = document.createElement('div');
		document.body.appendChild(mockElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	describe('Basic functionality', () => {
		it('should call callback if element is already visible', () => {
			// Mock element as visible in viewport
			mockElement.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				bottom: 300,
				left: 0,
				right: 100,
				width: 100,
				height: 200,
				x: 0,
				y: 100,
				toJSON: () => ({})
			} as DOMRect));

			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 800
			});

			checkInitialVisibility(mockElement, 0.1, mockCallback);

			// Advance timers to trigger RAF callback
			vi.advanceTimersByTime(0);

			expect(mockCallback).toHaveBeenCalled();
		});

		it('should not call callback if element is not visible', () => {
			// Mock element as below viewport
			mockElement.getBoundingClientRect = vi.fn(() => ({
				top: 1000,
				bottom: 1200,
				left: 0,
				right: 100,
				width: 100,
				height: 200,
				x: 0,
				y: 1000,
				toJSON: () => ({})
			} as DOMRect));

			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 800
			});

			checkInitialVisibility(mockElement, 0.1, mockCallback);

			vi.advanceTimersByTime(0);

			expect(mockCallback).not.toHaveBeenCalled();
		});

		it('should use requestAnimationFrame', () => {
			mockElement.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				bottom: 300,
				left: 0,
				right: 100,
				width: 100,
				height: 200,
				x: 0,
				y: 100,
				toJSON: () => ({})
			} as DOMRect));

			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 800
			});

			checkInitialVisibility(mockElement, 0.1, mockCallback);

			expect(mockRAF).toHaveBeenCalled();
		});
	});

	describe('Visibility threshold calculation', () => {
		it('should calculate visible ratio correctly', () => {
			// Element partially visible (50% visible)
			mockElement.getBoundingClientRect = vi.fn(() => ({
				top: 700,
				bottom: 900,
				left: 0,
				right: 100,
				width: 100,
				height: 200,
				x: 0,
				y: 700,
				toJSON: () => ({})
			} as DOMRect));

			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 800
			});

			// Threshold 0.3 (30%) - element is 50% visible, should trigger
			checkInitialVisibility(mockElement, 0.3, mockCallback);
			vi.advanceTimersByTime(0);
			expect(mockCallback).toHaveBeenCalled();

			// Reset
			mockCallback.mockClear();

			// Threshold 0.6 (60%) - element is 50% visible, should not trigger
			checkInitialVisibility(mockElement, 0.6, mockCallback);
			vi.advanceTimersByTime(0);
			expect(mockCallback).not.toHaveBeenCalled();
		});
	});

	describe('SSR safety', () => {
		it('should return early when window is undefined', () => {
			const originalWindow = global.window;
			// @ts-expect-error - intentionally undefined for SSR test
			global.window = undefined;

			checkInitialVisibility(mockElement, 0.1, mockCallback);

			// Should not call RAF or callback
			expect(mockRAF).not.toHaveBeenCalled();
			expect(mockCallback).not.toHaveBeenCalled();

			global.window = originalWindow;
		});
	});

	describe('Regression prevention', () => {
		it('should handle edge cases in visibility calculation', () => {
			// Element with zero height
			mockElement.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				bottom: 100,
				left: 0,
				right: 100,
				width: 100,
				height: 0,
				x: 0,
				y: 100,
				toJSON: () => ({})
			} as DOMRect));

			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 800
			});

			// Should not crash
			expect(() => {
				checkInitialVisibility(mockElement, 0.1, mockCallback);
				vi.advanceTimersByTime(0);
			}).not.toThrow();
		});
	});
});
