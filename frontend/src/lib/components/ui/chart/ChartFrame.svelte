<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ChartLegendItem } from '$lib/types';

  /**
   * The frame every chart sits in: title, caption, legend, and the scroll rule.
   *
   * The legend lives here rather than in each chart because the legend is what
   * makes a series readable, and a chart that ships without one is the failure
   * mode this component exists to prevent. Charts keep a min-width and scroll
   * inside the card so axis labels never scale below --type-2xs.
   */
  interface Props {
    title: string;
    caption?: string;
    legend?: ChartLegendItem[];
    minWidth?: string;
    children: Snippet;
  }

  let { title, caption, legend = [], minWidth = '30rem', children }: Props = $props();
</script>

<figure class="frame">
  <div class="head">
    <h3>{title}</h3>
    {#if legend.length}
      <ul class="legend">
        {#each legend as item (item.label)}
          <li>
            <span
              class="key"
              class:dot={item.shape === 'dot'}
              class:dashed={item.shape === 'dashed'}
              style="--key-color: {item.color}"
            ></span>
            {item.label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  {#if caption}<figcaption>{caption}</figcaption>{/if}
  <div class="plot">
    <div style="min-width: {minWidth}">
      {@render children()}
    </div>
  </div>
</figure>

<style>
  .frame {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin: 0;
    padding: var(--space-lg);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  h3 {
    margin: 0;
    font-size: var(--type-base);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    color: var(--text-muted);
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
  }

  .key {
    width: 0.625rem;
    height: 2px;
    background: var(--key-color);
    flex-shrink: 0;
  }

  .key.dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--radius-full);
  }

  .key.dashed {
    height: 0;
    border-top: 2px dashed var(--key-color);
    background: none;
  }

  figcaption {
    font-size: var(--type-xs);
    color: var(--text-muted);
    max-width: 60ch;
  }

  .plot {
    overflow-x: auto;
    margin-top: var(--space-xs);
  }
</style>
