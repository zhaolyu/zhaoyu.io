<script lang="ts">
  import StatusPill from './StatusPill.svelte';
  import type { DataColumn, StatusTone } from '$lib/types';

  /**
   * The one table. Every dashboard so far rebuilt sortable headers, numeric
   * alignment and hover rules from scratch; this owns them.
   *
   * Numeric columns are mono + tabular-nums and right-aligned so digits stack
   * into a comparable column. Below `minWidth` the table scrolls inside its
   * card rather than reflowing — a stacked table stops being comparable, which
   * is the only reason to have one.
   */
  interface Props {
    columns: DataColumn[];
    rows: Record<string, string>[];
    /** Column currently driving the order — marks the header, does not sort. */
    sortKey?: string;
    /** Per-cell tone: colour for numeric cells, tone for pill cells. */
    toneFor?: (row: Record<string, string>, column: DataColumn) => StatusTone | undefined;
    /** CSS length below which the table scrolls instead of squeezing. */
    minWidth?: string;
    onsort?: (key: string) => void;
  }

  let { columns, rows, sortKey, toneFor, minWidth = '34rem', onsort }: Props = $props();
</script>

<div class="scroll">
  <table style="min-width: {minWidth}">
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th
            class:right={column.align === 'right'}
            class:active={sortKey === column.key}
            class:sortable={!!onsort}
          >
            {#if onsort}
              <button type="button" onclick={() => onsort?.(column.key)}>
                {column.label}{#if sortKey === column.key}<span aria-hidden="true"> ▾</span>{/if}
              </button>
            {:else}
              {column.label}{#if sortKey === column.key}<span aria-hidden="true"> ▾</span>{/if}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (i)}
        <tr>
          {#each columns as column (column.key)}
            {@const tone = toneFor?.(row, column)}
            <td
              class:right={column.align === 'right'}
              class:mono={column.mono}
              class:numeric={column.numeric}
              data-tone={column.pill ? undefined : tone}
            >
              {#if column.pill}
                <StatusPill label={row[column.key]} tone={tone ?? 'neutral'} />
              {:else}
                {row[column.key]}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--type-sm);
  }

  th {
    padding: var(--space-xs);
    text-align: left;
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  th.active {
    color: var(--accent-primary-text);
  }

  th button {
    all: unset;
    cursor: pointer;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
  }

  th.sortable button:hover {
    color: var(--text-primary);
  }

  td {
    padding: var(--space-sm) var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-primary);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: var(--scrim-soft);
  }

  .right {
    text-align: right;
  }

  .mono {
    font-family: var(--font-mono);
  }

  .numeric {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: var(--weight-semibold);
  }

  /* A coloured figure is never the only signal — pair the column with a pill
     column, or a word in the cell. */
  td[data-tone='success'] {
    color: var(--status-success-text);
  }

  td[data-tone='warning'] {
    color: var(--status-warning-text);
  }

  td[data-tone='error'] {
    color: var(--status-error-text);
  }

  td[data-tone='info'] {
    color: var(--status-info-text);
  }

  td[data-tone='neutral'] {
    color: var(--text-muted);
  }
</style>
