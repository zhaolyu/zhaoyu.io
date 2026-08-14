<script lang="ts">
  import { notesData } from '$lib/constants/content';
  import { noteExcerpt } from '$lib/utils';

  const notes = notesData.notes;

  const canonicalUrl = 'https://zhaoyu.io/blog';
  const pageTitle = 'Engineering Notes — Zhao Yu';
  const description =
    'Engineering notes by Zhao Yu — architectural decisions, performance constraints, and AI-agent engineering lessons from production systems serving [redacted] monthly users.';

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: pageTitle,
    description,
    url: canonicalUrl,
    author: { '@type': 'Person', name: 'Zhao Yu', url: 'https://zhaoyu.io' },
    blogPost: notes.map((note) => ({
      '@type': 'TechArticle',
      headline: note.title,
      datePublished: note.dateISO,
      url: `https://zhaoyu.io/blog/${note.slug}`,
    })),
  });
  // Tag assembled from split parts: a literal script open/close token anywhere
  // in this component (even in a string or comment) ends the surrounding block.
  const jsonLdScript = '<scr' + 'ipt type="application/ld+json">' + jsonLd + '</scr' + 'ipt>';
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://zhaoyu.io/og/site.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html jsonLdScript}
</svelte:head>

<main class="blog-index">
  <a href="/" class="back-link">&larr; zhaoyu.io</a>
  <h1>Engineering Notes</h1>
  <p class="index-description">
    Architectural decisions, performance constraints, and trade-offs from production — CNBC-scale
    edge systems, AI-agent engineering, and the discipline that holds them together.
  </p>

  <ul class="note-list">
    {#each notes as note (note.slug)}
      <li class="note-item">
        <div class="note-meta">
          <time>{note.date}</time>
          <span class="separator">/</span>
          <div class="tags-container">
            {#each note.tags as tag (tag)}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
        <h2 class="note-title">
          <a href="/blog/{note.slug}">{note.title}</a>
        </h2>
        <p class="note-excerpt">{noteExcerpt(note, 220)}&hellip;</p>
      </li>
    {/each}
  </ul>
</main>

<style>
  .blog-index {
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

  h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .index-description {
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 4rem;
  }

  .note-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .note-item {
    border-left: 2px solid rgba(59, 130, 246, 0.3);
    padding: 0.5rem 0 0.5rem 1.5rem;
    margin: 3rem 0;
  }

  .note-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .separator {
    color: var(--border-color);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    color: var(--accent-primary-light);
  }

  .note-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 0.75rem;
  }

  .note-title a {
    color: inherit;
    text-decoration: none;
  }

  .note-title a:hover {
    text-decoration: underline;
  }

  .note-excerpt {
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
  }

  @media (max-width: 768px) {
    .blog-index {
      padding: 6rem 1.5rem 4rem;
    }

    .note-item {
      padding-left: 1rem;
      margin: 2rem 0;
    }

    .note-title {
      font-size: 1.125rem;
    }
  }
</style>
