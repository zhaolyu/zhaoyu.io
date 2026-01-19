<script lang="ts">
	import { Hero } from '$lib/components/features/hero';
	import { ExperienceTicker } from '$lib/components/features/experience';
	import { Skills } from '$lib/components/features/skills';
	import { CareerChart } from '$lib/components/features/career-chart';
	import { WorkSection } from '$lib/components/features/work';
	import { LatencySim } from '$lib/components/features/latency-sim';
	import { CodeManifesto } from '$lib/components/features/code-manifesto';
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
	<CareerChart />
	<WorkSection />
	<LatencySim />
	<CodeManifesto />
	<EngineeringNotes />
</main>

<style>
	.main-container {
		background: var(--bg-primary);
		min-height: 100vh;
		color: var(--text-primary);
		font-family: var(--font-sans);
		transition: background-color 0.2s, color 0.2s;
	}

	:global(.main-container ::selection) {
		background: var(--accent-primary-30);
	}
</style>
