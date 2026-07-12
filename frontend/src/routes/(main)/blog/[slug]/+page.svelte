<script lang="ts">
  import { EngineeringNote } from '$lib/components/features/notes';
  import { noteExcerpt } from '$lib/utils';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let note = $derived(data.note);

  let canonicalUrl = $derived(`https://zhaoyu.io/blog/${note.slug}`);
  let description = $derived(noteExcerpt(note));
  let jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: note.title,
      datePublished: note.dateISO,
      author: { '@type': 'Person', name: 'Zhao Yu', url: 'https://zhaoyu.io' },
      url: canonicalUrl,
      keywords: note.tags.join(', '),
    }),
  );
  // Tag assembled from split parts: a literal script open/close token anywhere
  // in this component (even in a string or comment) ends the surrounding block.
  let jsonLdScript = $derived(
    '<scr' + 'ipt type="application/ld+json">' + jsonLd + '</scr' + 'ipt>',
  );
</script>

<svelte:head>
  <title>{note.title} — Zhao Yu</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={`${note.title} — Zhao Yu`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://zhaoyu.io/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={note.title} />
  <meta property="twitter:description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html jsonLdScript}
</svelte:head>

<main class="blog-post">
  <a href="/blog" class="back-link">&larr; All notes</a>
  <EngineeringNote
    title={note.title}
    date={note.date}
    tags={note.tags}
    content={note.content}
    headingLevel="h1"
  />
</main>

<style>
  .blog-post {
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
    color: var(--accent-primary-light);
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
