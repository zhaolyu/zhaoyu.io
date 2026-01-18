<script lang="ts">
	export let date: string;
	export let author: string = 'zhaoyu';
	export let tags: string[] = [];
</script>

<div class="post-meta">
	<time>{date}</time>
	<span class="separator">•</span>
	<span class="author">By {author}</span>
	{#if tags.length > 0}
		<span class="separator">•</span>
		<div class="tags">
			{#each tags as tag}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		color: var(--text-secondary);
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
	}

	.separator {
		color: var(--text-muted);
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		background: var(--bg-secondary);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}
</style>
