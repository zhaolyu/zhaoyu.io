<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    badge: string;
    /** Plain text headline. For line breaks or styled spans, use the children snippet instead. */
    headline?: string;
    accentText?: string;
    /** Snippet for custom headline markup — use instead of headline when you need <br> or inline styles. */
    children?: Snippet;
  }

  let { badge, headline, accentText, children }: Props = $props();
</script>

<div class="section-header">
  <div class="header-badge">
    <div class="badge-line"></div>
    <h2 class="badge-text">{badge}</h2>
  </div>
  <h3 class="section-headline">
    {#if children}
      {@render children()}
    {:else}
      {headline ?? ''}
      {#if accentText}
        <span class="headline-accent">{accentText}</span>
      {/if}
    {/if}
  </h3>
</div>

<style>
  .section-header {
    margin-bottom: var(--space-2xl, 3rem);
  }

  @media (max-width: 768px) {
    .section-header {
      margin-bottom: var(--space-xl, 2rem);
    }
  }

  .header-badge {
    display: flex;
    align-items: center;
    gap: var(--space-md, 1rem);
    margin-bottom: var(--space-lg, 1.5rem);
  }

  .badge-line {
    height: 1px;
    width: 3rem;
    background: var(--border-color);
    transition: background-color 0.2s;
  }

  .badge-text {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .section-headline {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--text-primary);
    max-width: 48rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }

  /* .headline-accent is defined globally in app.css — accessible in snippet slots */
</style>
