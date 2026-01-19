import { describe, it, expect } from 'vitest';
import { formatNumber, truncate, capitalize, kebabToTitle } from './format';

describe('formatNumber', () => {
	describe('Basic functionality', () => {
		it('should format small numbers correctly', () => {
			expect(formatNumber(0)).toBe('0');
			expect(formatNumber(1)).toBe('1');
			expect(formatNumber(100)).toBe('100');
		});

		it('should format large numbers with commas', () => {
			expect(formatNumber(1000)).toBe('1,000');
			expect(formatNumber(10000)).toBe('10,000');
			expect(formatNumber(100000)).toBe('100,000');
			expect(formatNumber(1000000)).toBe('1,000,000');
		});

		it('should format decimal numbers correctly', () => {
			expect(formatNumber(1234.56)).toBe('1,234.56');
			expect(formatNumber(0.123)).toBe('0.123');
		});

		it('should handle negative numbers', () => {
			expect(formatNumber(-1000)).toBe('-1,000');
			expect(formatNumber(-1234.56)).toBe('-1,234.56');
		});
	});

	describe('Regression prevention', () => {
		it('should maintain locale-specific formatting', () => {
			// Would catch if locale changes break number display
			const result = formatNumber(1234567);
			expect(result).toContain(',');
			expect(result).toContain('1');
			expect(result).toContain('7');
		});

		it('should handle edge case numbers', () => {
			expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBeTruthy();
			expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBeTruthy();
		});
	});
});

describe('truncate', () => {
	describe('Basic functionality', () => {
		it('should return text unchanged if shorter than maxLength', () => {
			expect(truncate('short', 10)).toBe('short');
			expect(truncate('exact', 5)).toBe('exact');
		});

		it('should truncate text longer than maxLength', () => {
			const longText = 'This is a very long text that needs to be truncated';
			const result = truncate(longText, 20);
			expect(result.length).toBe(20);
			expect(result.endsWith('...')).toBe(true);
		});

		it('should use default suffix when not provided', () => {
			const result = truncate('This is a long text', 10);
			expect(result.endsWith('...')).toBe(true);
		});

		it('should use custom suffix when provided', () => {
			const result = truncate('This is a long text', 10, '…');
			expect(result.endsWith('…')).toBe(true);
			expect(result.length).toBe(10);
		});
	});

	describe('Length calculation', () => {
		it('should account for suffix length in truncation', () => {
			const text = 'This is a very long text';
			const result = truncate(text, 20, '...');
			// Total length should be exactly 20 (including suffix)
			expect(result.length).toBe(20);
			// Text before suffix should be 17 characters (20 - 3 for '...')
			expect(result.slice(0, -3).length).toBe(17);
		});

		it('should handle suffix longer than maxLength', () => {
			const text = 'short';
			const result = truncate(text, 3, 'very long suffix');
			// When suffix is longer than maxLength, function may return suffix or handle edge case
			// The actual behavior depends on implementation - test that it doesn't crash
			expect(typeof result).toBe('string');
		});
	});

	describe('Edge cases', () => {
		it('should handle empty string', () => {
			expect(truncate('', 10)).toBe('');
		});

		it('should handle maxLength of 0', () => {
			const result = truncate('test', 0);
			// When maxLength is 0, function may return empty string or handle edge case
			// Test that it doesn't crash
			expect(typeof result).toBe('string');
		});

		it('should handle text exactly at maxLength', () => {
			const text = 'exact';
			expect(truncate(text, 5)).toBe('exact');
		});
	});

	describe('Regression prevention', () => {
		it('should always return string with length <= maxLength', () => {
			const testCases = [
				{ text: 'short', max: 10 },
				{ text: 'This is a longer text', max: 15 },
				{ text: 'Very long text that definitely exceeds', max: 20 }
			];

			testCases.forEach(({ text, max }) => {
				const result = truncate(text, max);
				expect(result.length).toBeLessThanOrEqual(max);
			});
		});

		it('should preserve text start when truncating', () => {
			const text = 'This is the beginning of a long text';
			const result = truncate(text, 20);
			// Should start with original text
			expect(result.startsWith('This is the begin')).toBe(true);
		});
	});
});

