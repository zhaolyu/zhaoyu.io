<script lang="ts">
  import { onMount } from 'svelte';
  import { createSectionObserver } from '$lib/utils/section-observer';

  let mode = $state<'naive' | 'optimized'>('optimized');
  let tokens = $state<string[]>([]);
  let isRunning = $state(false);
  let latencySection: HTMLElement;
  let displayContent: HTMLElement;

  const fullText =
    "The architecture uses a decoupled React state buffer. Instead of triggering a reconciliation cycle for every single token (which creates jank), we buffer incoming chunks in a Ref and flush to the DOM using requestAnimationFrame. This ensures the UI thread remains unblocked. The key insight is that token streaming from LLM APIs can arrive at rates exceeding 20 tokens per second, each potentially triggering a full React reconciliation pass. By batching these updates and synchronizing them with the browser's rendering pipeline, we maintain a consistent 60 FPS experience. The buffer accumulates tokens synchronously as they arrive, then the RAF callback processes multiple tokens per frame, amortizing the render cost across the available frame budget. This approach transforms a stuttering, janky interface into a smooth, responsive user experience that feels instant even when processing hundreds of tokens.";
  const words = fullText.split(' ');

  // Auto-scroll to bottom as text streams
  $effect(() => {
    if (displayContent && tokens.length > 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        displayContent.scrollTop = displayContent.scrollHeight;
      });
    }
  });

  // Each start invalidates prior loops: their closures check the id and bail.
  // Without this, switching modes leaves the old setTimeout/rAF chain running
  // and two writers interleave tokens into the same array.
  let runId = 0;
  let destroyed = false;

  function startSim() {
    if (isRunning || destroyed) return;
    isRunning = true;
    tokens = [];
    const id = ++runId;
    let i = 0;

    if (mode === 'naive') {
      // Simulate JANK: Random heavy delays blocking the thread
      const tick = () => {
        if (id !== runId) return; // superseded by a newer run or unmount
        if (i >= words.length) {
          isRunning = false;
          return;
        }

        // Artificial "Jank" - simulating a heavy React render
        // Use a blocking loop but break it into smaller chunks to reduce violation warnings
        const start = performance.now();
        const blockDuration = 50;
        const chunkSize = 5; // Break into 5ms chunks
        const blockUntil = start + blockDuration;

        // Block in smaller chunks to reduce browser violation warnings
        const block = () => {
          if (id !== runId) return;
          if (performance.now() < blockUntil) {
            const chunkStart = performance.now();
            while (performance.now() - chunkStart < chunkSize);
            // Yield briefly to reduce violation severity
            setTimeout(block, 0);
          } else {
            // Blocking complete, continue with token update
            tokens = [...tokens, words[i]];
            i++;
            setTimeout(tick, Math.random() * 100); // Random network jitter
          }
        };
        block();
      };
      tick();
    } else {
      // OPTIMIZED: RAF Sync
      const tick = () => {
        if (id !== runId) return; // superseded by a newer run or unmount
        if (i >= words.length) {
          isRunning = false;
          return;
        }

        // In reality we would process multiple tokens per frame here
        tokens = [...tokens, words[i]];
        i++;
        requestAnimationFrame(tick); // Sync with screen refresh
      };
      tick();
    }
  }

  function handleModeChange(newMode: 'naive' | 'optimized') {
    mode = newMode;
    // Invalidate any in-flight loop, then reset state to allow restart
    runId++;
    isRunning = false;
    tokens = [];
    // Use requestAnimationFrame instead of setTimeout to avoid violation warnings
    // while still ensuring state is reset before starting
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startSim();
      });
    });
  }

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanup = createSectionObserver(latencySection, {
      enableReanimation: true,
      onVisible: () => {
        // Auto-start animation with optimized mode — but never auto-play for
        // users who asked for reduced motion (they can still start it manually)
        if (mode === 'optimized' && !prefersReducedMotion) {
          // Small delay to ensure smooth entry
          setTimeout(() => {
            startSim();
          }, 300);
        }
      },
    });

    return () => {
      destroyed = true;
      runId++; // stop any loop that would outlive the component
      cleanup();
    };
  });
</script>

