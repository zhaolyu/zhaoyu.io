<script lang="ts">
  import { onMount } from 'svelte';
  import { Hero } from '$lib/components/features/hero';
  import { ExperienceTicker } from '$lib/components/features/experience';
  import { Skills } from '$lib/components/features/skills';
  import { CareerChart } from '$lib/components/features/career-chart';
  import { WorkSection } from '$lib/components/features/work';
  import { BuilderWorkbench } from '$lib/components/features/builder';
  import { LatencySim } from '$lib/components/features/latency-sim';
  import { CodeManifesto } from '$lib/components/features/code-manifesto';
  import { EngineeringNotes } from '$lib/components/features/notes';
  import { Connect } from '$lib/components/features/connect';

  onMount(() => {
    console.log(
      `%c Interested in the architecture? \n%c Check out the source: https://github.com/zhaolyu/zhaoyu.io `,
      'font-weight: bold; font-size: 16px; color: #3b82f6;',
      'color: #a3a3a3;',
    );
  });
</script>

<svelte:head>
  <title>Zhao Yu | Principal Engineer & Independent Builder</title>
  <meta
    name="description"
    content="Principal Engineer specializing in high-scale media architecture and AI-augmented engineering. Building distributed systems by day, shipping side projects by night."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zhaoyu.io/" />
  <meta
    property="og:title"
    content="Zhao Yu — Systems Architect by Day. Building the Next Thing by Night."
  />
  <meta
    property="og:description"
    content="Principal Engineer at the intersection of high-scale architecture, AI-native engineering, and independent building. Latency simulations, architectural decisions, and career velocity."
  />
  <meta property="og:image" content="https://zhaoyu.io/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://zhaoyu.io/" />
  <meta property="twitter:title" content="Zhao Yu — Principal Engineer & Independent Builder" />
  <meta
    property="twitter:description"
    content="Systems Architect by Day. Building the Next Thing by Night."
  />
  <meta property="twitter:image" content="https://zhaoyu.io/og-image.png" />
</svelte:head>

<main class="main-container">
  <Hero />
  <ExperienceTicker />
  <Skills />
  <CareerChart />
  <WorkSection />
  <BuilderWorkbench />
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
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  :global(.main-container ::selection) {
    background: var(--accent-primary-30);
  }
</style>
