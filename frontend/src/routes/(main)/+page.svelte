<script lang="ts">
  import { onMount } from 'svelte';
  import { Hero } from '$lib/components/features/hero';
  import { Skills } from '$lib/components/features/skills';
  import { WorkSection } from '$lib/components/features/work';
  import { EngineeringNotes } from '$lib/components/features/notes';
  import { MentalModels } from '$lib/components/features/models';
  import { CodeManifesto } from '$lib/components/features/code-manifesto';
  import { LatencySim } from '$lib/components/features/latency-sim';
  import { PersonaSection } from '$lib/components/features/persona';
  import { Connect } from '$lib/components/features/connect';
  import { socialDescriptions } from '$lib/constants/content';
  import {
    personJsonLd,
    jsonLdScript,
    SITE_URL,
    SITE_CARD_IMAGE,
  } from '$lib/constants/structured-data';

  const { meta: metaDescription, twitter: twitterDescription } = socialDescriptions;
  const personScript = jsonLdScript(personJsonLd());

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
  <title>Zhao Yu | Senior Manager, Engineering at Versant (CNBC Core)</title>
  <meta name="description" content={metaDescription} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="{SITE_URL}/" />
  <meta
    property="og:title"
    content="Zhao Yu · Senior Manager, Engineering at Versant (CNBC Core)"
  />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:image" content={SITE_CARD_IMAGE} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="{SITE_URL}/" />
  <meta
    property="twitter:title"
    content="Zhao Yu · Senior Manager, Engineering at Versant (CNBC Core)"
  />
  <meta property="twitter:description" content={twitterDescription} />
  <meta property="twitter:image" content={SITE_CARD_IMAGE} />

  <link rel="canonical" href="{SITE_URL}/" />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD from structured-data.ts, not user input -->
  {@html personScript}
</svelte:head>

<!-- Craft-first order: the writing and the mental models lead; the résumé
     material (About, then the sourced numbers) sits at the end, stated once.
     Models sit directly under the writing, and the code standards follow them:
     the standards are the worked examples a model cashes out into, not peers
     of the models themselves. Two sections cannot both be "mental models," so
     the manifesto badge names what it actually shows. -->
<main id="main" class="main-container">
  <Hero />
  <EngineeringNotes />
  <MentalModels />
  <CodeManifesto>
    <LatencySim />
  </CodeManifesto>
  <WorkSection />
  <PersonaSection />
  <Skills />
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
