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
	const width = 1000;
	const height = 400;
	const padding = 50;
	const labelHeight = 60; // Extra space for labels below chart

	// Helper to map data to pixels
	const getX = (i: number) => padding + (i / (history.length - 1)) * (width - padding * 2);
	const getY = (val: number) => height - padding - (val / 100) * (height - padding * 2);

	const pathD = `M ${history.map((h, i) => `${getX(i)},${getY(h.impact)}`).join(' L ')}`;
	const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

	function triggerAnimation() {
		sectionVisible = true;
		animationKey++; // Increment key to force remount and re-trigger transition
	}

	onMount(() => {
		return createSectionObserver(chartContainer, {
			enableReanimation: true,
			onVisible: () => {
				triggerAnimation();
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
			<!-- Mobile: Show data points as list -->
			<div class="mobile-points-list">
				{#each history as point, i}
					<div class="mobile-point-item">
						<div class="mobile-point-year">{point.year}</div>
						<div class="mobile-point-role">{point.role}</div>
						<div class="mobile-point-company">{point.company}</div>
					</div>
				{/each}
			</div>
			
			<svg viewBox="0 0 {width} {height + labelHeight}" preserveAspectRatio="xMidYMin meet" class="chart-svg" class:visible={sectionVisible}>
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
							class="chart-line"
							in:draw={{ duration: 4000, easing: cubicOut }}
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
							y={height - padding + 18}
							class="year-label"
							text-anchor="middle"
							style="animation-delay: {1000 + i * 100}ms;"
						>
							{point.year}
						</text>

						<text
							x={getX(i)}
							y={height - padding + 32}
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
								<div class="flex flex-col items-center text-center">
									<span class="text-[10px] sm:text-xs font-bold tooltip-year-text">
										{point.year}
									</span>
									<span class="hidden md:block text-[10px] font-mono tooltip-title-text mt-1 uppercase tracking-wider">
										{point.role}
									</span>
								</div>
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
		padding-bottom: 3rem;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;
		scroll-margin-top: 0;
		position: relative;
		overflow: visible;
		margin-bottom: 2rem;
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
		height: 400px;
		margin-bottom: 4rem;
		overflow: visible;
	}

	.chart-svg {
		overflow: visible;
	}

	@media (min-width: 768px) {
		.career-chart-section {
			margin-bottom: 1rem;
		}

		.chart-wrapper {
			height: auto;
			aspect-ratio: 2.5 / 1;
			margin-bottom: 3rem;
		}
	}

	.chart-svg {
		width: 100%;
		height: 100%;
		overflow: visible;
		/* Ensure SVG always takes up space to prevent layout shifts */
		min-height: 400px;
	}

	@media (min-width: 768px) {
		.chart-svg {
			overflow: visible;
		}
	}

	@media (max-width: 767px) {
		.chart-svg {
			display: none;
		}
	}

	.chart-area {
		opacity: 0;
		transition: opacity 1s 0.5s;
	}

	.chart-area.visible {
		opacity: 1;
	}

	.chart-line {
		stroke-width: 3;
	}

	@media (max-width: 767px) {
		.chart-line {
			stroke-width: 4;
		}
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
		transition: fill 0.2s, stroke-width 0.2s, transform 0.2s;
	}

	@media (max-width: 767px) {
		.chart-point {
			stroke-width: 3;
			transform: scale(1.33);
		}
	}

	.chart-point:hover {
		fill: var(--accent-primary);
	}

	.year-label {
		font-size: clamp(0.75rem, 2vw, 0.875rem);
		font-family: var(--font-mono);
		fill: var(--text-primary);
		font-weight: 700;
		opacity: 0;
		animation: fade-in 0.3s ease-in-out forwards;
		transition: fill 0.2s;
	}

	.role-label {
		font-size: clamp(0.625rem, 1.8vw, 0.75rem);
		font-family: var(--font-mono);
		fill: var(--text-secondary);
		opacity: 0;
		animation: fade-in 0.3s ease-in-out forwards;
		transition: fill 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	@media (min-width: 768px) {
		.year-label {
			font-size: 0.7rem;
		}
		
		.role-label {
			font-size: 0.55rem;
			letter-spacing: 0.1em;
			word-spacing: 0.1em;
		}
	}

	@media (max-width: 767px) {
		.year-label {
			font-size: clamp(0.875rem, 3vw, 1rem);
			fill: var(--text-primary);
		}
		
		.role-label {
			font-size: clamp(0.625rem, 2vw, 0.75rem);
			visibility: visible;
			fill: var(--text-secondary);
		}
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

	.point-group:hover .point-tooltip,
	.point-group:active .point-tooltip {
		opacity: 1;
	}

	@media (max-width: 767px) {
		.point-tooltip {
			pointer-events: auto;
		}
		
		.point-group:active .point-tooltip {
			opacity: 1;
		}
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

	.tooltip-year-text {
		color: var(--text-secondary);
	}

	.tooltip-title-text {
		color: var(--text-muted);
	}

	.mobile-points-list {
		display: none;
	}

	@media (max-width: 767px) {
		.career-chart-section {
			padding: 4rem 1rem 12rem 1rem;
			min-height: auto;
			margin-bottom: 4rem;
		}

		.chart-header {
			margin-bottom: 2rem;
		}

		.chart-wrapper {
			height: 400px;
			margin-bottom: 4rem;
		}

		.mobile-points-list {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;
			margin-top: 2rem;
			margin-bottom: 2rem;
		}

		.mobile-point-item {
			background: var(--bg-secondary);
			border: 1px solid var(--border-color);
			border-radius: 0.5rem;
			padding: 1rem;
			text-align: left;
		}

		.mobile-point-year {
			font-size: 0.875rem;
			font-family: var(--font-mono);
			color: var(--accent-primary-light);
			font-weight: 700;
			margin-bottom: 0.25rem;
		}

		.mobile-point-role {
			font-size: 1rem;
			color: var(--text-primary);
			font-weight: 600;
			margin-bottom: 0.25rem;
		}

		.mobile-point-company {
			font-size: 0.75rem;
			color: var(--text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.chart-svg {
			min-height: 400px;
		}
	}
</style>