<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { heroContent } from '$lib/constants/content';
	import { ROUTES } from '$lib/constants/routes';

	const mottoIcons = [
		'<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
		'<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
		'<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>'
	];

	function formatBio(bio: string): string {
		return bio
			.replace(/Zhao Yu/g, '<strong class="bio-name">Zhao Yu</strong>')
			.replace(/sub-1:25 half-marathon/g, '<span class="bio-link">sub-1:25 half-marathon</span>');
	}
</script>

<section class="hero">
	<div class="hero-background">
		<div class="grid-pattern"></div>
		<div class="radial-overlay"></div>
		<div class="blue-glow"></div>
	</div>

	<div class="hero-content">
		<div class="hero-badge" in:fly={{ y: -20, duration: 800, delay: 0 }}>
			<span class="badge-dot">
				<span class="dot-ping"></span>
				<span class="dot-core"></span>
			</span>
			{heroContent.badge}
		</div>

		<h1 class="hero-headline" in:fly={{ y: 20, duration: 800, delay: 200, easing: backOut }}>
			{heroContent.headline.primary}<br />
			<span class="headline-accent">{heroContent.headline.accent}</span>
		</h1>

		<p class="hero-bio" in:fly={{ y: 20, duration: 800, delay: 400 }}>
			{@html formatBio(heroContent.bio)}
		</p>

		<div class="hero-cta" in:fly={{ y: 10, duration: 800, delay: 600 }}>
			<a href={ROUTES.ABOUT} class="cta-primary">
				{heroContent.cta.primary}
			</a>
			<a href={ROUTES.BLOG} class="cta-secondary">
				{heroContent.cta.secondary}
			</a>
		</div>

		<div class="hero-motto" in:fade={{ duration: 1000, delay: 1000 }}>
			{#each heroContent.motto as item, index}
				<span class="motto-item">
					{@html mottoIcons[index]}
					{item}
				</span>
				{#if index < heroContent.motto.length - 1}
					<span class="motto-separator">•</span>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		min-height: 100vh;
		height: auto;
		overflow: visible;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s, border-color 0.2s;
		padding: 2rem 0;
	}

	@media (min-width: 768px) {
		.hero {
			height: 100vh;
			overflow: hidden;
			padding: 0;
		}
	}

	.hero-background {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.grid-pattern {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to right, rgba(128, 128, 128, 0.15) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(128, 128, 128, 0.15) 1px, transparent 1px);
		background-size: 24px 24px;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	:global(.dark) .grid-pattern {
		background-image: linear-gradient(to right, rgba(128, 128, 128, 0.07) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(128, 128, 128, 0.07) 1px, transparent 1px);
		opacity: 1;
	}

	.radial-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle 800px at 50% 50%, rgba(255, 255, 255, 0), var(--bg-primary));
		transition: background 0.2s;
	}

	.blue-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600px;
		height: 600px;
		background: rgba(59, 130, 246, 0.15);
		filter: blur(120px);
		border-radius: 50%;
		pointer-events: none;
		animation: breathe 4s ease-in-out infinite;
		transition: background 0.2s;
	}

	:global(.dark) .blue-glow {
		background: rgba(59, 130, 246, 0.1);
	}

	@keyframes breathe {
		0%,
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.7;
			transform: translate(-50%, -50%) scale(1.1);
		}
	}

	.hero-content {
		position: relative;
		z-index: 10;
		text-align: center;
		padding: 0 1rem;
		max-width: 80rem;
		width: 100%;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.hero-content {
			padding: 0 1rem;
		}
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		color: #3b82f6;
		font-size: 0.875rem;
		font-family: var(--font-mono);
		margin-bottom: 2rem;
		backdrop-filter: blur(4px);
		transition: background 0.2s, border-color 0.2s, color 0.2s;
	}

	:global(.dark) .hero-badge {
		background: rgba(30, 58, 138, 0.2);
		border-color: rgba(59, 130, 246, 0.2);
		color: #60a5fa;
	}

	.badge-dot {
		position: relative;
		display: flex;
		height: 0.5rem;
		width: 0.5rem;
	}

	.dot-ping {
		position: absolute;
		display: inline-flex;
		height: 100%;
		width: 100%;
		border-radius: 9999px;
		background: #3b82f6;
		opacity: 0.75;
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
		transition: background 0.2s;
	}

	:global(.dark) .dot-ping {
		background: #60a5fa;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.dot-core {
		position: relative;
		display: inline-flex;
		border-radius: 9999px;
		height: 0.5rem;
		width: 0.5rem;
		background: #3b82f6;
	}

	.hero-headline {
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		font-weight: 800;
		color: var(--text-primary);
		letter-spacing: -0.025em;
		margin-bottom: 1.5rem;
		line-height: 1.1;
		transition: color 0.2s;
	}

	.headline-accent {
		display: inline-block;
		background: linear-gradient(to right, #60a5fa, #818cf8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-bio {
		font-size: clamp(1.125rem, 2vw, 1.5rem);
		color: var(--text-secondary);
		font-weight: 300;
		letter-spacing: 0.025em;
		max-width: 48rem;
		margin: 0 auto 2.5rem;
		line-height: 1.75;
		transition: color 0.2s;
	}

	:global(.bio-name) {
		color: var(--text-primary);
		font-weight: 600;
		transition: color 0.2s;
	}

	:global(.bio-link) {
		border-bottom: 1px solid rgba(59, 130, 246, 0.3);
		color: var(--text-primary);
		padding-bottom: 0.125rem;
		transition: border-color 0.2s, color 0.2s;
		cursor: pointer;
	}

	:global(.dark) .hero-bio {
		color: #a3a3a3;
	}

	:global(.dark) .hero-bio :global(.bio-link) {
		color: #e5e5e5;
	}

	.hero-bio :global(.bio-link:hover) {
		border-bottom-color: #3b82f6;
	}

	:global(.dark) .hero-bio :global(.bio-link:hover) {
		border-bottom-color: #3b82f6;
	}

	.hero-cta {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 3rem;
	}

	.cta-primary,
	.cta-secondary {
		padding: 0.75rem 2rem;
		border-radius: 9999px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
		width: 100%;
		text-align: center;
	}

	.cta-primary {
		background: var(--text-primary);
		color: var(--bg-primary);
		font-weight: 800;
		transition: background 0.2s, color 0.2s;
	}

	.cta-primary:hover {
		background: var(--text-secondary);
	}

	:global(.dark) .cta-primary {
		background: #ffffff;
		color: #0a0a0a;
	}

	:global(.dark) .cta-primary:hover {
		background: #e5e5e5;
	}

	.cta-secondary {
		border: 1px solid var(--border-color);
		color: var(--text-secondary);
		font-weight: 500;
		transition: background 0.2s, border-color 0.2s, color 0.2s;
	}

	.cta-secondary:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	:global(.dark) .cta-secondary {
		border-color: #262626;
		color: #d1d5db;
	}

	:global(.dark) .cta-secondary:hover {
		background: #171717;
		color: #ffffff;
	}

	.hero-motto {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: #737373;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		transition: color 0.2s;
	}

	:global(.dark) .hero-motto {
		color: #737373;
	}

	.motto-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: default;
		transition: color 0.2s;
	}

	.motto-item:hover {
		color: #60a5fa;
	}

	:global(.dark) .motto-item:hover {
		color: #60a5fa;
	}

	.motto-item :global(svg) {
		width: 0.75rem;
		height: 0.75rem;
	}

	.motto-separator {
		display: none;
		color: #262626;
	}

	:global(.dark) .motto-separator {
		color: #262626;
	}

	@media (min-width: 768px) {
		.hero-cta {
			flex-direction: row;
			margin-bottom: 5rem;
		}

		.cta-primary,
		.cta-secondary {
			width: auto;
		}

		.hero-motto {
			flex-direction: row;
			gap: 3rem;
			font-size: 0.75rem;
		}

		.motto-separator {
			display: inline;
		}
	}
</style>
