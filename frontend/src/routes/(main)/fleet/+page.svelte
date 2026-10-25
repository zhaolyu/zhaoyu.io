<script lang="ts">
  import { onMount } from 'svelte';
  import { StatCard, DataTable } from '$lib/components/ui';
  import { FleetDailyChart } from '$lib/components/features/fleet';
  import { FLEET_JSON_URL, FLEET_SAMPLE_PATH, FLEET_FETCH_TIMEOUT_MS } from '$lib/constants/config';
  import { PERSON, SITE_URL, SITE_CARD_IMAGE, jsonLdScript } from '$lib/constants/structured-data';
  import type { DataColumn, FleetRecord } from '$lib/types';
  import {
    parseFleetRecord,
    cronToWords,
    formatUsd,
    formatShare,
    formatCount,
    shortDate,
  } from '$lib/utils/fleet';

  const canonicalUrl = `${SITE_URL}/fleet`;
  const pageTitle = 'Fleet Record · Zhao Yu';
  const description =
    'The run ledger of a fleet of scheduled Claude Code routines: runs per day by kind, the share of edit-runs a harness verified, and API-equivalent value at list rates. Closed days only.';

  const datasetScript = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Fleet record',
    description,
    url: canonicalUrl,
    creator: PERSON,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: FLEET_JSON_URL,
    },
  });

  type Source = 'loading' | 'live' | 'sample';

  let record = $state<FleetRecord | null>(null);
  let source = $state<Source>('loading');

  async function load(url: string, timeoutMs: number): Promise<FleetRecord | null> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (!res.ok) return null;
      return parseFleetRecord(await res.json());
    } catch {
      return null;
    }
  }

  onMount(async () => {
    const live = await load(FLEET_JSON_URL, FLEET_FETCH_TIMEOUT_MS);
    if (live) {
      record = live;
      source = 'live';
      return;
    }
    record = await load(FLEET_SAMPLE_PATH, FLEET_FETCH_TIMEOUT_MS);
    source = 'sample';
  });

  const totals = $derived(record?.totals ?? null);
  const verifiedShare = $derived(
    totals && totals.edit_runs > 0 ? totals.verified / totals.edit_runs : null,
  );
  const routineShare = $derived(
    totals && totals.runs > 0 ? totals.routine_runs / totals.runs : null,
  );

  const columns: DataColumn[] = [
    { key: 'name', label: 'Routine', mono: true },
    { key: 'cadence', label: 'Cadence' },
    { key: 'runs', label: 'Runs', align: 'right', numeric: true },
    { key: 'last_run', label: 'Last run', align: 'right', mono: true },
    { key: 'median_usd', label: 'Median value', align: 'right', numeric: true },
    { key: 'verified_share', label: 'Verified', align: 'right', numeric: true },
  ];

  const rows = $derived(
    (record?.routines ?? []).map((r) => ({
      name: r.name,
      cadence: cronToWords(r.cadence),
      runs: formatCount(r.runs),
      last_run: shortDate(r.last_run),
      median_usd: formatUsd(r.median_usd),
      verified_share: formatShare(r.verified_share),
    })),
  );

  const generatedOn = $derived(
    record ? new Date(record.generated_at).toISOString().slice(0, 10) : '',
  );
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
  {@html datasetScript}
</svelte:head>

