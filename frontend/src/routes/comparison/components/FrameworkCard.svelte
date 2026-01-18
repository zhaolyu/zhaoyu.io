<script lang="ts">
	export let title: string;
	export let items: string[];
</script>

<div class="framework-card">
	<h3>{title}</h3>
	<ul>
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
</div>

<style>
	.framework-card {
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		transition: background 0.2s, border-color 0.2s;
	}

	:global(.dark) .framework-card {
		background: #1f2937;
		border-color: rgba(255, 255, 255, 0.1);
	}

	.framework-card h3 {
		margin-top: 0;
		font-size: 1.5rem;
		color: #3b82f6;
	}

	.framework-card ul {
		list-style: none;
		padding: 0;
	}

	.framework-card li {
		padding: 0.5rem 0;
		border-bottom: 1px solid #e5e7eb;
		transition: border-color 0.2s;
	}

	:global(.dark) .framework-card li {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.framework-card li:last-child {
		border-bottom: none;
	}
</style>
