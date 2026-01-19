<script lang="ts">
	import EngineeringNote from './EngineeringNote.svelte';
	import { notesData } from '$lib/constants/content';
	import { SectionHeader } from '$lib/components/ui';
</script>

<section id="notes" class="engineering-notes">
	<SectionHeader
		badge="Engineering Notes"
		headline="How I think about <br />"
		accentText="performance constraints."
	/>

	<div class="notes-container">
		{#each notesData.notes as note}
			<EngineeringNote
				title={note.title}
				date={note.date}
				tags={note.tags}
				content={note.content}
			/>
		{/each}
	</div>
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
