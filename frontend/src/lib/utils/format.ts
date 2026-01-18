/**
 * General formatting utilities
 */

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
	return num.toLocaleString('en-US');
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(text: string): string {
	if (!text) return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert kebab-case to Title Case
 */
export function kebabToTitle(text: string): string {
	return text
		.split('-')
		.map((word) => capitalize(word))
		.join(' ');
}
