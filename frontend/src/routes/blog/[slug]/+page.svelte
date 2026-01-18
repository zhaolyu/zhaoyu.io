<script lang="ts">
	import { page } from '$app/stores';
	import PostMeta from '../components/PostMeta.svelte';
	
	// TODO: Load post data from +page.ts
	const slug = $page.params.slug;
	
	// Placeholder data
	const post = {
		title: 'Sample Blog Post',
		content: 'This is a sample blog post. Content will be loaded from a data source.',
		date: new Date().toISOString(),
		author: 'zhaoyu',
		tags: ['sveltekit', 'web-dev']
	};
</script>

<svelte:head>
	<title>{post.title} - zhaoyu.io</title>
</svelte:head>

<article class="blog-post">
	<h1>{post.title}</h1>
	<PostMeta date={post.date} author={post.author} tags={post.tags} />
	<div class="content">
		<p>{post.content}</p>
	</div>
	<div class="back-link">
		<a href="/blog">← Back to Blog</a>
	</div>
</article>

<style>
	.blog-post {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.content {
		line-height: 1.8;
		color: var(--text-primary);
	}

	.back-link {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-color);
	}

	.back-link a {
		color: #3b82f6;
		text-decoration: none;
		transition: color 0.2s;
	}

	.back-link a:hover {
		color: #2563eb;
		text-decoration: underline;
	}
</style>
