<script lang="ts">
	import { onMount } from 'svelte';
	import { draw } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { careerHistory } from '$lib/constants/content';
	import { createSectionObserver } from '$lib/utils/section-observer';

	let sectionVisible = $state(false);
	let animationKey = $state(0); // Counter key for forcing transition re-trigger
	let chartContainer: HTMLElement;

	const history = careerHistory.points;

	// SVG dimensions
	const width = 800;
	const height = 300;
	const padding = 40;

	// Helper to map data to pixels
	const getX = (i: number) => padding + (i / (history.length - 1)) * (width - padding * 2);
	const getY = (val: number) => height - padding - (val / 100) * (height - padding * 2);

	const pathD = `M ${history.map((h, i) => `${getX(i)},${getY(h.impact)}`).join(' L ')}`;
	const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

	onMount(() => {
		// Use createSectionObserver with enableReanimation to track when scrolling out
		// This allows us to reset sectionVisible when scrolled past, ensuring clean remount
		let hasScrolledPast = false;
		
		return createSectionObserver(chartContainer, {
			enableReanimation: true,
			onVisible: () => {
				// If we scrolled past, reset and remount to trigger animation
				if (hasScrolledPast) {
					sectionVisible = false;
					animationKey++;
					// Use setTimeout to ensure unmount happens before remount
					setTimeout(() => {
						sectionVisible = true;
					}, 0);
				} else {
					// First time - just set visible and increment key
					sectionVisible = true;
					animationKey++;
				}
				hasScrolledPast = false;
			},
			onScrolledPast: () => {
				hasScrolledPast = true;
			},
			threshold: 0.2
		});
	});
</script>

<section id="career" class="career-chart-section" bind:this={chartContainer}>
	<div class="chart-container">
		<div class="chart-header">
			<h2 class="section-badge">Career Velocity</h2>
			<h3 class="section-title">Consistent Upward Trajectory.</h3>
		</div>

		<div class="chart-wrapper">
			<svg viewBox="0 0 {width} {height}" class="chart-svg" class:visible={sectionVisible}>
				<defs>
					<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.2" />
						<stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
					</linearGradient>
				</defs>

				<path 
					d={areaD} 
					fill="url(#chartGradient)" 
					class="chart-area"
					class:visible={sectionVisible}
				/>

				{#if sectionVisible}
					{#key animationKey}
						<path
							d={pathD}
							fill="none"
							stroke="var(--accent-primary)"
							stroke-width="3"
							stroke-linecap="round"
							in:draw={{ duration: 2000, easing: cubicOut }}
						/>
					{/key}
				{/if}

				{#each history as point, i}
					{@const tooltipX = getX(i) - 75}
					{@const tooltipY = getY(point.impact) - 80}
					<g class="point-group" class:visible={sectionVisible}>
						<circle
							cx={getX(i)}
							cy={getY(point.impact)}
							r="6"
							class="chart-point"
							style="animation-delay: {1000 + i * 100}ms;"
						/>

						<text
							x={getX(i)}
							y={height - padding + 20}
							class="year-label"
							text-anchor="middle"
							style="animation-delay: {1000 + i * 100}ms;"
						>
							{point.year}
						</text>

						<text
							x={getX(i)}
							y={height - padding + 35}
							class="role-label"
							text-anchor="middle"
							style="animation-delay: {1200 + i * 100}ms;"
						>
							{point.role}
						</text>

						<foreignObject
							x={Math.max(padding - 75, Math.min(tooltipX, width - padding - 75))}
							y={Math.max(padding - 80, Math.min(tooltipY, height - padding - 10))}
							width="150"
							height="70"
							class="point-tooltip"
						>
							<div class="tooltip-content">
								<div class="tooltip-year">{point.year}</div>
								<div class="tooltip-role">{point.role}</div>
								<div class="tooltip-company">{point.company}</div>
							</div>
						</foreignObject>
					</g>
				{/each}
			</svg>
		</div>
	</div>
</section>

<style>
	.career-chart-section {
		padding: 6rem 1.5rem;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;
		scroll-margin-top: 0;
	}

	.chart-container {
		max-width: 80rem;
		margin: 0 auto;
	}

	.chart-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.section-badge {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: var(--accent-primary-light);
		letter-spacing: 0.25em;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
	}

	.section-title {
		font-size: clamp(1.875rem, 4vw, 2.25rem);
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
	}

	.chart-wrapper {
		position: relative;
		width: 100%;
		height: 300px;
	}

	@media (min-width: 768px) {
		.chart-wrapper {
			height: auto;
			aspect-ratio: 3 / 1;
		}
	}

	.chart-svg {
		width: 100%;
		height: 100%;
		overflow: visible;
		/* Ensure SVG always takes up space to prevent layout shifts */
		min-height: 300px;
	}

	.chart-area {
		opacity: 0;
		transition: opacity 1s 0.5s;
	}

	.chart-area.visible {
		opacity: 1;
	}

	.point-group {
		cursor: crosshair;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.point-group.visible {
		opacity: 1;
	}

	.chart-point {
		fill: var(--bg-primary);
		stroke: var(--accent-primary);
		stroke-width: 2;
		opacity: 0;
		animation: fade-in 0.3s ease-in-out forwards;
		transition: fill 0.2s;
	}

	.chart-point:hover {
		fill: var(--accent-primary);
	}

	.year-label {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		fill: var(--text-secondary);
		opacity: 0;
		animation: fade-in 0.3s ease-in-out forwards;
		transition: fill 0.2s;
	}

	.role-label {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		fill: var(--text-muted);
		opacity: 0;
		animation: fade-in 0.3s ease-in-out forwards;
		transition: fill 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.point-group:hover .year-label,
	.point-group:hover .role-label {
		fill: var(--text-primary);
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}

	.point-tooltip {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s;
	}

	.point-group:hover .point-tooltip {
		opacity: 1;
	}

	.tooltip-content {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		padding: 0.5rem;
		border-radius: 0.25rem;
		text-align: center;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		transition: background-color 0.2s, border-color 0.2s;
	}

	.tooltip-year {
		font-size: 0.625rem;
		color: var(--accent-primary-light);
		font-family: var(--font-mono);
		margin-bottom: 0.25rem;
	}

	.tooltip-role {
		font-size: 0.75rem;
		color: var(--text-primary);
		font-weight: 700;
		line-height: 1.2;
	}

	.tooltip-company {
		font-size: 0.5625rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		.career-chart-section {
			padding: 6rem 1rem 8rem 1rem;
			min-height: 500px;
		}

		.chart-header {
			margin-bottom: 2.5rem;
		}
	}
</style>