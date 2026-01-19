<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import { getDisplayProjects } from '$lib/constants/content';
	import { SectionHeader } from '$lib/components/ui';

	const displayProjects = getDisplayProjects();
</script>

<section id="work" class="work-section">
	<SectionHeader
		badge="Selected Architecture"
		headline="Systems that handle the <br />"
		accentText="pulse of the market."
	/>

	<div class="projects-container">
		{#each displayProjects as project}
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

	.projects-container {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	@media (max-width: 768px) {
		.work-section {
			padding: 4rem 1rem;
		}
	}
</style>
