<script lang="ts">
  import { onMount } from 'svelte';
  import { hud } from '$lib/hud.svelte';
  import { fade } from 'svelte/transition';

  onMount(() => {
    hud.start();
    return () => hud.stop();
  });
</script>

<aside class="hud-strip" in:fade>
  <div class="hud-row">
    <div class="hud-cell">
      <span class="hud-label">STATUS</span>
      <span class="hud-value hud-status">
        <span class="pulse-dot" class:live={hud.status === 'live'}></span>
        {hud.status.toUpperCase()}
      </span>
    </div>
    <div class="hud-cell">
      <span class="hud-label">LATENCY</span>
      <span class="hud-value">{hud.latency}ms</span>
    </div>
    <div class="hud-cell">
      <span class="hud-label">LOCAL DB</span>
      <span class="hud-value">{hud.dbSize}</span>
    </div>
    <div class="hud-cell">
      <span class="hud-label">LAST SYNC</span>
      <span class="hud-value">{hud.lastSyncAt?.toLocaleTimeString() ?? '—'}</span>
    </div>
    <div class="hud-cell hud-trailing">
      <span class="hud-label">SYNC</span>
      <span class="hud-value">ELECTRIC</span>
    </div>
  </div>
</aside>

<style>
  .hud-strip {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s;
  }

  .hud-row {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
    flex-wrap: wrap;
  }

  .hud-cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .hud-trailing {
    margin-left: auto;
  }

  .hud-label {
    font-size: 0.6rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  /* Values: text-primary for readability — accent reserved for status indicator */
  .hud-value {
    font-weight: 500;
    letter-spacing: 0.03em;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  /* Status cell gets the accent — it's the one value that means something at a glance */
  .hud-status {
    color: var(--accent-infra);
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    background: var(--text-muted);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pulse-dot.live {
    background: var(--accent-infra);
    box-shadow: 0 0 6px var(--accent-infra-20);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  @media (max-width: 640px) {
    .hud-row {
      gap: var(--space-md);
    }

    .hud-trailing {
      margin-left: 0;
    }
  }
</style>
