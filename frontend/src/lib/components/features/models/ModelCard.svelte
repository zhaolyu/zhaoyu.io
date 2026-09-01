<script lang="ts">
  import type { MentalModel } from '$lib/constants/models';

  interface Props {
    model: MentalModel;
    /** Teaser cards drop the mechanism and link out; the page shows everything. */
    compact?: boolean;
  }

  let { model, compact = false }: Props = $props();
</script>

<!-- Type hierarchy per the design system: classification (mono, the domain
     labels) > measurement (the rule) > description (mechanism and receipts). -->
<article class="model-card" id={compact ? undefined : model.id}>
  <h3 class="rule">
    {#if compact}
      <a href="/models#{model.id}">{model.rule}</a>
    {:else}
      {model.rule}
    {/if}
  </h3>

  {#if !compact}
    <p class="mechanism">{model.mechanism}</p>
  {/if}

  <ul class="receipts" class:compact>
    {#each model.receipts as receipt (receipt.domain + receipt.text)}
      <li class="receipt">
        <span class="domain">{receipt.domain}</span>
        {#if !compact}<span class="receipt-text">{receipt.text}</span>{/if}
      </li>
    {/each}
  </ul>

  {#if !compact}
    <footer class="provenance">
      <span class="provenance-label">Where it came from</span>
      {#if model.origin.href}
        <a class="origin" href={model.origin.href} target="_blank" rel="noopener">
          {model.origin.label}
        </a>
      {:else}
        <span class="origin">{model.origin.label}</span>
      {/if}
      {#if model.note}
        <a class="note-link" href="/blog/{model.note}">The note that argues it &rarr;</a>
      {/if}
    </footer>
  {/if}
</article>

<style>
  .model-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    width: 100%;
    padding: var(--space-lg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    /* Scroll-to-anchor should not tuck the heading under the fixed navbar. */
    scroll-margin-top: var(--space-4xl);
  }

  .rule {
    margin: 0;
    font-size: var(--type-lg);
    line-height: var(--leading-snug);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
    text-wrap: balance;
  }

  .rule a {
    color: inherit;
    text-decoration: none;
  }

  .rule a:hover {
    color: var(--accent-primary-text);
  }

  .mechanism {
    margin: 0;
    font-size: var(--type-sm);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .receipts {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .receipt {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    padding-top: var(--space-xs);
    border-top: 1px solid var(--border-subtle);
  }

  /* Compact cards carry the domains only, so a stacked list of labels each
     under its own rule reads as rows whose content failed to load. Inline
     them as a chip row instead: the claim a teaser makes is "this pays off
     in these domains", which is a set, not a sequence. */
  .receipts.compact {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-2xs);
    padding-top: var(--space-xs);
    border-top: 1px solid var(--border-subtle);
  }

  .receipts.compact .receipt {
    padding-top: 0;
    border-top: none;
  }

  /* Muted mono chips at this size ran together into one string. Colour is what
     separates them on the note cards; same treatment here. */
  .receipts.compact .domain {
    color: var(--accent-primary-text);
  }

  .domain {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .receipt-text {
    font-size: var(--type-sm);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
  }

  .provenance {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    margin-top: var(--space-2xs);
    padding-top: var(--space-xs);
    border-top: 1px solid var(--border-subtle);
  }

  .provenance-label {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .origin {
    font-size: var(--type-xs);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
  }

  a.origin:hover {
    color: var(--accent-primary-text);
  }

  .note-link {
    font-size: var(--type-xs);
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .note-link:hover {
    text-decoration: underline;
  }
</style>
