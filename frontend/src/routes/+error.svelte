<script lang="ts">
	import { page } from '$app/stores';

	const error: App.Error | null = $page.error;
	const status: number = $page.status;
</script>

<svelte:head>
	<title>Error {status} - zhaoyu.io</title>
</svelte:head>

<article class="error-page">
	<div class="error-content">
		<h1>{status}</h1>
		<h2>
			{status === 404
				? 'Page Not Found'
				: status === 500
					? 'Internal Server Error'
					: 'Something Went Wrong'}
		</h2>
		{#if error}
			<p class="error-message">{error.message}</p>
		{/if}
		<div class="error-actions">
			<a href="/" class="btn">Go Home</a>
			<button on:click={() => window.location.reload()} class="btn btn-secondary">
				Reload Page
			</button>
		</div>
	</div>
</article>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		max-width: 600px;
	}

	h1 {
		font-size: 6rem;
		font-weight: bold;
		margin: 0;
		color: #3b82f6;
		line-height: 1;
	}

	h2 {
		font-size: 2rem;
		margin: 1rem 0;
		color: var(--text-primary);
	}

	.error-message {
		color: var(--text-secondary);
		margin: 1.5rem 0;
		font-size: 1.1rem;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
		display: inline-block;
	}

	.btn:hover {
		background: #2563eb;
	}

	.btn-secondary {
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
	}

	.btn-secondary:hover {
		background: var(--bg-primary);
	}
</style>
