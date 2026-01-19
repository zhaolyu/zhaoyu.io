import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatDate, getRelativeTime } from './date';

// Test helper: Set system time to a consistent base time
const setTestTime = (timeString: string = '2024-01-15T12:00:00') => {
	vi.setSystemTime(new Date(timeString));
};

describe('formatDate', () => {
	describe('Basic functionality', () => {
		it('should format date with short format by default', () => {
			// Use UTC date to avoid timezone issues
			const date = new Date('2024-01-15T12:00:00Z');
			const result = formatDate(date);
			// Should produce format with month abbreviation, day, and year
			expect(result).toMatch(/Jan\s+\d{1,2},\s+2024/);
			expect(result).toContain('2024');
		});

		it('should format date with short format explicitly', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const result = formatDate(date, 'short');
			// Should produce format with month abbreviation
			expect(result).toMatch(/Jan\s+\d{1,2},\s+2024/);
			expect(result).toContain('Jan');
		});

		it('should format date with long format', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const result = formatDate(date, 'long');
			// Should produce format with full month name
			expect(result).toMatch(/January\s+\d{1,2},\s+2024/);
			expect(result).toContain('January');
		});

		it('should handle string date input', () => {
			const result = formatDate('2024-01-15T12:00:00Z', 'short');
			// Should convert string to Date and format correctly
			expect(result).toMatch(/Jan\s+\d{1,2},\s+2024/);
		});

		it('should handle Date object input', () => {
			const date = new Date('2024-12-25T12:00:00Z');
			const result = formatDate(date, 'short');
			expect(result).toMatch(/Dec\s+\d{1,2},\s+2024/);
		});
	});

	describe('Format differences', () => {
		it('should produce different output for short vs long format', () => {
			const date = new Date('2024-01-15');
			const shortResult = formatDate(date, 'short');
			const longResult = formatDate(date, 'long');

			// Short format should use abbreviated month (Jan)
			expect(shortResult).toContain('Jan');
			// Long format should use full month name (January)
			expect(longResult).toContain('January');
			// Results should be different
			expect(shortResult).not.toBe(longResult);
		});
	});

	describe('Regression prevention', () => {
		it('should maintain consistent format structure', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const result = formatDate(date, 'short');
			// Would catch if format structure changes (e.g., missing year, wrong order)
			expect(result).toContain('2024'); // Year should be present
			expect(result).toMatch(/\d{1,2}/); // Day should be present
			expect(result).toMatch(/\w+/); // Month should be present
		});

		it('should handle different months correctly', () => {
			const months = [
				{ date: new Date('2024-01-15'), expected: 'Jan' },
				{ date: new Date('2024-06-15'), expected: 'Jun' },
				{ date: new Date('2024-12-15'), expected: 'Dec' }
			];

			months.forEach(({ date, expected }) => {
				const result = formatDate(date, 'short');
				expect(result).toContain(expected);
			});
		});

		it('should handle different years correctly', () => {
			const date2024 = new Date('2024-01-15');
			const date2025 = new Date('2025-01-15');

			expect(formatDate(date2024, 'short')).toContain('2024');
			expect(formatDate(date2025, 'short')).toContain('2025');
		});
	});
});

