/**
 * Validation utilities
 */

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Check if a string is not empty
 */
export function isNotEmpty(value: string | null | undefined): value is string {
	return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
