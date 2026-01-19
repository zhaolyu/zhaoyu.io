<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { ROUTES } from '$lib/constants/routes';
</script>

<nav class="nav">
	<div class="nav-container">
		<a href={ROUTES.HOME} class="nav-logo">zhaoyu.io</a>
		<div class="nav-right">
			<div class="nav-links">
				<a href={ROUTES.HOME}>Home</a>
				<a href={ROUTES.ABOUT}>About</a>
				<a href={ROUTES.BLOG}>Blog</a>
				<a href={ROUTES.API_DEMO}>API Demo</a>
				<a href={ROUTES.COMPARISON}>Comparison</a>
			</div>
			<ThemeToggle />
		</div>
	</div>
</nav>

<style>
	.nav {
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		position: sticky;
		top: 0;
		z-index: 100;
		transition: background 0.2s, border-color 0.2s;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-logo {
		font-weight: bold;
		font-size: 1.25rem;
		text-decoration: none;
		color: #111827;
		transition: color 0.2s;
	}

	:global(.dark) .nav-logo {
		color: #f9fafb;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-links a {
		text-decoration: none;
		color: #4b5563;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: #111827;
	}

	:global(.dark) .nav-links a {
		color: #9ca3af;
	}

	:global(.dark) .nav-links a:hover {
		color: #f9fafb;
	}
</style>