describe('getRelativeTime', () => {
	beforeEach(() => {
		// Mock Date.now() for consistent testing
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('Basic functionality', () => {
		it('should return "just now" for very recent times', () => {
			const now = new Date();
			setTestTime(now.toISOString());

			const recentDate = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
			const result = getRelativeTime(recentDate);

			expect(result).toBe('just now');
		});

		it('should handle Date object input', () => {
			setTestTime();

			const pastDate = new Date('2024-01-15T11:30:00'); // 30 minutes ago
			const result = getRelativeTime(pastDate);

			expect(result).toBe('30 minutes ago');
		});

		it('should handle string date input', () => {
			setTestTime();

			const result = getRelativeTime('2024-01-15T11:30:00');
			expect(result).toBe('30 minutes ago');
		});
	});

	describe('Time unit calculations', () => {
		beforeEach(() => setTestTime());

		it('should format minutes correctly', () => {
			expect(getRelativeTime(new Date('2024-01-15T11:59:00'))).toBe('1 minute ago');
			expect(getRelativeTime(new Date('2024-01-15T11:30:00'))).toBe('30 minutes ago');
		});

		it('should format hours correctly', () => {
			expect(getRelativeTime(new Date('2024-01-15T11:00:00'))).toBe('1 hour ago');
			expect(getRelativeTime(new Date('2024-01-15T10:00:00'))).toBe('2 hours ago');
		});

		it('should format days correctly', () => {
			expect(getRelativeTime(new Date('2024-01-14T12:00:00'))).toBe('1 day ago');
			expect(getRelativeTime(new Date('2024-01-13T12:00:00'))).toBe('2 days ago');
		});

		it('should format months correctly', () => {
			// Approximately 30 days ago = 1 month
			const oneMonthAgo = new Date('2023-12-16T12:00:00');
			expect(getRelativeTime(oneMonthAgo)).toContain('month');
		});

		it('should format years correctly', () => {
			expect(getRelativeTime(new Date('2023-01-15T12:00:00'))).toContain('year');
			expect(getRelativeTime(new Date('2022-01-15T12:00:00'))).toContain('years');
		});
	});

	describe('Pluralization', () => {
		beforeEach(() => setTestTime());

		const pluralizationTests = [
			{
				unit: 'minute',
				singular: { date: '2024-01-15T11:59:00', expected: '1 minute ago', shouldNotContain: 'minutes' },
				plural: { date: '2024-01-15T11:58:00', expected: '2 minutes ago', shouldContain: 'minutes' }
			},
			{
				unit: 'hour',
				singular: { date: '2024-01-15T11:00:00', expected: '1 hour ago', shouldNotContain: 'hours' },
				plural: { date: '2024-01-15T10:00:00', expected: '2 hours ago', shouldContain: 'hours' }
			},
			{
				unit: 'day',
				singular: { date: '2024-01-14T12:00:00', expected: '1 day ago', shouldNotContain: 'days' },
				plural: { date: '2024-01-13T12:00:00', expected: '2 days ago', shouldContain: 'days' }
			}
		];

		pluralizationTests.forEach(({ unit, singular, plural }) => {
			it(`should use singular form for 1 ${unit}`, () => {
				const result = getRelativeTime(new Date(singular.date));
				expect(result).toBe(singular.expected);
				if (singular.shouldNotContain) {
					expect(result).not.toContain(singular.shouldNotContain);
				}
			});

			it(`should use plural form for multiple ${unit}s`, () => {
				const result = getRelativeTime(new Date(plural.date));
				expect(result).toBe(plural.expected);
				if (plural.shouldContain) {
					expect(result).toContain(plural.shouldContain);
				}
			});
		});
	});

	describe('Boundary conditions', () => {
		beforeEach(() => setTestTime());

		const boundaryTests = [
			{
				name: 'exactly 60 seconds',
				date: '2024-01-15T11:59:00',
				shouldContain: 'minute',
				description: 'Should show "1 minute ago", not "just now"'
			},
			{
				name: 'exactly 60 minutes',
				date: '2024-01-15T11:00:00',
				shouldContain: 'hour',
				shouldNotContain: 'minute',
				description: 'Should show "1 hour ago", not minutes'
			},
			{
				name: 'exactly 24 hours',
				date: '2024-01-14T12:00:00',
				shouldContain: 'day',
				shouldNotContain: 'hour',
				description: 'Should show days, not hours'
			}
		];

		boundaryTests.forEach(({ name, date, shouldContain, shouldNotContain, description: _description }) => {
			it(`should handle ${name} (boundary)`, () => {
				const result = getRelativeTime(new Date(date));
				expect(result).toContain(shouldContain);
				if (shouldNotContain) {
					expect(result).not.toContain(shouldNotContain);
				}
			});
		});
	});

	describe('Regression prevention', () => {
		beforeEach(() => setTestTime());

		it('should always end with "ago" for past dates', () => {
			const testCases = [
				new Date('2024-01-15T11:30:00'), // 30 minutes
				new Date('2024-01-15T10:00:00'), // 2 hours
				new Date('2024-01-14T12:00:00'), // 1 day
				new Date('2023-12-15T12:00:00') // ~1 month
			];

			testCases.forEach((date) => {
				const result = getRelativeTime(date);
				expect(result.endsWith('ago')).toBe(true);
			});
		});

		it('should handle very old dates', () => {
			const oldDate = new Date('2020-01-15T12:00:00');
			const result = getRelativeTime(oldDate);
			// Should show years, not crash
			expect(result).toContain('year');
		});
	});
});
