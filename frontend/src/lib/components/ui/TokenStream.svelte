<!--
  TokenStream — decorative data-terminal illustration: model-output tokens slide
  left→right through a "trust filter" and flip from unverified to verified as
  they cross it. Pure illustration: no props, no state. Fills its container.
-->

<div class="token-stream">
  <div class="stream-header">
    <span class="stream-id">TOKEN STREAM</span>
    <span class="stream-live">TRUST FILTER: ACTIVE</span>
  </div>
  <div class="stream-body">
    <div class="stream-col-labels">
      <span class="scl-left">MODEL OUTPUT</span>
      <span class="scl-right">VERIFIED</span>
    </div>
    <div class="trust-filter-bar">
      <span class="tfb-label">TRUST<br />FILTER</span>
    </div>
    <div class="stream-tracks">
      <div class="strack">
        <div class="stoken st-1a">confidence</div>
        <div class="stoken st-1b">assertion</div>
      </div>
      <div class="strack">
        <div class="stoken st-2a">source_id</div>
        <div class="stoken st-2b">claim_ref</div>
      </div>
      <div class="strack">
        <div class="stoken st-3a">entity</div>
        <div class="stoken st-3b">timestamp</div>
      </div>
    </div>
    <div class="scitation sc-a">CNBC SOURCE ✓</div>
    <div class="scitation sc-b">VERIFIED ✓</div>
  </div>
</div>

<style>
  .token-stream {
    /* Local tokens only where app.css has no equivalent: the terminal's own
       blue (distinct from --accent-primary), the multi-stop panel gradient,
       and the "verified" token treatment built from that blue. Every neutral
       scrim/border/ink below comes from the global token layer instead. */
    --ts-accent: #0077d5;
    --ts-bg: linear-gradient(145deg, #f2f5f9 0%, #eaeff6 100%);
    --ts-post-bg: rgba(0, 119, 213, 0.07);
    --ts-post-color: #0055a4;
    --ts-post-border: rgba(0, 119, 213, 0.35);
    --ts-post-shadow: inset 0 0 8px rgba(0, 119, 213, 0.08);

    width: 100%;
    height: 100%;
    min-height: 240px;
    background: var(--ts-bg);
    border-radius: var(--radius-xs);
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono', 'IBM Plex Mono', var(--font-mono), monospace;
    overflow: hidden;
    cursor: crosshair;
    box-shadow: var(--shadow-md);
    align-self: stretch;
    transition: background var(--duration-base);
  }

  :global(.dark) .token-stream {
    --ts-bg: radial-gradient(circle at top left, #1a1a1a, #0a0a0a);
    --ts-post-bg: rgba(0, 119, 213, 0.05);
    --ts-post-color: #e0e0e0;
    --ts-post-border: rgba(0, 119, 213, 0.4);
    --ts-post-shadow: inset 0 0 10px rgba(0, 119, 213, 0.1);
  }

  .stream-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    font-size: 11px;
    color: var(--ink-dim);
    border-bottom: 1px solid var(--border-soft);
    background: var(--scrim-subtle);
    flex-shrink: 0;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition:
      color var(--duration-base),
      border-color var(--duration-base),
      background-color var(--duration-base);
  }

  .stream-id {
    font-weight: var(--weight-bold);
    color: var(--ink-quiet);
  }

  .stream-live {
    color: var(--ts-accent);
    text-shadow: 0 0 8px rgba(0, 119, 213, 0.4);
  }

  .stream-body {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 14px 0;
    overflow: hidden;
  }

  .stream-col-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 15px 10px;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .scl-left {
    color: var(--ink-faint);
  }

  .scl-right {
    color: rgba(0, 119, 213, 0.5);
  }

  .trust-filter-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: var(--ts-accent);
    z-index: 3;
    box-shadow: 0 0 20px rgba(0, 119, 213, 0.8);
    animation: tfb-pulse 2s ease-in-out infinite;
  }

  .tfb-label {
    position: absolute;
    top: 45%;
    left: 10px;
    font-size: 9px;
    font-weight: var(--weight-bold);
    color: var(--ts-accent);
    transform: rotate(-90deg);
    transform-origin: left center;
    white-space: nowrap;
    letter-spacing: 2px;
    opacity: 0.8;
    text-transform: uppercase;
  }

  @keyframes tfb-pulse {
    0%,
    100% {
      opacity: 0.6;
      box-shadow: 0 0 14px rgba(0, 119, 213, 0.6);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 24px rgba(0, 119, 213, 0.9);
    }
  }

  .stream-tracks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .strack {
    position: relative;
    height: 32px;
    width: 100%;
    overflow: hidden;
  }

  .stoken {
    position: absolute;
    top: 4px;
    left: 0;
    padding: 6px 10px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-subtle);
    border-radius: 2px;
    white-space: nowrap;
    backdrop-filter: blur(4px);
    will-change: transform;
    animation-name: stoken-slide, stoken-verify;
    animation-timing-function: linear, linear;
    animation-iteration-count: infinite, infinite;
    animation-fill-mode: none, none;
  }

  @keyframes stoken-slide {
    from {
      transform: translateX(-100px);
    }
    to {
      transform: translateX(700px);
    }
  }

  /* Unverified → verified: the flip happens as the token crosses the filter. */
  @keyframes stoken-verify {
    0%,
    36% {
      background: var(--scrim-soft);
      color: var(--ink-faint);
      border-color: var(--border-soft);
      box-shadow: none;
    }
    44%,
    100% {
      background: var(--ts-post-bg);
      color: var(--ts-post-color);
      border-color: var(--ts-post-border);
      box-shadow: var(--ts-post-shadow);
    }
  }

  .st-1a {
    animation-duration: 3s, 3s;
    animation-delay: 0s, 0s;
  }
  .st-1b {
    animation-duration: 3s, 3s;
    animation-delay:
      -1.5s,
      -1.5s;
  }
  .st-2a {
    animation-duration: 3.6s, 3.6s;
    animation-delay:
      -0.8s,
      -0.8s;
  }
  .st-2b {
    animation-duration: 3.6s, 3.6s;
    animation-delay:
      -2.4s,
      -2.4s;
  }
  .st-3a {
    animation-duration: 2.8s, 2.8s;
    animation-delay:
      -0.4s,
      -0.4s;
  }
  .st-3b {
    animation-duration: 2.8s, 2.8s;
    animation-delay:
      -1.8s,
      -1.8s;
  }

  .scitation {
    position: absolute;
    right: 12%;
    font-size: var(--type-2xs);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: #fff;
    background: var(--ts-accent);
    padding: 2px 5px;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(0, 119, 213, 0.5);
    z-index: 4;
    pointer-events: none;
  }

  .sc-a {
    top: 28%;
    animation: scite-pop 4s ease-in-out infinite;
  }

  .sc-b {
    top: 68%;
    animation: scite-pop 4s ease-in-out 2.2s infinite;
  }

  @keyframes scite-pop {
    0%,
    12% {
      opacity: 0;
      transform: scale(0.85) translateY(4px);
    }
    28%,
    72% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    88%,
    100% {
      opacity: 0;
      transform: scale(0.85) translateY(-4px);
    }
  }
</style>
