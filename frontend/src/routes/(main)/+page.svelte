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
    // Deliberate easter egg for devtools visitors — the one sanctioned console.log
    // eslint-disable-next-line no-console
    console.log(
      `%c Interested in the architecture? \n%c Check out the source: https://github.com/zhaolyu/zhaoyu.io `,
      'font-weight: bold; font-size: 16px; color: #3b82f6;',
      'color: #a3a3a3;',
    );
  });
</script>

<svelte:head>
  <title>Zhao Yu | Senior Manager, Core Web at CNBC</title>
  <meta
    name="description"
    content="Senior Manager of Core Web for CNBC.com — leading the team behind a [redacted] user platform while staying hands-on in the architecture. AI Integration Lead and independent builder."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zhaoyu.io/" />
  <meta
    property="og:title"
    content="Zhao Yu — Senior Manager, Core Web at CNBC. Player-coach engineering leader."
  />
  <meta
    property="og:description"
    content="Senior Manager, Core Web at CNBC. [redacted], [redacted] users, AI Integration Lead, independent builder. Opinionated on latency, streaming interfaces, and production AI."
  />
  <meta property="og:image" content="https://zhaoyu.io/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://zhaoyu.io/" />
  <meta property="twitter:title" content="Zhao Yu — Senior Manager, Core Web at CNBC" />
  <meta
    property="twitter:description"
    content="Senior Manager, Core Web at CNBC. Engineering leader, AI Integration Lead, and independent builder, shipping at scale."
  />
  <meta property="twitter:image" content="https://zhaoyu.io/og-image.png" />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Zhao Yu",
      "jobTitle": "Senior Manager, Core Web",
      "url": "https://zhaoyu.io",
      "sameAs": ["https://github.com/zhaolyu"],
      "worksFor": {
        "@type": "Organization",
        "name": "CNBC"
      },
      "description": "Senior Manager of Core Web for CNBC.com, leading a team of 8 engineers and 2 QE while staying hands-on as an architect on high-performance isomorphic edge systems for [redacted] monthly users. AI Integration Lead and independent builder.",
      "knowsAbout": [
        "Engineering Leadership",
        "Edge Computing",
        "Akamai EdgeWorkers",
        "Isomorphic React",
        "SvelteKit",
        "AI-Assisted Software Engineering",
        "Agentic AI Workflows",
        "Performance Engineering",
        "Distributed Systems"
      ]
    }
  </script>
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
