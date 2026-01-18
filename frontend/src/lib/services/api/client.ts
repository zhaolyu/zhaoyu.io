/**
 * Base API client for making HTTP requests
 */

type RequestOptions = RequestInit & {
	params?: Record<string, string | number | boolean>;
};

/**
 * Base API client class
 */
export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = '') {
		this.baseUrl = baseUrl;
	}

	/**
	 * Build URL with query parameters
	 */
	private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
		const url = new URL(endpoint, this.baseUrl || window.location.origin);
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, String(value));
			});
		}

		return url.toString();
	}

	/**
	 * Make a fetch request with error handling
	 */
	private async request<T>(
		endpoint: string,
		options: RequestOptions = {}
	): Promise<T> {
		const { params, ...fetchOptions } = options;
		const url = this.buildUrl(endpoint, params);

		const response = await fetch(url, {
			...fetchOptions,
			headers: {
				'Content-Type': 'application/json',
				...fetchOptions.headers
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * GET request
	 */
	async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'GET'
		});
	}

	/**
	 * POST request
	 */
	async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * PUT request
	 */
	async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: 'DELETE'
		});
	}
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();
