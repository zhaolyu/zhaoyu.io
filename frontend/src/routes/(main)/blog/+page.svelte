<script lang="ts">
  import { notesData } from '$lib/constants/content';
  import { noteExcerpt, groupNotesByMonth } from '$lib/utils';
  import {
    PERSON,
    SITE_URL,
    SITE_CARD_IMAGE,
    techArticleJsonLd,
    jsonLdScript,
  } from '$lib/constants/structured-data';

  const notes = notesData.notes;
  // Grouped rather than per-row dated: a month that saw several notes would
  // otherwise print the same date once per row.
  const noteGroups = groupNotesByMonth(notes);

  const canonicalUrl = `${SITE_URL}/blog`;
  const pageTitle = 'Engineering Notes · Zhao Yu';
  const description =
    'Engineering notes by Zhao Yu: architectural decisions, performance constraints, and AI-agent engineering lessons from production news systems at national scale.';

  const blogScript = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: pageTitle,
    description,
    url: canonicalUrl,
    author: PERSON,
    blogPost: notes.map((note) => {
      // Embedded posts carry the same keys as their own pages, minus @context.
      const { '@context': _context, ...article } = techArticleJsonLd(note, noteExcerpt(note));
      return article;
    }),
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={SITE_CARD_IMAGE} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html blogScript}
</svelte:head>

<main id="main" class="blog-index">
  <a href="/" class="back-link">&larr; zhaoyu.io</a>
  <h1>Engineering Notes</h1>
  <p class="index-description">
    Architectural decisions, performance constraints, and trade-offs from production: CNBC-scale
    edge systems, AI-agent engineering, and the discipline that holds them together.
  </p>

  {#each noteGroups as group (group.monthISO)}
    <section class="note-group">
      {#if group.label}
        <h2 class="group-heading">
          <time datetime={group.monthISO}>{group.label}</time>
        </h2>
      {/if}
      <ul class="note-list">
        {#each group.notes as note (note.slug)}
          <li class="note-item">
            <div class="note-meta">
              <div class="tags-container">
                {#each note.tags as tag (tag)}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
            <h3 class="note-title">
              <a href="/blog/{note.slug}">{note.title}</a>
            </h3>
            <p class="note-excerpt">{noteExcerpt(note, 220)}&hellip;</p>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
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
    color: var(--accent-primary-text);
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

  /* The month heading carries the date for every note beneath it, so the rows
     themselves show only tags. Set in mono/uppercase like the other
     classification labels on the site, and sized down so it reads as an
     archive divider rather than competing with the note titles. */
  .note-group {
    margin-top: var(--space-3xl);
  }

  .note-group:first-of-type {
    margin-top: var(--space-xl);
  }

  .group-heading {
    margin: 0;
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
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

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    color: var(--accent-primary-text);
  }

  /* Tags are the only thing left in the meta row now that the date moved to the
     month heading, so they need a separator to stop reading as one long string.
     Matches the interpunct used in the hero badge. */
  .tag:not(:last-child)::after {
    content: ' ·';
    color: var(--border-color);
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
