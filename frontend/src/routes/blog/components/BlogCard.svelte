<script lang="ts">
	export let slug: string;
	export let title: string;
	export let excerpt: string;
	export let date: string;
</script>

<a href="/blog/{slug}" class="blog-card">
	<h3>{title}</h3>
	<p class="excerpt">{excerpt}</p>
	<time class="date">{date}</time>
</a>

<style>
	.blog-card {
		display: block;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	:global(.dark) .blog-card {
		background: #1f2937;
		border-color: rgba(255, 255, 255, 0.1);
	}

	.blog-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .blog-card:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		color: #3b82f6;
	}

	.excerpt {
		margin: 0.5rem 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.date {
		display: block;
		margin-top: 1rem;
		font-size: 0.875rem;
		color: var(--text-muted);
	}
</style>
