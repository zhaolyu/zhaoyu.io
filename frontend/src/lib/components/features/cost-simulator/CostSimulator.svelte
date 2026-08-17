<script lang="ts">
  import { simulator } from '$lib/simulator.svelte';
  import { SIMULATOR_LIMITS } from '$lib/constants/config';
  import { fade } from 'svelte/transition';
</script>

{#if simulator.isLoaded}
  <section class="sim-panel" in:fade>
    <div class="sim-header">
      <span class="sim-title">Cost Simulator</span>
      <span class="sim-tag">WHAT-IF</span>
    </div>

    <div class="sim-baselines">
      <div class="sim-baseline-cell">
        <span class="sim-label">Compute</span>
        <span class="sim-value">${simulator.baseline.compute.toFixed(2)}</span>
      </div>
      <div class="sim-baseline-cell">
        <span class="sim-label">Storage</span>
        <span class="sim-value">${simulator.baseline.storage.toFixed(2)}</span>
      </div>
      <div class="sim-baseline-cell">
        <span class="sim-label">Fixed</span>
        <span class="sim-value">${simulator.baseline.fixed.toFixed(2)}</span>
      </div>
    </div>

    <div class="sim-controls">
      <div class="sim-control">
        <label class="sim-label" for="traffic-slider">
          Traffic Scale: <span class="sim-control-value">{simulator.trafficMultiplier}x</span>
        </label>
        <input
          id="traffic-slider"
          type="range"
          min={SIMULATOR_LIMITS.trafficMultiplier.min}
          max={SIMULATOR_LIMITS.trafficMultiplier.max}
          step={SIMULATOR_LIMITS.trafficMultiplier.step}
          bind:value={simulator.trafficMultiplier}
          class="sim-slider"
        />
      </div>
      <div class="sim-control">
        <label class="sim-label" for="storage-slider">
          Storage Growth: <span class="sim-control-value">+{simulator.storageGrowthGB} GB</span>
        </label>
        <input
          id="storage-slider"
          type="range"
          min={SIMULATOR_LIMITS.storageGrowthGB.min}
          max={SIMULATOR_LIMITS.storageGrowthGB.max}
          step={SIMULATOR_LIMITS.storageGrowthGB.step}
          bind:value={simulator.storageGrowthGB}
          class="sim-slider"
        />
      </div>
    </div>

    <div class="sim-projection">
      <span class="sim-label">Projected Monthly</span>
      <div class="sim-projection-row">
        <span class="sim-projection-value">
          ${simulator.projectedTotal.toFixed(2)}
        </span>
        <span
          class="sim-delta"
          class:increase={simulator.projectedDelta > 0}
          class:decrease={simulator.projectedDelta < 0}
        >
          {simulator.projectedDelta >= 0 ? '+' : ''}{simulator.projectedDelta.toFixed(2)}
        </span>
      </div>
    </div>

    <div class="sim-footer">
      <button class="sim-reset" onclick={() => simulator.reset()}>Reset</button>
    </div>
  </section>
{/if}

<style>
  .sim-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: var(--space-xl);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s;
  }

  .sim-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-lg);
  }

  .sim-title {
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .sim-tag {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-infra);
    background: var(--accent-infra-10);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .sim-baselines {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .sim-baseline-cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .sim-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .sim-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.02em;
  }

  .sim-controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .sim-control-value {
    color: var(--accent-infra);
    font-weight: 600;
  }

  .sim-slider {
    width: 100%;
    height: 4px;
    appearance: none;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;
    margin-top: var(--space-xs);
  }

  .sim-slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--accent-infra);
    border-radius: 50%;
    cursor: pointer;
    transition:
      background-color 0.15s,
      box-shadow 0.15s;
  }

  .sim-slider::-webkit-slider-thumb:hover {
    background: var(--accent-infra-light);
    box-shadow: 0 0 0 4px var(--accent-infra-10);
  }

  .sim-slider::-webkit-slider-thumb:active {
    background: var(--accent-infra-dark);
    box-shadow: 0 0 0 4px var(--accent-infra-20);
  }

  .sim-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--accent-infra);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition:
      background-color 0.15s,
      box-shadow 0.15s;
  }

  .sim-slider::-moz-range-thumb:hover {
    background: var(--accent-infra-light);
    box-shadow: 0 0 0 4px var(--accent-infra-10);
  }

  .sim-slider::-moz-range-thumb:active {
    background: var(--accent-infra-dark);
    box-shadow: 0 0 0 4px var(--accent-infra-20);
  }

  .sim-projection {
    padding: var(--space-md);
    background: var(--accent-infra-10);
    border-left: 3px solid var(--accent-infra);
    border-radius: 0 0.5rem 0.5rem 0;
    margin-bottom: var(--space-md);
  }

  .sim-projection-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    margin-top: var(--space-2xs);
  }

  .sim-projection-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .sim-delta {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .sim-delta.increase {
    color: var(--status-error);
  }

  .sim-delta.decrease {
    color: var(--status-success);
  }

  .sim-footer {
    display: flex;
    justify-content: flex-end;
  }

  .sim-reset {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    transition:
      color 0.2s,
      border-color 0.2s;
  }

  .sim-reset:hover {
    color: var(--accent-infra);
    border-color: var(--accent-infra);
  }

  .sim-reset:active {
    color: var(--accent-infra-dark);
    border-color: var(--accent-infra-dark);
  }

  @media (max-width: 640px) {
    .sim-baselines {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }
  }
</style>
