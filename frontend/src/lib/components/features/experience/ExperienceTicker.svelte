<script lang="ts">
	import { experienceData } from '$lib/constants/content';

	// Memoize duplicated items for seamless infinite scroll
	// Only compute once, not on every render
	const tickerItems = $derived([
		...experienceData.items,
		...experienceData.items
	]);
</script>

<section class="experience-ticker">
	<div class="fade-left"></div>
	<div class="fade-right"></div>

	<div class="ticker-container">
		{#each tickerItems as item}
			<div class="ticker-item">
				<div
					class="status-dot"
					class:tech={item.type === 'tech'}
					class:org={item.type === 'org'}
				></div>
				<span class="ticker-text">{item.name}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.experience-ticker {
		width: 100%;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-primary);
		padding: 2rem 0;
		overflow: hidden;
		position: relative;
		transition: background-color 0.2s, border-color 0.2s;
	}

	.fade-left,
	.fade-right {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 8rem;
		z-index: 10;
		pointer-events: none;
	}

	.fade-left {
		left: 0;
		background: linear-gradient(to right, var(--bg-primary), transparent);
	}

	.fade-right {
		right: 0;
		background: linear-gradient(to left, var(--bg-primary), transparent);
	}

	.ticker-container {
		display: flex;
		width: max-content;
		animation: scroll 60s linear infinite;
	}

	.ticker-item {
		margin: 0 2rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		opacity: 0.5;
		transition: opacity 0.3s;
	}

	.ticker-item:hover {
		opacity: 1;
	}

	@media (min-width: 768px) {
		.ticker-item {
			margin: 0 3rem;
		}
	}

	.status-dot {
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-dot.tech {
		background: var(--accent-primary);
		box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
	}

	.status-dot.org {
		background: var(--text-muted);
	}

	.ticker-text {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		font-family: var(--font-mono);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		cursor: default;
		white-space: nowrap;
		transition: color 0.2s;
	}

	@media (min-width: 768px) {
		.ticker-text {
			font-size: 1rem;
		}
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@media (max-width: 768px) {
		.fade-left,
		.fade-right {
			width: 4rem;
		}
	}
</style>
