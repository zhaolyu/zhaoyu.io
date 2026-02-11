<svelte:head>
	<title>About - zhaoyu.io</title>
</svelte:head>

<article>
	<h1>About</h1>
	<p>This is an example page to demonstrate SvelteKit's built-in SPA routing.</p>
	<p>Notice how the navigation persists and the page transition is smooth - no page reloads!</p>
	<p>SvelteKit provides true client-side routing out of the box, making it perfect for SPA experiences.</p>
	<a href="/">← Back to Home</a>
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

	p {
		line-height: 1.6;
		margin-bottom: 1rem;
		color: #4b5563;
		transition: color 0.2s;
	}

	:global(.dark) p {
		color: #d1d5db;
	}

	a {
		color: #3b82f6;
		text-decoration: none;
		display: inline-block;
		margin-top: 2rem;
		transition: color 0.2s;
	}

	:global(.dark) a {
		color: #60a5fa;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
