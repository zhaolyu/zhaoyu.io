<script lang="ts">
	import { onMount } from 'svelte';
	import { Hero } from '$lib/components/features/hero';
	import { ExperienceTicker } from '$lib/components/features/experience';
	import { Skills } from '$lib/components/features/skills';
	import { CareerChart } from '$lib/components/features/career-chart';
	import { WorkSection } from '$lib/components/features/work';
	import { LatencySim } from '$lib/components/features/latency-sim';
	import { CodeManifesto } from '$lib/components/features/code-manifesto';
	import { EngineeringNotes } from '$lib/components/features/notes';
	import { Connect } from '$lib/components/features/connect';

	onMount(() => {
		console.log(
			`%c Interested in the architecture? \n%c Check out the source: https://github.com/zhaolyu/zhaoyu.io `,
			'font-weight: bold; font-size: 16px; color: #3b82f6;',
			'color: #a3a3a3;'
		);
	});
</script>

<svelte:head>
	<title>Zhao Yu | Principal Engineer & Architect</title>
	<meta name="description" content="Principal Software Engineer specializing in High-Performance UI, React Architecture, and Systems at Scale." />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://zhaoyu.io/" />
	<meta property="og:title" content="Zhao Yu - Built for Speed. Engineered for Scale." />
	<meta property="og:description" content="Interactive portfolio of a Principal Engineer. Latency simulations, architectural decisions, and career velocity." />
	<meta property="og:image" content="https://zhaoyu.io/og-image.png" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://zhaoyu.io/" />
	<meta property="twitter:title" content="Zhao Yu - Principal Engineer" />
	<meta property="twitter:description" content="Built for Speed. Engineered for Scale." />
	<meta property="twitter:image" content="https://zhaoyu.io/og-image.png" />
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
	<Connect />
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
