<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { StatusTone } from '$lib/types';

  /**
   * One metric, one card. The delta is the reason this exists: a coloured number
   * alone encodes its meaning in hue only, so `direction` renders an arrow and
   * the tone only tints it. Figures are mono + tabular so a row of cards lines
   * up and a live value doesn't reflow as digits change width.
   */
  interface Props {
    label: string;
    value: string;
    /** Short delta or qualifier shown under the value. */
    delta?: string;
    tone?: StatusTone;
    direction?: 'up' | 'down';
    caption?: string;
    /** Pulsing dot beside the value — live state only. */
    live?: boolean;
    /** Sparkline or micro-viz, rendered right of the value. */
    trend?: Snippet;
  }

  let {
    label,
    value,
    delta,
    tone = 'neutral',
    direction,
    caption,
    live = false,
    trend,
  }: Props = $props();

  const arrow = $derived(direction === 'up' ? '▲' : direction === 'down' ? '▼' : '');
</script>

<div class="stat">
  <span class="label">{label}</span>
  <div class="row">
    <span class="value">
      {#if live}<span class="live" data-tone={tone}></span>{/if}
      {value}
    </span>
    {#if trend}<span class="trend">{@render trend()}</span>{/if}
  </div>
  {#if delta}
    <span class="delta" data-tone={tone}>
      {#if arrow}<span aria-hidden="true">{arrow}</span>{/if}
      {delta}
    </span>
  {/if}
  {#if caption}<span class="caption">{caption}</span>{/if}
</div>

<style>
  .stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .label {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .value {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: var(--font-mono);
    font-size: var(--type-lg);
    font-weight: var(--weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--text-primary);
  }

  .trend {
    display: flex;
    flex-shrink: 0;
  }

  .delta,
  .caption {
    font-size: var(--type-xs);
  }

  .delta {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    font-family: var(--font-mono);
  }

  .caption {
    color: var(--text-muted);
  }

  .live {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    animation: pulse 2s var(--ease-in-out) infinite;
  }

  /* Deltas take the readable -text end; the dot takes the fill. Kept as
     separate rule sets so neither borrows the other's property. */
  .delta[data-tone='success'] {
    color: var(--status-success-text);
  }

  .delta[data-tone='warning'] {
    color: var(--status-warning-text);
  }

  .delta[data-tone='error'] {
    color: var(--status-error-text);
  }

  .delta[data-tone='info'] {
    color: var(--status-info-text);
  }

  .delta[data-tone='neutral'] {
    color: var(--text-muted);
  }

  .live[data-tone='success'] {
    background: var(--status-success);
  }

  .live[data-tone='warning'] {
    background: var(--status-warning);
  }

  .live[data-tone='error'] {
    background: var(--status-error);
  }

  .live[data-tone='info'] {
    background: var(--status-info);
  }

  .live[data-tone='neutral'] {
    background: var(--text-muted);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .live {
      animation: none;
    }
  }
</style>
