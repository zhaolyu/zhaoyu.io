<script lang="ts">
  import { onMount } from 'svelte';
  import { Hero } from '$lib/components/features/hero';
  import { ExperienceTicker } from '$lib/components/features/experience';
  import { Skills } from '$lib/components/features/skills';
  import { CareerChart } from '$lib/components/features/career-chart';
  import { WorkSection } from '$lib/components/features/work';
  import { PersonaSection } from '$lib/components/features/persona';
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
  <title>Zhao Yu | Principal Engineer at Versant / CNBC</title>
  <meta
    name="description"
    content="Principal Engineer co-leading the 2026 rebuild of CNBC.com. AI product architect, team lead for 20 engineers, and AI governance across 3 teams."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zhaoyu.io/" />
  <meta
    property="og:title"
    content="Zhao Yu — Principal Engineer. Building CNBC's Next Platform."
  />
  <meta
    property="og:description"
    content="Co-leading 20 engineers on the ground-up 2026 rebuild of CNBC.com. Shipped CNBC's first AI product in four months. AI governance at scale."
  />
  <meta property="og:image" content="https://zhaoyu.io/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://zhaoyu.io/" />
  <meta property="twitter:title" content="Zhao Yu — Principal Engineer at Versant / CNBC" />
  <meta
    property="twitter:description"
    content="Building CNBC's next platform. AI product architect and team lead."
  />
  <meta property="twitter:image" content="https://zhaoyu.io/og-image.png" />
</svelte:head>

<main class="main-container">
  <Hero />
  <ExperienceTicker />
  <Skills />
  <CareerChart />
  <WorkSection />
  <PersonaSection />
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