<main id="main" class="fleet-page">
  <a href="/" class="back-link">&larr; zhaoyu.io</a>
  <p class="eyebrow">Fleet record</p>
  <h1>Every unattended agent run on my machine is recorded, judged by its receipts, and priced.</h1>
  <p class="page-description">
    A fleet of scheduled Claude Code routines runs my research pipeline: two Discord digests, a
    morning brief, a Thursday loop closer, a Saturday book review, and a nightly operator pass that
    proposes fixes to the harness itself. Each run gets a process verdict from its hook receipts and
    a list-rate cost, in a ledger I built for the purpose. The numbers below are the closed days of
    that ledger, published by the same fleet. This page reads that file on every visit. When it
    cannot, it shows the copy committed with the page and says so.
  </p>

  <p class="source" data-source={source}>
    {#if source === 'loading'}
      Loading the record.
    {:else if source === 'live'}
      Live record, generated {generatedOn}.
    {:else if record}
      Sample data, generated {generatedOn}. The live record could not be loaded, so this is the copy
      committed with the page.
    {:else}
      The record could not be loaded.
    {/if}
  </p>

  {#if record && totals}
    <section class="stats" aria-label="Totals">
      <StatCard
        label="Closed days"
        value={formatCount(totals.days)}
        caption="{shortDate(record.window.from)} to {shortDate(record.window.to)}"
      />
      <StatCard
        label="Runs"
        value={formatCount(totals.runs)}
        caption="{formatCount(totals.routine_runs)} routine, {formatCount(
          totals.interactive_runs,
        )} interactive"
      />
      <StatCard label="Routine share" value={formatShare(routineShare)} caption="of all runs" />
      <StatCard
        label="Verified"
        value={formatShare(verifiedShare)}
        caption="of {formatCount(totals.edit_runs)} runs that edited files"
      />
      <StatCard
        label="API-equivalent value"
        value={formatUsd(totals.api_equivalent_usd)}
        caption="at list rates, on a subscription"
      />
    </section>

    <section class="charts" aria-label="Daily record">
      <FleetDailyChart days={record.days} mode="runs" />
      <FleetDailyChart days={record.days} mode="value" />
    </section>

    <section class="routines" aria-labelledby="routines-heading">
      <h2 id="routines-heading">Routines</h2>
      <p class="section-note">
        Each routine is declared once, with its cadence and the output file it must leave behind.
        Verified is the share of its edit-runs where a harness watched the run and its check passed
        after the last edit.
      </p>
      <DataTable {columns} {rows} sortKey="runs" minWidth="44rem" />
    </section>

    <details class="table-view">
      <summary>Daily table</summary>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th class="right">Runs</th>
            <th class="right">Routine</th>
            <th class="right">Interactive</th>
            <th class="right">Edited</th>
            <th class="right">Verified</th>
            <th class="right">Value</th>
          </tr>
        </thead>
        <tbody>
          {#each record.days as d (d.date)}
            <tr>
              <td class="mono">{d.date}</td>
              <td class="right mono">{d.runs}</td>
              <td class="right mono">{d.routine}</td>
              <td class="right mono">{d.interactive}</td>
              <td class="right mono">{d.edit_runs}</td>
              <td class="right mono">{d.verified}</td>
              <td class="right mono">{formatUsd(d.api_equivalent_usd)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </details>
  {/if}

  <section class="method" aria-labelledby="method-heading">
    <h2 id="method-heading">How this is measured</h2>
    <p>
      The ledger holds one record per Claude Code session on the machine, joined from the hook
      receipts the harness writes on every edit and verify, the session's own state files, and the
      transcript. A run is a session; a routine run is one a scheduler started with nobody watching.
    </p>
    <p>
      Every run that edits a file is scored on two axes. The process axis is mechanical.
      <code>verified</code> means a harness watched the run and its declared check passed after the
      last edit; <code>unverified</code> means the check never passed after the last edit;
      <code>unaudited</code> means the run's receipts are missing or incomplete. The outcome axis, whether
      the run delivered what was asked, is mine to score and is deliberately not published, because a
      number I assign to my own work is not a receipt.
    </p>
    <p>
      Value is API-equivalent: the tokens each run used, priced at Claude API list rates. The runs
      ran on a Max subscription, so this is what the work would have cost at the meter, not what I
      paid. Only closed days appear, never a day still in progress, and the record carries no
      prompts, file paths or session minutes. <strong
        >Done without an attached artifact is self-attestation, so the fleet publishes its own
        ledger.</strong
      >
    </p>
  </section>
</main>

<style>
  .fleet-page {
    width: 100%;
    max-width: var(--content-max);
    min-width: 0;
    margin: 0 auto;
    padding: var(--space-5xl) var(--section-x) var(--space-4xl);
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .back-link {
    display: inline-block;
    margin-bottom: var(--space-xl);
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--text-secondary);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--accent-primary-text);
  }

  .eyebrow {
    margin: 0 0 var(--space-sm);
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--accent-primary-text);
  }

  h1 {
    max-width: 30ch;
    margin: 0 0 var(--space-md);
    font-size: var(--type-2xl);
    line-height: var(--leading-tight);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
  }

  @media (min-width: 768px) {
    h1 {
      font-size: var(--type-3xl);
    }
  }

  .page-description,
  .method p,
  .section-note {
    max-width: var(--measure-prose);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .page-description {
    margin: 0 0 var(--space-lg);
    font-size: var(--type-md);
  }

  .source {
    margin: 0 0 var(--space-2xl);
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    color: var(--text-muted);
  }

  .source[data-source='sample'] {
    color: var(--status-warning-text);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-2xl);
  }

  .charts {
    display: grid;
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  .routines {
    margin-bottom: var(--space-2xl);
    padding: var(--space-lg);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
  }

  h2 {
    margin: 0 0 var(--space-sm);
    font-size: var(--type-lg);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
  }

  .section-note {
    margin: 0 0 var(--space-lg);
    font-size: var(--type-sm);
  }

  .table-view {
    margin-bottom: var(--space-2xl);
  }

  .table-view summary {
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    color: var(--text-muted);
  }

  .table-view table {
    width: 100%;
    margin-top: var(--space-md);
    border-collapse: collapse;
    font-size: var(--type-sm);
  }

  .table-view th,
  .table-view td {
    padding: var(--space-xs) var(--space-sm);
    border-bottom: 1px solid var(--border-subtle);
    text-align: left;
  }

  .table-view th {
    font-weight: var(--weight-medium);
    color: var(--text-muted);
  }

  .right {
    text-align: right;
  }

  .mono {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .method p {
    margin: 0 0 var(--space-md);
    font-size: var(--type-base);
  }

  .method code {
    font-family: var(--font-mono);
    font-size: var(--type-sm);
  }

  .method strong {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .fleet-page {
      padding: var(--space-4xl) var(--section-x) var(--space-3xl);
    }
  }
</style>
