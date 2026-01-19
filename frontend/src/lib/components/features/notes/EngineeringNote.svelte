<script lang="ts">
	interface Props {
		title: string;
		date: string;
		tags: string[];
		content: string[];
	}

	let { title, date, tags, content }: Props = $props();
</script>

<article class="engineering-note">
	<header class="note-header">
		<div class="note-meta">
			<time>{date}</time>
			<span class="separator">/</span>
			<div class="tags-container">
				{#each tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</div>
		<h3 class="note-title">{title}</h3>
	</header>
	<div class="note-content">
		{#each content as paragraph}
			{@html `<p>${paragraph}</p>`}
		{/each}
	</div>
</article>

<style>
	.engineering-note {
		border-left: 2px solid rgba(59, 130, 246, 0.3);
		padding-left: 1.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		max-width: 48rem;
		margin: 3rem 0;
	}

	.note-header {
		margin-bottom: 1rem;
	}

	.note-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}

	.separator {
		color: var(--border-color);
	}

	.tags-container {
		display: flex;
		gap: 0.5rem;
	}

	.tag {
		color: #60a5fa;
	}

	.note-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.note-content {
		color: var(--text-secondary);
		line-height: 1.75;
		font-weight: 300;
	}

	.note-content :global(p) {
		margin-bottom: 1rem;
	}

	.note-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.note-content :global(code) {
		background: var(--bg-secondary);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: #93c5fd;
	}

	.note-content :global(strong) {
		font-weight: 600;
		color: var(--text-primary);
	}

	@media (max-width: 768px) {
		.engineering-note {
			padding-left: 1rem;
			margin: 2rem 0;
		}

		.note-title {
			font-size: 1.125rem;
		}
	}
</style>
