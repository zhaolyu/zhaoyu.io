<script lang="ts">
  import { CaseStudyArticle } from '$lib/components/features/case-study';
  import {
    SITE_URL,
    caseStudyJsonLd,
    jsonLdScript,
    articleOgTags,
  } from '$lib/constants/structured-data';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let study = $derived(data.study);

  let canonicalUrl = $derived(`${SITE_URL}/work/${study.slug}`);
  let cardUrl = $derived(`${SITE_URL}/og/${study.slug}.png`);
  let studyScript = $derived(jsonLdScript(caseStudyJsonLd(study)));
  let ogTags = $derived(
    articleOgTags({
      datePublished: study.dateISO,
      dateModified: study.dateModified,
      tags: study.stack,
    }),
  );
</script>

<svelte:head>
  <title>{study.title} · Zhao Yu</title>
  <meta name="description" content={study.oneLiner} />

  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={`${study.title} · Zhao Yu`} />
  <meta property="og:description" content={study.oneLiner} />
  <meta property="og:image" content={cardUrl} />
  {#each ogTags as tag (`${tag.property}:${tag.content}`)}
    <meta property={tag.property} content={tag.content} />
  {/each}
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={study.title} />
  <meta property="twitter:description" content={study.oneLiner} />
  <meta property="twitter:image" content={cardUrl} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD from structured-data.ts, not user input -->
  {@html studyScript}
</svelte:head>

<main id="main" class="work-page">
  <a href="/#work" class="back-link">&larr; Selected work</a>
  <CaseStudyArticle {study} />
</main>

<style>
  .work-page {
    max-width: 48rem;
    margin: 0 auto;
    padding: 8rem 1.5rem 6rem;
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .work-page {
      padding: 6rem 1.5rem 4rem;
    }
  }
</style>
