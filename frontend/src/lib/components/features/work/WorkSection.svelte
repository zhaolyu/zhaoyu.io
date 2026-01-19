<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ProjectCard from './ProjectCard.svelte';
	import { getDisplayProjects } from '$lib/constants/content';
	import { SectionHeader } from '$lib/components/ui';
	import { observeSection } from '$lib/utils/section-observer';

	const displayProjects = getDisplayProjects();
	let sectionVisible = $state(false);
	let workSection: HTMLElement;

	onMount(() => {
		return observeSection(workSection, {
			onVisible: () => {
				sectionVisible = true;
			},
			threshold: 0.1 // Override to trigger earlier for this section
		});
	});
</script>

<section id="work" class="work-section" bind:this={workSection}>
	<SectionHeader
		badge="Selected Architecture"
		headline="Systems that handle the <br />"
		accentText="pulse of the market."
	/>

	{#if sectionVisible}
		<div class="projects-container" transition:fade={{ duration: 600 }}>
			{#each displayProjects as project}
				<ProjectCard {...project} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.work-section {
		padding: 8rem 1rem;
		padding-top: 10rem;
		max-width: 72rem;
		margin: 0 auto;
		background: var(--bg-primary);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s;
		scroll-margin-top: 2rem;
	}

	.projects-container {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	@media (max-width: 768px) {
		.work-section {
			padding: 8rem 1rem 4rem 1rem;
		}
	}
</style>
