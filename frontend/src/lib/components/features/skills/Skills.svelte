<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { skillsData } from '$lib/constants/content';

	let sectionVisible = $state(false);
	let skillsContainer: HTMLElement;

	const progress = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionVisible = true;
						progress.set(0);
						setTimeout(() => {
							progress.set(1);
						}, 100);
					} else {
						progress.set(0);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		if (skillsContainer) {
			observer.observe(skillsContainer);
		}

		return () => {
			observer.disconnect();
		};
	});

	function getPoint(index: number, total: number, value: number): string {
		const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
		const radius = (value / 100) * 120;
		const x = Math.cos(angle) * radius + 200;
		const y = Math.sin(angle) * radius + 200;
		return `${x},${y}`;
	}

	const points = $derived(
		skillsData.skills
			.map((skill, i) => getPoint(i, skillsData.skills.length, skill.value * $progress))
			.join(' ')
	);

	const maxPoints = $derived(
		skillsData.skills.map((_, i) => getPoint(i, skillsData.skills.length, 100)).join(' ')
	);
</script>

<section class="skills" bind:this={skillsContainer}>
	<div class="skills-container">
		{#if sectionVisible}
			<div class="skills-content" transition:fade={{ duration: 400 }}>
				<div class="skills-text">
					<div class="skills-badge">
						<span class="badge-dot"></span>
						<h2 class="badge-text">The T-Shaped Engineer</h2>
					</div>
					<h3 class="skills-headline">
						Depth in <span class="highlight-blue">UI</span>.<br />
						Breadth in <span class="highlight-purple">Systems</span>.
					</h3>
					<p class="skills-description">
						I don't just specialize in one layer. My expertise spans the entire product lifecycle, with a "spike" in high-performance UI engineering.
					</p>

					<div class="stats-grid">
						<div class="stat-card">
							<div class="stat-value">{skillsData.stats.yearsExp}</div>
							<div class="stat-label">Years Exp</div>
						</div>
						<div class="stat-card">
							<div class="stat-value">{skillsData.stats.lighthouse}</div>
							<div class="stat-label">Lighthouse</div>
						</div>
					</div>
				</div>

				<div class="skills-chart">
					<div class="chart-glow"></div>
					<svg viewBox="0 0 400 400" class="chart-svg">
						<polygon points={maxPoints} class="chart-max" />
						<polygon
							points={skillsData.skills
								.map((_, i) => getPoint(i, skillsData.skills.length, 50))
								.join(' ')}
							class="chart-mid"
						/>

						{#if $progress > 0}
							<polygon transition:fade={{ duration: 1000 }} points={points} class="chart-fill" />
							{#each skillsData.skills as skill, i}
								{@const coords = getPoint(i, skillsData.skills.length, skill.value * $progress).split(',').map(Number)}
								<circle cx={coords[0]} cy={coords[1]} r="4" class="chart-dot" />
							{/each}
						{/if}

						{#each skillsData.skills as skill, i}
							{@const coords = getPoint(i, skillsData.skills.length, 135).split(',').map(Number)}
							<text
								x={coords[0]}
								y={coords[1]}
								text-anchor="middle"
								dominant-baseline="middle"
								class="chart-label"
							>
								{skill.name}
							</text>
						{/each}
					</svg>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.skills {
		width: 100%;
		padding: 6rem 2rem;
		background: var(--bg-primary);
		transition: background-color 0.2s;
	}

	.skills-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.skills-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3rem;
	}

	.skills-text {
		max-width: 28rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.skills-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.badge-dot {
		width: 0.5rem;
		height: 0.5rem;
		background: #3b82f6;
		border-radius: 9999px;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.badge-text {
		font-family: ui-monospace, 'Courier New', monospace;
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #60a5fa;
	}

	.skills-headline {
		font-size: clamp(2rem, 5vw, 2.5rem);
		font-weight: 800;
		line-height: 1.2;
		color: var(--text-primary);
	}

	.highlight-blue {
		color: #3b82f6;
	}

	.highlight-purple {
		color: #a855f7;
	}

	.skills-description {
		font-size: 1rem;
		line-height: 1.75;
		color: var(--text-secondary);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		padding-top: 1rem;
	}

	.stat-card {
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-secondary);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		font-family: ui-monospace, 'Courier New', monospace;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.skills-chart {
		position: relative;
		width: 300px;
		height: 300px;
	}

	.chart-glow {
		position: absolute;
		inset: 0;
		background: rgba(59, 130, 246, 0.2);
		border-radius: 50%;
		filter: blur(100px);
		pointer-events: none;
	}

	.chart-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.25));
	}

	.chart-max {
		fill: var(--bg-secondary);
		stroke: var(--border-color);
		stroke-width: 1;
	}

	.chart-mid {
		fill: transparent;
		stroke: var(--border-color);
		stroke-width: 1;
		stroke-dasharray: 4, 4;
	}

	.chart-fill {
		fill: rgba(59, 130, 246, 0.2);
		stroke: #3b82f6;
		stroke-width: 2;
	}

	.chart-dot {
		fill: #ffffff;
	}

	.chart-label {
		fill: var(--text-secondary);
		font-size: 10px;
		font-family: ui-monospace, 'Courier New', monospace;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	@media (min-width: 768px) {
		.skills-content {
			flex-direction: row;
			gap: 4rem;
		}

		.skills-chart {
			width: 400px;
			height: 400px;
		}

		.chart-label {
			font-size: 11px;
		}
	}

	@media (max-width: 767px) {
		.skills {
			padding: 4rem 1.5rem;
		}

		.skills-content {
			gap: 2.5rem;
		}

		.skills-text {
			max-width: 100%;
		}
	}
</style>
