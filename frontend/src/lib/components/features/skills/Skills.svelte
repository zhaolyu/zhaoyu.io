<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { skillsData } from '$lib/constants/content';

	let sectionVisible = $state(false);
	let skillsContainer: HTMLElement;

	const progress = tweened(0, {
		duration: 3000,
		easing: cubicOut
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionVisible = true;
						// Reset and re-animate each time section comes into view
						progress.set(0);
						setTimeout(() => {
							progress.set(1);
						}, 100);
					} else {
						// Reset progress when section leaves view so it can re-animate
						progress.set(0);
						sectionVisible = false;
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -50px 0px'
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

	const currentPoints = $derived(
		skillsData.skills
			.map((skill, i) => getPoint(i, skillsData.skills.length, skill.value * $progress))
			.join(' ')
	);

	const goalPoints = $derived(
		skillsData.skills
			.map((skill, i) => getPoint(i, skillsData.skills.length, skill.goal ?? skill.value))
			.join(' ')
	);

	const maxPoints = $derived(
		skillsData.skills.map((_, i) => getPoint(i, skillsData.skills.length, 100)).join(' ')
	);
</script>

<section id="skills" class="skills" bind:this={skillsContainer}>
	<div class="skills-container">
		{#if sectionVisible}
			<div class="skills-content" transition:fade={{ duration: 600 }}>
				<div class="skills-text">
					<div class="skills-badge">
						<span class="badge-dot"></span>
						<h2 class="badge-text">The T-Shaped Engineer</h2>
					</div>
					<h3 class="skills-headline">
						Authority in <span class="highlight-blue">UI</span>.<br />
						Expanding to <span class="highlight-purple">Full Stack</span>.
					</h3>
					<p class="skills-description">
						I specialize in high-performance frontend architecture.
						In 2026, I am actively closing the gap between client and server,
						bringing my <span class="highlight-text">discipline and metrics</span> to the backend.
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
						<div class="stat-card">
							<div class="stat-value">{skillsData.stats.halfMarathon}</div>
							<div class="stat-label">Half Marathon</div>
						</div>
					</div>

					<div class="legend">
						<div class="legend-item">
							<span class="legend-indicator legend-current"></span>
							<span class="legend-text">Current</span>
						</div>
						<div class="legend-item">
							<span class="legend-indicator legend-goal"></span>
							<span class="legend-text">2026 Target</span>
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
							<polygon
								transition:fade={{ duration: 1500, delay: 500 }}
								points={goalPoints}
								class="chart-goal"
							/>
							<polygon transition:fade={{ duration: 1000 }} points={currentPoints} class="chart-fill" />
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
		border-bottom: 1px solid var(--border-color, #262626);
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
		max-width: 32rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
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
		box-shadow: 0 0 10px #3b82f6;
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

	@keyframes deep-pulse {
		0%,
		100% {
			opacity: 0.8;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
	}

	.badge-text {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #60a5fa;
	}

	.skills-headline {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		line-height: 1.1;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.highlight-blue {
		color: #60a5fa;
	}

	.highlight-purple {
		color: #c084fc;
	}

	.highlight-text {
		color: var(--text-primary);
		font-weight: 600;
	}

	.skills-description {
		font-size: 1.125rem;
		line-height: 1.75;
		color: var(--text-secondary);
		font-weight: 300;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		padding-top: 1rem;
	}

	.stat-card {
		padding: 1rem 0.5rem;
		border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
		border-radius: 0.5rem;
		background: var(--bg-secondary, rgba(255, 255, 255, 0.03));
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s, border-color 0.2s;
	}

	.stat-card:hover {
		border-color: #3b82f6;
		transform: translateY(-2px);
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
		font-family: var(--font-mono);
	}

	.stat-label {
		font-size: 0.65rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		color: var(--text-muted);
		letter-spacing: 0.05em;
	}

	.skills-chart {
		position: relative;
		width: 300px;
		height: 300px;
	}

	.chart-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
		border-radius: 50%;
		filter: blur(40px);
		pointer-events: none;
		animation: deep-pulse 4s ease-in-out infinite;
	}

	.chart-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.1));
	}

	.chart-max {
		fill: rgba(20, 20, 20, 0.5);
		stroke: #404040;
		stroke-width: 1;
	}

	.chart-mid {
		fill: transparent;
		stroke: #404040;
		stroke-width: 1;
		stroke-dasharray: 4, 4;
		opacity: 0.5;
	}

	.chart-fill {
		fill: rgba(59, 130, 246, 0.15);
		stroke: #3b82f6;
		stroke-width: 2;
	}

	.chart-goal {
		fill: transparent;
		stroke: #a855f7;
		stroke-width: 1.5;
		stroke-dasharray: 4, 4;
		opacity: 0.6;
	}

	.chart-dot {
		fill: #ffffff;
		stroke: #3b82f6;
		stroke-width: 1px;
	}

	.chart-label {
		fill: #737373;
		font-size: 10px;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 500;
	}

	.legend {
		display: flex;
		gap: 1.5rem;
		margin-top: 1.5rem;
		font-size: 0.625rem;
		text-transform: uppercase;
		font-family: var(--font-mono);
		letter-spacing: 0.1em;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-indicator {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 0.125rem;
	}

	.legend-current {
		background: rgba(59, 130, 246, 0.2);
		border: 1px solid #3b82f6;
	}

	.legend-goal {
		border: 1px dashed #a855f7;
		background: transparent;
	}

	.legend-text {
		color: var(--text-secondary);
	}

	.legend-item:last-child .legend-text {
		color: #c084fc;
	}

	@media (min-width: 768px) {
		.skills-content {
			flex-direction: row;
			gap: 6rem;
		}

		.skills-chart {
			width: 450px;
			height: 450px;
		}

		.chart-label {
			font-size: 11px;
		}

		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.stat-value {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 767px) {
		.skills {
			padding: 4rem 1.5rem;
		}

		.skills-content {
			gap: 3rem;
		}

		.stats-grid {
			gap: 0.5rem;
		}

		.stat-label {
			font-size: 0.6rem;
		}
	}
</style>
