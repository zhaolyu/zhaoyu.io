<script lang="ts">
	export let data: any;
	export let error: string | null;
</script>

{#if error}
	<div class="error">Error: {error}</div>
{/if}

{#if data}
	<div class="result">
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
{/if}

<style>
	.error {
		margin-top: 1rem;
		padding: 1rem;
		background: #fee2e2;
		color: #991b1b;
		border-radius: 6px;
		transition: background 0.2s, color 0.2s;
	}

	:global(.dark) .error {
		background: rgba(239, 68, 68, 0.2);
		color: #fca5a5;
	}

	.result {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		transition: background 0.2s;
	}

	:global(.dark) .result {
		background: #111827;
	}

	pre {
		background: #1f2937;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.6;
		margin: 0;
	}
</style>
