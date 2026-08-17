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
  import { buildSocialDescriptions } from '$lib/constants/content';

  // Human-facing descriptions follow the positioning flag; the agent-facing
  // layer below (JSON-LD, llms.txt) always carries the full picture.
  const { meta: metaDescription, twitter: twitterDescription } = buildSocialDescriptions();

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
  <title>Zhao Yu | Senior Manager, Engineering at Versant (CNBC Web &amp; Make It)</title>
  <meta name="description" content={metaDescription} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zhaoyu.io/" />
  <meta
    property="og:title"
    content="Zhao Yu — Senior Manager, Engineering at Versant (CNBC Web &amp; Make It). Player-coach engineering leader."
  />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:image" content="https://zhaoyu.io/og/site.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://zhaoyu.io/" />
  <meta
    property="twitter:title"
    content="Zhao Yu — Senior Manager, Engineering at Versant (CNBC Web &amp; Make It)"
  />
  <meta property="twitter:description" content={twitterDescription} />
  <meta property="twitter:image" content="https://zhaoyu.io/og/site.png" />

  <link rel="canonical" href="https://zhaoyu.io/" />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Zhao Yu",
      "jobTitle": "Senior Manager, Engineering",
      "url": "https://zhaoyu.io",
      "sameAs": ["https://github.com/zhaolyu"],
      "worksFor": {
        "@type": "Organization",
        "name": "Versant Media / CNBC"
      },
      "description": "Senior Manager, Engineering across the CNBC Web and Make It divisions, directing a 20-engineer organization across 3 web teams executing the platform rebuild of CNBC.com ([redacted], [redacted] subscribers) while staying hands-on in core architecture. [redacted] of CNBC's AI financial assistant, shipped to a [redacted] beta pilot, and AI Integration Lead for org-wide AI governance standards. Nine years of performance-first engineering: isomorphic Akamai edge systems for [redacted] monthly users at a [redacted] and zero-downtime infrastructure migrations.",
      "knowsAbout": [
        "Engineering Leadership",
        "AI Governance",
        "LLM Streaming Interfaces",
        "System Prompt Architecture",
        "Video Platforms",
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