<div id="latency" class="latency-sim-section" bind:this={latencySection}>
  <div class="sim-container">
    <div class="sim-content">
      <div class="sim-text">
        <p class="section-badge">See it: latency demo</p>
        <h3 class="section-title">Latency is the enemy of trust.</h3>
        <p class="section-description">
          Don't just tell stakeholders the architecture is better —
          <strong>show them.</strong>
          Switch modes to feel the difference between a naive socket connection and a frame-buffered stream.
        </p>

        <div class="mode-selector">
          <button
            onclick={() => handleModeChange('naive')}
            class="mode-button"
            class:active={mode === 'naive'}
            class:naive={mode === 'naive'}
          >
            Naive Mode
          </button>
          <button
            onclick={() => handleModeChange('optimized')}
            class="mode-button"
            class:active={mode === 'optimized'}
            class:optimized={mode === 'optimized'}
          >
            Optimized
          </button>
        </div>
      </div>

      <div class="sim-display">
        <div class="display-grid"></div>
        <div class="display-content" bind:this={displayContent}>
          <span class="display-text">{tokens.join(' ')}</span>
          {#if isRunning}
            <span class="cursor"></span>
          {/if}
        </div>
        <div
          class="display-badge"
          class:naive={mode === 'naive'}
          class:optimized={mode === 'optimized'}
        >
          {mode === 'optimized' ? '60 FPS' : '~12 FPS'}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .latency-sim-section {
    padding: 0;
    background: var(--bg-primary);
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
    scroll-margin-top: 6rem;
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s;
  }

  .sim-container {
    max-width: 64rem;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .sim-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }

  @media (min-width: 768px) {
    .sim-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .sim-text {
    flex: 1;
  }

  .section-badge {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .section-title {
    font-size: clamp(1.875rem, 4vw, 2.25rem);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .section-description {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.75;
  }

  .section-description strong {
    color: var(--text-primary);
  }

  .mode-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.25rem;
    background: var(--bg-secondary);
    width: fit-content;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
  }

  .mode-button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    border-radius: 0.375rem;
    transition: all 0.2s;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
  }

  .mode-button:hover {
    color: var(--text-primary);
  }

  .mode-button.active.naive {
    background: var(--status-error-10);
    color: var(--status-error-text);
    border: 1px solid var(--status-error);
  }

  .mode-button.active.optimized {
    background: var(--status-success-10);
    color: var(--status-success-text);
    border: 1px solid var(--status-success);
  }

  .sim-display {
    position: relative;
    height: 16rem;
    background: var(--bg-secondary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.75;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .display-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(128, 128, 128, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(128, 128, 128, 0.04) 1px, transparent 1px);
    background-size: 1rem 1rem;
    pointer-events: none;
  }

  .display-content {
    position: relative;
    z-index: 1;
    color: var(--text-secondary);
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 2.5rem;
    padding-right: 5rem;
  }

  /* Terminal-style scrollbar for display content */
  .display-content::-webkit-scrollbar {
    width: 8px;
  }

  .display-content::-webkit-scrollbar-track {
    background: var(--scrim-soft);
    border-radius: var(--radius-sm);
  }

  .display-content::-webkit-scrollbar-thumb {
    background-color: var(--ink-faint);
    border-radius: var(--radius-sm);
    border: 1px solid var(--scrim-soft);
  }

  .display-content::-webkit-scrollbar-thumb:hover {
    background-color: var(--ink-dim);
  }

  .display-text {
    color: var(--text-secondary);
  }

  .cursor {
    display: inline-block;
    width: 0.125rem;
    height: 1rem;
    background: var(--accent-primary);
    animation: pulse 1s ease-in-out infinite;
    margin-left: 0.25rem;
    vertical-align: middle;
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

  .display-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    border: 1px solid;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    z-index: 2;
  }

  .display-badge.naive {
    color: var(--status-error-text);
    border-color: var(--status-error-20);
    background: var(--status-error-10);
  }

  .display-badge.optimized {
    color: var(--status-success-text);
    border-color: var(--status-success-20);
    background: var(--status-success-10);
  }

  @media (max-width: 768px) {
    .latency-sim-section {
      padding: 0;
    }

    .sim-content {
      gap: 2rem;
    }

    .sim-display {
      height: 12rem;
      padding: 1rem;
    }

    .display-content {
      padding-top: 2.5rem;
      padding-right: 4rem;
    }

    .display-badge {
      top: 0.75rem;
      right: 0.75rem;
      font-size: 0.625rem;
      padding: 0.2rem 0.4rem;
    }
  }
</style>
