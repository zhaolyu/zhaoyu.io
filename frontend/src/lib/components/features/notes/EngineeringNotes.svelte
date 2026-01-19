<script lang="ts">
	import EngineeringNote from './EngineeringNote.svelte';
	import { notesData } from '$lib/constants/content';
</script>

<section class="engineering-notes">
	<div class="notes-header">
		<div class="header-badge">
			<div class="badge-line"></div>
			<h2 class="badge-text">Engineering Notes</h2>
		</div>
		<h3 class="notes-headline">
			How I think about <br />
			<span class="headline-accent">performance constraints.</span>
		</h3>
	</div>

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

	.notes-header {
		margin-bottom: 4rem;
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

	.notes-headline {
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

	.notes-container {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	@media (max-width: 768px) {
		.engineering-notes {
			padding: 4rem 1rem;
		}

		.notes-header {
			margin-bottom: 3rem;
		}
	}
</style>