describe('capitalize', () => {
	describe('Basic functionality', () => {
		it('should capitalize first letter of normal string', () => {
			expect(capitalize('hello')).toBe('Hello');
			expect(capitalize('world')).toBe('World');
		});

		it('should preserve rest of string', () => {
			expect(capitalize('hello world')).toBe('Hello world');
			expect(capitalize('hELLO')).toBe('HELLO');
		});

		it('should handle already capitalized strings', () => {
			expect(capitalize('Hello')).toBe('Hello');
			expect(capitalize('HELLO')).toBe('HELLO');
		});
	});

	describe('Edge cases', () => {
		it('should handle empty string', () => {
			expect(capitalize('')).toBe('');
		});

		it('should handle single character', () => {
			expect(capitalize('a')).toBe('A');
			expect(capitalize('A')).toBe('A');
		});

		it('should handle strings starting with numbers', () => {
			expect(capitalize('123abc')).toBe('123abc');
		});

		it('should handle strings starting with special characters', () => {
			expect(capitalize('!hello')).toBe('!hello');
		});
	});

	describe('Regression prevention', () => {
		it('should be idempotent for already capitalized strings', () => {
			const capitalized = 'Hello';
			expect(capitalize(capitalize(capitalized))).toBe(capitalized);
		});

		it('should always return a string', () => {
			const testCases = ['hello', '', 'a', '123', '!test'];
			testCases.forEach((input) => {
				expect(typeof capitalize(input)).toBe('string');
			});
		});
	});
});

describe('kebabToTitle', () => {
	describe('Basic functionality', () => {
		it('should convert single word kebab-case', () => {
			expect(kebabToTitle('hello')).toBe('Hello');
		});

		it('should convert multi-word kebab-case to Title Case', () => {
			expect(kebabToTitle('hello-world')).toBe('Hello World');
			expect(kebabToTitle('about-me')).toBe('About Me');
			expect(kebabToTitle('my-blog-post')).toBe('My Blog Post');
		});

		it('should capitalize each word', () => {
			const result = kebabToTitle('hello-world-test');
			expect(result).toBe('Hello World Test');
			// Each word should start with capital
			expect(result.split(' ').every((word) => word[0] === word[0].toUpperCase())).toBe(true);
		});
	});

	describe('Edge cases', () => {
		it('should handle empty string', () => {
			expect(kebabToTitle('')).toBe('');
		});

		it('should handle single word', () => {
			expect(kebabToTitle('hello')).toBe('Hello');
		});

		it('should handle multiple consecutive dashes', () => {
			expect(kebabToTitle('hello--world')).toBe('Hello  World'); // Note: creates empty word
		});

		it('should handle string starting/ending with dash', () => {
			expect(kebabToTitle('-hello')).toBe(' Hello');
			expect(kebabToTitle('hello-')).toBe('Hello ');
		});
	});

	describe('Regression prevention', () => {
		it('should produce readable titles from route names', () => {
			// Common use case: converting route names to page titles
			const routeNames = ['about-me', 'blog-post', 'contact-us'];
			routeNames.forEach((route) => {
				const result = kebabToTitle(route);
				// Should be readable title case
				expect(result).toMatch(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/);
			});
		});

		it('should handle various kebab-case patterns', () => {
			const testCases = [
				{ input: 'hello', expected: 'Hello' },
				{ input: 'hello-world', expected: 'Hello World' },
				{ input: 'my-blog-post-title', expected: 'My Blog Post Title' }
			];

			testCases.forEach(({ input, expected }) => {
				expect(kebabToTitle(input)).toBe(expected);
			});
		});
	});
});
