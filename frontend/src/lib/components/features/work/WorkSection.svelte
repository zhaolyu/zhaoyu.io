<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import { projectsData } from '$lib/constants/content';
</script>

<section class="work-section">
	<div class="work-header">
		<div class="header-badge">
			<div class="badge-line"></div>
			<h2 class="badge-text">Selected Architecture</h2>
		</div>
		<h3 class="work-headline">
			Systems that handle the <br />
			<span class="headline-accent">pulse of the market.</span>
		</h3>
	</div>

	<div class="projects-container">
		{#each projectsData.projects as project}
			<ProjectCard {...project} />
		{/each}
	</div>
</section>

<style>
	.work-section {
		padding: 8rem 1rem;
		max-width: 72rem;
		margin: 0 auto;
		background: var(--bg-primary);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s;
	}

	.work-header {
		margin-bottom: 5rem;
	}

	.header-badge {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.badge-line {
		height: 1px;
		width: 3rem;
		background: var(--border-color);
	}

	.badge-text {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: #60a5fa;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.work-headline {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--text-primary);
		max-width: 48rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.headline-accent {
		color: var(--text-muted);
	}

	.projects-container {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	@media (max-width: 768px) {
		.work-section {
			padding: 4rem 1rem;
		}

		.work-header {
			margin-bottom: 3rem;
		}
	}
</style>
