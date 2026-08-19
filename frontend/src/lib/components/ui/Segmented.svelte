<script lang="ts">
  /**
   * One row of mutually exclusive options — the lens switches in the graph viz,
   * the niche filter in the trading dashboard, the theme switch on the design
   * system. Three independent inventions of the same control is what promoted
   * it here.
   *
   * Two to four options only. Past four, the row stops being scannable and the
   * choice wants a select; the component does not enforce that, but the card
   * says it.
   */
  interface Props {
    /** Option values, in display order. */
    options: string[];
    value: string;
    /** Optional display labels, parallel to `options`. */
    labels?: string[];
    /** Accessible name for the group — required, since the labels are terse. */
    label: string;
    onchange?: (value: string) => void;
  }

  let { options, value, labels, label, onchange }: Props = $props();
</script>

<div class="seg" role="group" aria-label={label}>
  {#each options as option, i (option)}
    <button
      type="button"
      class:on={option === value}
      aria-pressed={option === value}
      onclick={() => onchange?.(option)}
    >
      {labels?.[i] ?? option}
    </button>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    gap: 2px;
    padding: 2px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
  }

  button {
    flex: 1;
    padding: var(--space-2xs) var(--space-sm);
    background: transparent;
    border: none;
    border-radius: var(--radius-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
    cursor: pointer;
    transition:
      background-color var(--duration-fast),
      color var(--duration-fast);
  }

  button:hover:not(.on) {
    color: var(--text-primary);
  }

  /* The selected option is the only tinted one, so the row reads as a state and
     not as a set of buttons. */
  button.on {
    background: var(--status-info-20);
    color: var(--status-info-text);
  }

  button:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
</style>
