<script lang="ts">
	import BlogCard from './components/BlogCard.svelte';
	
	// TODO: Load blog posts from API or data source
	const posts: Array<{
		slug: string;
		title: string;
		excerpt: string;
		date: string;
	}> = [];
</script>

<svelte:head>
	<title>Blog - zhaoyu.io</title>
</svelte:head>

<article>
	<h1>Blog</h1>
	<p>Welcome to my blog. Posts coming soon!</p>
	
	{#if posts.length > 0}
		<div class="blog-grid">
			{#each posts as post}
				<BlogCard {...post} />
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>No blog posts yet. Check back soon!</p>
		</div>
	{/if}
</article>

<style>
	article {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.blog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--text-secondary);
	}
</style>
