import { describe, it, expect } from 'vitest';
import { isValidEmail, isNotEmpty, isValidUrl } from './validation';

describe('isValidEmail', () => {
	describe('Valid email formats', () => {
		it('should accept standard email format', () => {
			expect(isValidEmail('user@example.com')).toBe(true);
			expect(isValidEmail('test@domain.com')).toBe(true);
		});

		it('should accept emails with subdomains', () => {
			expect(isValidEmail('user@mail.example.com')).toBe(true);
			expect(isValidEmail('test@sub.domain.com')).toBe(true);
		});

		it('should accept emails with plus signs', () => {
			expect(isValidEmail('user+tag@example.com')).toBe(true);
		});

		it('should accept emails with dots in local part', () => {
			expect(isValidEmail('user.name@example.com')).toBe(true);
			expect(isValidEmail('first.last@domain.com')).toBe(true);
		});

		it('should accept emails with numbers', () => {
			expect(isValidEmail('user123@example.com')).toBe(true);
			expect(isValidEmail('test@123domain.com')).toBe(true);
		});
	});

	describe('Invalid email formats', () => {
		it('should reject emails without @ symbol', () => {
			expect(isValidEmail('userexample.com')).toBe(false);
			expect(isValidEmail('invalid-email')).toBe(false);
		});

		it('should reject emails without domain', () => {
			expect(isValidEmail('user@')).toBe(false);
			expect(isValidEmail('user@.com')).toBe(false);
		});

		it('should reject emails without TLD', () => {
			expect(isValidEmail('user@example')).toBe(false);
		});

		it('should reject emails with spaces', () => {
			expect(isValidEmail('user @example.com')).toBe(false);
			expect(isValidEmail('user@ example.com')).toBe(false);
			expect(isValidEmail('user @ example.com')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(isValidEmail('')).toBe(false);
		});

		it('should reject emails with multiple @ symbols', () => {
			expect(isValidEmail('user@@example.com')).toBe(false);
		});
	});

	describe('Regression prevention', () => {
		it('should catch if regex changes break valid emails', () => {
			const validEmails = [
				'user@example.com',
				'user.name@example.com',
				'user+tag@example.com',
				'test@mail.example.com'
			];

			validEmails.forEach((email) => {
				expect(isValidEmail(email)).toBe(true);
			});
		});

		it('should catch if regex changes allow invalid emails', () => {
			const invalidEmails = [
				'@example.com',
				'user@',
				'user@example',
				'user @example.com',
				''
			];

			invalidEmails.forEach((email) => {
				expect(isValidEmail(email)).toBe(false);
			});
		});
	});
});

describe('isNotEmpty', () => {
	describe('Valid non-empty values', () => {
		it('should return true for non-empty strings', () => {
			expect(isNotEmpty('hello')).toBe(true);
			expect(isNotEmpty('test')).toBe(true);
			expect(isNotEmpty('a')).toBe(true);
		});

		it('should return true for strings with content', () => {
			expect(isNotEmpty('  content  ')).toBe(true);
		});
	});

	describe('Empty or invalid values', () => {
		it('should return false for null', () => {
			expect(isNotEmpty(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(isNotEmpty(undefined)).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(isNotEmpty('')).toBe(false);
		});

		it('should return false for whitespace-only string', () => {
			expect(isNotEmpty('   ')).toBe(false);
			expect(isNotEmpty('\t')).toBe(false);
			expect(isNotEmpty('\n')).toBe(false);
			expect(isNotEmpty(' \t \n ')).toBe(false);
		});
	});

	describe('TypeScript type narrowing', () => {
		it('should narrow type correctly after check', () => {
			const value: string | null | undefined = 'test';
			if (isNotEmpty(value)) {
				// Type should be narrowed to string
				expect(typeof value).toBe('string');
				expect(value.length).toBeGreaterThan(0);
			}
		});

		it('should work as type guard', () => {
			function processValue(val: string | null | undefined): string {
				if (isNotEmpty(val)) {
					// val should be narrowed to string here
					return val.toUpperCase();
				}
				return '';
			}

			expect(processValue('hello')).toBe('HELLO');
			expect(processValue(null)).toBe('');
			expect(processValue(undefined)).toBe('');
		});
	});

	describe('Regression prevention', () => {
		it('should catch if trim is not used (whitespace bug)', () => {
			// Would catch common bug where whitespace-only strings are considered valid
			expect(isNotEmpty('   ')).toBe(false);
			expect(isNotEmpty('\t\n')).toBe(false);
		});

		it('should handle all falsy-like values correctly', () => {
			const falsyValues = [null, undefined, '', '   ', '\t', '\n'];
			falsyValues.forEach((value) => {
				expect(isNotEmpty(value as any)).toBe(false);
			});
		});
	});
});

describe('isValidUrl', () => {
	describe('Valid URL formats', () => {
		it('should accept http URLs', () => {
			expect(isValidUrl('http://example.com')).toBe(true);
			expect(isValidUrl('http://www.example.com')).toBe(true);
		});

		it('should accept https URLs', () => {
			expect(isValidUrl('https://example.com')).toBe(true);
			expect(isValidUrl('https://www.example.com')).toBe(true);
		});

		it('should accept URLs with paths', () => {
			expect(isValidUrl('https://example.com/path')).toBe(true);
			expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
		});

		it('should accept URLs with query parameters', () => {
			expect(isValidUrl('https://example.com?param=value')).toBe(true);
			expect(isValidUrl('https://example.com/path?foo=bar&baz=qux')).toBe(true);
		});

		it('should accept URLs with ports', () => {
			expect(isValidUrl('http://example.com:8080')).toBe(true);
			expect(isValidUrl('https://example.com:3000/path')).toBe(true);
		});

		it('should accept URLs with hash fragments', () => {
			expect(isValidUrl('https://example.com#section')).toBe(true);
			expect(isValidUrl('https://example.com/path#anchor')).toBe(true);
		});
	});

	describe('Invalid URL formats', () => {
		it('should reject URLs without protocol', () => {
			expect(isValidUrl('example.com')).toBe(false);
			expect(isValidUrl('www.example.com')).toBe(false);
		});

		it('should reject malformed URLs', () => {
			expect(isValidUrl('not a url')).toBe(false);
			expect(isValidUrl('http://')).toBe(false);
			expect(isValidUrl('://example.com')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(isValidUrl('')).toBe(false);
		});

		it('should reject malformed URLs', () => {
			// Note: ftp:// and file:// are actually valid URL protocols according to URL constructor
			// So we test for truly invalid/malformed URLs instead
			expect(isValidUrl('://example.com')).toBe(false);
			// Invalid protocol format
			expect(isValidUrl('not a url')).toBe(false);
		});
	});

	describe('Regression prevention', () => {
		it('should not throw errors on invalid input', () => {
			// Would catch if URL constructor throws unhandled exceptions
			const invalidInputs = ['', 'not a url', 'http://', '://invalid'];
			invalidInputs.forEach((input) => {
				expect(() => isValidUrl(input)).not.toThrow();
				expect(isValidUrl(input)).toBe(false);
			});
		});

		it('should handle edge cases gracefully', () => {
			// Would catch if edge cases cause crashes
			expect(isValidUrl('http://example.com')).toBe(true);
			expect(isValidUrl('https://example.com/path?query=value#hash')).toBe(true);
		});

		it('should consistently validate common URL patterns', () => {
			const validUrls = [
				'http://example.com',
				'https://example.com',
				'https://www.example.com',
				'https://example.com/path',
				'https://example.com:8080/path'
			];

			validUrls.forEach((url) => {
				expect(isValidUrl(url)).toBe(true);
			});
		});
	});
});
