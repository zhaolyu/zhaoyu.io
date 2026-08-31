<script lang="ts">
  import { EngineeringNote } from '$lib/components/features/notes';
  import { noteExcerpt } from '$lib/utils';
  import {
    SITE_URL,
    techArticleJsonLd,
    jsonLdScript,
    articleOgTags,
  } from '$lib/constants/structured-data';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let note = $derived(data.note);

  let canonicalUrl = $derived(`${SITE_URL}/blog/${note.slug}`);
  // Per-note card, so syndicated links don't all preview identically.
  let cardUrl = $derived(`${SITE_URL}/og/${note.slug}.png`);
  let description = $derived(noteExcerpt(note));
  let articleScript = $derived(jsonLdScript(techArticleJsonLd(note, description)));
  let ogTags = $derived(
    articleOgTags({
      datePublished: note.dateISO,
      dateModified: note.dateModified,
      tags: note.tags,
    }),
  );
</script>

<svelte:head>
  <title>{note.title} · Zhao Yu</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={`${note.title} · Zhao Yu`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={cardUrl} />
  {#each ogTags as tag (`${tag.property}:${tag.content}`)}
    <meta property={tag.property} content={tag.content} />
  {/each}
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={note.title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={cardUrl} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html articleScript}
</svelte:head>

<main id="main" class="blog-post">
  <a href="/blog" class="back-link">&larr; All notes</a>
  <EngineeringNote
    title={note.title}
    date={note.date}
    tags={note.tags}
    content={note.content}
    sources={note.sources}
    headingLevel="h1"
  />
</main>

<style>
  .blog-post {
    max-width: 48rem;
    /* A flex item's default min-width:auto refuses to shrink below its
       content's min-content width. Without this the page cannot narrow past
       whatever its widest unshrinkable child happens to be. */
    min-width: 0;
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
    .blog-post {
      padding: 6rem 1.5rem 4rem;
    }
  }
</style>
