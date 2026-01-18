/**
 * API response type definitions
 */

export interface ApiResponse<T = unknown> {
	data?: T;
	error?: string;
	message?: string;
}

export interface TestApiResponse {
	message: string;
	timestamp: string;
	framework: string;
	features: string[];
	mode: string;
}
