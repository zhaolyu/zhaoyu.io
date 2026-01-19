<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import EngineeringNote from './EngineeringNote.svelte';
	import { notesData } from '$lib/constants/content';
	import { SectionHeader } from '$lib/components/ui';
	import { observeSection } from '$lib/utils/section-observer';

	let sectionVisible = $state(false);
	let notesSection: HTMLElement;

	onMount(() => {
		return observeSection(notesSection, {
			onVisible: () => {
				sectionVisible = true;
			},
			threshold: 0.1 // Override to trigger earlier for this section
		});
	});
</script>

<section id="notes" class="engineering-notes" bind:this={notesSection}>
	<SectionHeader
		badge="Digital Garden"
		headline="Engineering Notes."
		accentText=""
	/>
	<div class="section-description">
		A collection of architectural decisions, performance constraints, and trade-offs I've encountered in production.
	</div>

	{#if sectionVisible}
		<div class="notes-container" transition:fade={{ duration: 600 }}>
			{#each notesData.notes as note}
				<EngineeringNote
					title={note.title}
					date={note.date}
					tags={note.tags}
					content={note.content}
				/>
			{/each}
		</div>
	{/if}
</section>

<style>
	.engineering-notes {
		padding: 8rem 1rem;
		max-width: 72rem;
		margin: 0 auto;
		background: var(--bg-primary);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s;
	}

	.section-description {
		color: var(--text-secondary);
		font-size: 1.125rem;
		line-height: 1.75;
		font-weight: 300;
		max-width: 42rem;
		margin-bottom: 4rem;
		transition: color 0.2s;
	}

	.notes-container {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	@media (max-width: 768px) {
		.engineering-notes {
			padding: 4rem 1rem;
		}
	}
</style>
