<script lang="ts">
  import type { EngineeringNote } from '$lib/constants/content';
  import { noteExcerpt } from '$lib/utils';

  interface Props {
    /** The note to preview. Its canonical page is /blog/{note.slug}. */
    note: EngineeringNote;
  }

  let { note }: Props = $props();

  /** Enough prose to fill the two-line dek at the narrowest card width. */
  const EXCERPT_LENGTH = 130;

  const excerpt = $derived(noteExcerpt(note, EXCERPT_LENGTH));
</script>

<article class="note-card">
  <div class="note-meta">
    <time datetime={note.dateISO}>{note.date}</time>
    <span class="separator" aria-hidden="true">/</span>
    <ul class="tags">
      {#each note.tags as tag (tag)}
        <li class="tag">{tag}</li>
      {/each}
    </ul>
  </div>

  <h3 class="note-title">
    <a href="/blog/{note.slug}">{note.title}</a>
  </h3>

  <p class="note-dek">{excerpt}&hellip;</p>
</article>

<style>
  .note-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    /* Fills the flex <li> grid cell it is rendered into. */
    width: 100%;
    padding: var(--space-lg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    transition:
      border-color var(--duration-base) var(--ease-out),
      background-color var(--duration-base) var(--ease-out),
      box-shadow var(--duration-base) var(--ease-out),
      transform var(--duration-base) var(--ease-out);
  }

  .note-card:hover {
    border-color: var(--accent-primary-30);
    background: var(--bg-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  /* The card's focus ring follows the stretched link. */
  .note-card:focus-within {
    border-color: var(--accent-primary-30);
  }

  .note-meta {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--space-xs);
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    line-height: var(--leading-normal);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--duration-base);
  }

  .separator {
    color: var(--border-color);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tag {
    color: var(--accent-primary-text);
  }

  .note-title {
    font-size: var(--type-base);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-normal);
    color: var(--text-primary);
    transition: color var(--duration-base);

    /* Two lines keeps every card in a row the same rhythm. */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .note-title a {
    color: inherit;
    text-decoration: none;
  }

  /* Stretched link — the whole card is the target, the link is the label. */
  .note-title a::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  .note-card:hover .note-title a {
    color: var(--accent-primary-text);
  }

  .note-dek {
    font-size: var(--type-sm);
    font-weight: var(--weight-light);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
    transition: color var(--duration-base);

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .note-card {
      padding: var(--space-md);
    }
  }
</style>
