<script>
	import { onMount } from 'svelte';
	
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>zhaoyu.io - Personal Website</title>
</svelte:head>

<article class="home">
	<h1>Welcome to zhaoyu.io</h1>
	<p class="subtitle">Personal website and learning playground</p>
	
	<div class="demo-links">
		<h2>Framework Comparison Demo</h2>
		<p>Explore the differences between Astro and SvelteKit:</p>
		<ul>
			<li><a href="/about">About Page</a> - See SPA routing in action</li>
			<li><a href="/api-demo">API Demo</a> - Test API routes</li>
			<li><a href="/comparison">Framework Comparison</a> - Detailed comparison</li>
		</ul>
	</div>

	<div class="info-box">
		<h3>Current Setup: SvelteKit</h3>
		<p>This site uses SvelteKit with SPA mode enabled for optimal client-side routing.</p>
		<p>Navigation is smooth with no page reloads - true SPA experience!</p>
	</div>
</article>

<style>
	.home {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		margin-bottom: 3rem;
		transition: color 0.2s;
	}

	:global(.dark) .subtitle {
		color: #9ca3af;
	}

	.demo-links {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		transition: background 0.2s;
	}

	:global(.dark) .demo-links {
		background: #1f2937;
	}

	.demo-links h2 {
		margin-top: 0;
		font-size: 1.5rem;
	}

	.demo-links ul {
		list-style: none;
		padding: 0;
	}

	.demo-links li {
		padding: 0.75rem 0;
		border-bottom: 1px solid #e5e7eb;
		transition: border-color 0.2s;
	}

	:global(.dark) .demo-links li {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.demo-links li:last-child {
		border-bottom: none;
	}

	.demo-links a {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}

	.demo-links a:hover {
		text-decoration: underline;
	}

	.info-box {
		background: #eff6ff;
		border-left: 4px solid #3b82f6;
		padding: 1.5rem;
		border-radius: 6px;
		transition: background 0.2s, border-color 0.2s;
	}

	:global(.dark) .info-box {
		background: rgba(59, 130, 246, 0.1);
		border-left-color: #60a5fa;
	}

	.info-box h3 {
		margin-top: 0;
	}

	code {
		background: #1f2937;
		color: #f9fafb;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		transition: background 0.2s, color 0.2s;
	}

	:global(.dark) code {
		background: #374151;
		color: #f9fafb;
	}
</style>
