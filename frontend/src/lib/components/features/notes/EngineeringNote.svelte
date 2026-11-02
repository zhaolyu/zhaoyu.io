<script lang="ts">
  import type { NoteSource } from '$lib/constants/content';

  interface Props {
    title: string;
    date: string;
    tags: string[];
    content: string[];
    /** The note's receipts. Rendered as a Sources list; never empty. */
    sources?: NoteSource[];
    /** When provided, the title links to its canonical /blog/{slug} page. */
    slug?: string;
    /** 'h1' on standalone /blog pages where the note is the document's top heading. */
    headingLevel?: 'h1' | 'h3';
  }

  let { title, date, tags, content, sources = [], slug, headingLevel = 'h3' }: Props = $props();

  /* Essay-lane blocks arrive as their own markup (h2, ul, ol, blockquote);
     wrapping those in <p> is invalid HTML the browser would mis-nest. Plain
     strings stay wrapped, so the two-paragraph corpus renders unchanged. */
  const BLOCK_RE = /^<(h[1-6]|ul|ol|blockquote|pre|figure)\b/;
</script>

<article class="engineering-note">
  <header class="note-header">
    <div class="note-meta">
      <time>{date}</time>
      <span class="separator">/</span>
      <div class="tags-container">
        {#each tags as tag (tag)}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    </div>
    <svelte:element this={headingLevel} class="note-title">
      {#if slug}
        <a href="/blog/{slug}">{title}</a>
      {:else}
        {title}
      {/if}
    </svelte:element>
  </header>
  <div class="note-content">
    {#each content as paragraph (paragraph)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- self-authored note content from content.ts, not user input -->
      {@html BLOCK_RE.test(paragraph) ? paragraph : `<p>${paragraph}</p>`}
    {/each}
  </div>
  {#if sources.length > 0}
    <aside class="note-sources">
      <h4 class="sources-heading">Sources</h4>
      <ul>
        {#each sources as source (source.label)}
          <li>
            {#if source.href}
              <a href={source.href} target="_blank" rel="noopener">{source.label}</a>
            {:else}
              <span>{source.label}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
  {#if slug}
    <a href="/blog/{slug}" class="permalink">Read as standalone note &rarr;</a>
  {/if}
</article>

<style>
  /* Sources are supporting apparatus, not body copy: mono/uppercase heading
     marks it as a classification, and the list sits a step down in colour so it
     reads as attribution rather than argument. */
  .note-sources {
    margin-top: var(--space-lg);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-subtle);
  }

  .sources-heading {
    margin: 0 0 var(--space-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .note-sources ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .note-sources li {
    margin-top: var(--space-2xs);
    color: var(--text-secondary);
    font-size: var(--type-xs);
    line-height: var(--leading-relaxed);
  }

  .note-sources a {
    color: var(--accent-primary-text);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .note-sources a:hover,
  .note-sources a:focus-visible {
    color: var(--text-primary);
  }

  /* The article is the product (brief P1): the text block holds a reading
     measure, not the page width. */
  .engineering-note {
    border-left: 2px solid var(--accent-primary-30);
    padding-left: var(--space-lg);
    padding-top: var(--space-xs);
    padding-bottom: var(--space-xs);
    max-width: calc(var(--measure-prose) + var(--space-lg));
    margin: var(--space-2xl) 0;
  }

  .note-header {
    margin-bottom: 1rem;
  }

  /* Wraps because it cannot shrink: main is a flex item with the default
     min-width:auto, so a nowrap meta row floors the whole page at its
     min-content width — 417px, which overflowed a 320px viewport. */
  .note-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--text-muted);
    margin-bottom: var(--space-xs);
  }

  .separator {
    color: var(--border-color);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .tag {
    color: var(--accent-primary-text);
  }

  /* A real document title: it was 20px, smaller than the home page's section
     headings. Sans over a serif body, the lethain/brandur split. */
  .note-title {
    font-size: var(--type-2xl);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
  }

  /* Inline citations inside note paragraphs (injected via {@html}). */
  .note-content :global(a) {
    color: var(--accent-primary-text);
    text-decoration: underline;
    text-decoration-color: var(--accent-primary-30);
    text-underline-offset: 2px;
  }

  .note-content :global(a:hover),
  .note-content :global(a:focus-visible) {
    text-decoration-color: currentColor;
  }

  /* Essay-lane block elements. Headings step down from the note title; lists
     keep body colour and rhythm. Scoped to .note-content so nothing outside
     the {@html} region inherits them. */
  .note-content :global(h2) {
    margin: var(--space-2xl) 0 var(--space-sm);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: var(--type-xl);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
  }

  .note-content :global(ul),
  .note-content :global(ol) {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
  }

  .note-content :global(li) {
    margin-top: 0.5rem;
    line-height: 1.75;
  }

  .note-title a {
    color: inherit;
    text-decoration: none;
  }

  .note-title a:hover {
    text-decoration: underline;
  }

  .permalink {
    display: inline-block;
    margin-top: 1.25rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .permalink:hover {
    text-decoration: underline;
  }

  /* Reading text: serif at 18px, regular weight, full ink. It was 16px at
     weight 300 in --text-secondary; none of the eight measured references sets
     body text below 400. */
  .note-content {
    max-width: var(--measure-prose);
    color: var(--text-primary);
    font-family: var(--font-serif);
    font-size: var(--type-md);
    font-weight: var(--weight-regular);
    line-height: var(--leading-relaxed);
  }

  .note-content :global(p) {
    margin-bottom: 1rem;
  }

  .note-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .note-content :global(code) {
    background: var(--bg-secondary);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--text-primary);
  }

  .note-content :global(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .engineering-note {
      padding-left: 1rem;
      margin: 2rem 0;
    }

    .note-title {
      font-size: var(--type-xl);
    }
  }
</style>
