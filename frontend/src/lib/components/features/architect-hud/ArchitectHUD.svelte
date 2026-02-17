<script lang="ts">
  import { hud } from '$lib/hud.svelte';
  import { fade } from 'svelte/transition';
</script>

<aside class="hud-panel" in:fade>
  <div class="flex items-center gap-2 mb-3">
    <div class="pulse-indicator" class:live={hud.status === 'live'}></div>
    <span class="mono">SYSTEM_STATUS: {hud.status.toUpperCase()}</span>
  </div>

  <div class="grid grid-cols-3 gap-4 mb-3">
    <div>
      <span class="hud-label">QUERY_LATENCY</span>
      <span class="mono">{hud.latency}ms</span>
    </div>
    <div>
      <span class="hud-label">LOCAL_DB_SIZE</span>
      <span class="mono">{hud.dbSize}</span>
    </div>
    <div>
      <span class="hud-label">LAST_WAL_FLUSH</span>
      <span class="mono">{hud.lastSyncAt?.toLocaleTimeString() ?? 'NEVER'}</span>
    </div>
  </div>

  <div class="flex items-center gap-1 pt-2 border-t border-[#00ff41]/20">
    <span class="cursor">_</span>
    <span class="mono">REPLICATING_VIA_ELECTRIC_SYNC...</span>
  </div>
</aside>

<style>
  .hud-panel {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 4px;
    color: #00ff41;
    font-family: 'Fira Code', ui-monospace, monospace;
    font-size: 0.75rem;
  }

  .hud-label {
    display: block;
    font-size: 0.65rem;
    color: rgba(0, 255, 65, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .mono {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pulse-indicator {
    width: 8px;
    height: 8px;
    background: #666;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .pulse-indicator.live {
    background: #00ff41;
    box-shadow: 0 0 8px #00ff41;
    animation: pulse 2s infinite;
  }

  .cursor {
    animation: blink 1s step-end infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
