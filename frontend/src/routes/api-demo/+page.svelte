<script lang="ts">
	import ApiResult from './components/ApiResult.svelte';

	let data: any = null;
	let loading = false;
	let error: string | null = null;

	async function fetchData() {
		loading = true;
		error = null;
		try {
			const response = await fetch('/api/test');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			data = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>API Demo - zhaoyu.io</title>
</svelte:head>

<article>
	<h1>API Route Demo</h1>
	<p>This page demonstrates API routes in SvelteKit.</p>
	
	<div class="api-demo">
		<button on:click={fetchData} disabled={loading} class="btn">
			{loading ? 'Loading...' : 'Fetch Data'}
		</button>
		
		<ApiResult {data} {error} />
	</div>
</article>

<style>
	article {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.api-demo {
		margin: 2rem 0;
		padding: 2rem;
		background: #f9fafb;
		border-radius: 8px;
		transition: background 0.2s;
	}

	:global(.dark) .api-demo {
		background: #1f2937;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.btn:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
