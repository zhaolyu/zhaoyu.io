<script lang="ts">
	import { experienceData } from '$lib/constants/content';

	// Triple loop for smoother animation
	const items = [
		...experienceData.companies,
		...experienceData.companies,
		...experienceData.companies
	];
</script>

<section class="experience-ticker">
	<div class="fade-left"></div>
	<div class="fade-right"></div>

	<div class="ticker-container">
		{#each items as item}
			<div class="ticker-item">
				<span class="ticker-text">{item}</span>
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
		justify-content: center;
	}

	@media (min-width: 768px) {
		.ticker-item {
			margin: 0 3rem;
		}
	}

	.ticker-text {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-muted);
		font-family: var(--font-mono);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		transition: color 0.2s;
		cursor: default;
		white-space: nowrap;
	}

	@media (min-width: 768px) {
		.ticker-text {
			font-size: 1rem;
		}
	}

	.ticker-item:hover .ticker-text {
		color: var(--text-secondary);
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-33.33%);
		}
	}

	@media (max-width: 768px) {
		.fade-left,
		.fade-right {
			width: 4rem;
		}
	}
</style>
