<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { ROUTES } from '$lib/constants/routes';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
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
			<button
				class="mobile-menu-button"
				on:click={toggleMobileMenu}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				<svg
					class="hamburger-icon"
					class:open={mobileMenuOpen}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			</button>
		</div>
	</div>
	<div class="mobile-menu" class:open={mobileMenuOpen}>
		<a href={ROUTES.HOME} on:click={closeMobileMenu}>Home</a>
		<a href={ROUTES.ABOUT} on:click={closeMobileMenu}>About</a>
		<a href={ROUTES.BLOG} on:click={closeMobileMenu}>Blog</a>
		<a href={ROUTES.API_DEMO} on:click={closeMobileMenu}>API Demo</a>
		<a href={ROUTES.COMPARISON} on:click={closeMobileMenu}>Comparison</a>
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
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media (min-width: 768px) {
		.nav-container {
			padding: 1rem 2rem;
		}
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
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.nav-right {
			gap: 1.5rem;
		}
	}

	.nav-links {
		display: none;
		visibility: hidden;
		opacity: 0;
		position: absolute;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.nav-links {
			display: flex;
			visibility: visible;
			opacity: 1;
			position: static;
		}
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

	.mobile-menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: #4b5563;
		transition: color 0.2s;
	}

	.mobile-menu-button:hover {
		color: #111827;
	}

	:global(.dark) .mobile-menu-button {
		color: #9ca3af;
	}

	:global(.dark) .mobile-menu-button:hover {
		color: #f9fafb;
	}

	@media (min-width: 768px) {
		.mobile-menu-button {
			display: none;
		}
	}

	.hamburger-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease;
	}

	.hamburger-icon.open {
		transform: rotate(90deg);
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		gap: 0;
		max-height: 0;
		overflow: hidden;
		background: var(--bg-primary);
		border-top: 1px solid var(--border-color);
		transition: max-height 0.3s ease, padding 0.3s ease;
		padding: 0 1.5rem;
		position: relative;
		z-index: 99;
	}

	.mobile-menu.open {
		max-height: 500px;
		padding: 1rem 1.5rem;
	}

	.mobile-menu a {
		text-decoration: none;
		color: #4b5563;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--border-color);
		transition: color 0.2s;
		font-size: 1rem;
	}

	.mobile-menu a:last-child {
		border-bottom: none;
	}

	.mobile-menu a:hover {
		color: #111827;
	}

	:global(.dark) .mobile-menu {
		border-top-color: var(--border-color);
	}

	:global(.dark) .mobile-menu a {
		color: #9ca3af;
		border-bottom-color: var(--border-color);
	}

	:global(.dark) .mobile-menu a:hover {
		color: #f9fafb;
	}

	@media (min-width: 768px) {
		.mobile-menu {
			display: none;
		}
	}
</style>
