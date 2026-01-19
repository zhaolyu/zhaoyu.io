<script lang="ts">
	import { Hero } from '$lib/components/features/hero';
	import { ExperienceTicker } from '$lib/components/features/experience';
	import { Skills } from '$lib/components/features/skills';
	import { WorkSection } from '$lib/components/features/work';
	import { EngineeringNotes } from '$lib/components/features/notes';
</script>

<svelte:head>
	<title>Zhao Yu - Principal Engineer | zhaoyu.io</title>
	<meta name="description" content="Principal Engineer in big media. Systems architect and athlete. Built for speed, engineered for scale." />
</svelte:head>

<main class="main-container">
	<Hero />
	<ExperienceTicker />
	<Skills />
	<WorkSection />
	<EngineeringNotes />
</main>

<style>
	.main-container {
		background: #0a0a0a;
		min-height: 100vh;
		color: #ffffff;
		font-family: var(--font-sans);
	}

	:global(.main-container ::selection) {
		background: rgba(59, 130, 246, 0.3);
	}
</style>
