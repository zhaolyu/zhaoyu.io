<script lang="ts">
  import type { StatusTone } from '$lib/types';

  /**
   * Semantic state as a pill. Supersedes the per-project `.badge.green` sets:
   * tone picks the token pair, and the label always carries the meaning in
   * words so the pill still reads with colour vision differences or in print.
   */
  interface Props {
    label: string;
    tone?: StatusTone;
    /** Leading dot — for live state (a regime, a connection), not for verdicts. */
    dot?: boolean;
  }

  let { label, tone = 'neutral', dot = false }: Props = $props();
</script>

<span class="pill" data-tone={tone}>
  {#if dot}<span class="dot"></span>{/if}
  {label}
</span>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2xs);
    padding: 0.2rem var(--space-xs);
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: var(--radius-full);
    background: currentColor;
    flex-shrink: 0;
  }

  .pill[data-tone='success'] {
    color: var(--status-success-text);
    background: var(--status-success-10);
  }

  .pill[data-tone='warning'] {
    color: var(--status-warning-text);
    background: var(--status-warning-10);
  }

  .pill[data-tone='error'] {
    color: var(--status-error-text);
    background: var(--status-error-10);
  }

  .pill[data-tone='info'] {
    color: var(--status-info-text);
    background: var(--status-info-10);
  }

  .pill[data-tone='neutral'] {
    color: var(--text-muted);
    background: var(--scrim-soft);
  }
</style>
