<script lang="ts">
  interface Props {
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string }>;
    tags: string[];
    image: string;
    diagram?: string;
  }

  let { title, description, metrics, tags, image, diagram }: Props = $props();
  let isHovered = $state(false);
  let showDiagram = $state(false);

  function handleViewArchitecture() {
    showDiagram = true;
  }
</script>

<div
  class="project-card"
  role="presentation"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
>
  <div class="card-grid">
    <div class="card-content">
      <div class="content-inner">
        <div class="tags-container">
          {#each tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>

        <h3 class="card-title">{title}</h3>
        <p class="card-description">{description}</p>

        <div class="metrics-grid">
          {#each metrics as metric}
            <div class="metric-item">
              <div class="metric-value">{metric.value}</div>
              <div class="metric-label">{metric.label}</div>
            </div>
          {/each}
        </div>
      </div>

      {#if diagram === 'ai-state-machine'}
        <p class="meta-note">Architected in React · Visualized in Svelte for performance.</p>
      {/if}

      <div class="card-footer">
        <button class="view-button" onclick={handleViewArchitecture}>
          View Architecture
          <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="card-visual" class:is-terminal={diagram === 'ai-state-machine'}>
      <div
        class="visual-overlay"
        class:opacity-0={isHovered || showDiagram}
        class:opacity-100={!isHovered && !showDiagram}
      >
        <div class="ui-placeholder">
          <div class="browser-window">
            <div class="browser-header">
              <div class="window-controls">
                <div class="control-dot control-red"></div>
                <div class="control-dot control-yellow"></div>
                <div class="control-dot control-green"></div>
              </div>
              <div class="url-bar"></div>
            </div>
            <div class="browser-content">
              <div class="sidebar"></div>
              <div class="main-content">
                <div class="content-header"></div>
                <div class="content-line content-line-1"></div>
                <div class="content-line content-line-2"></div>
                <div class="content-block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="diagram-overlay"
        class:opacity-100={isHovered || showDiagram}
        class:opacity-0={!isHovered && !showDiagram}
        class:is-terminal={diagram === 'ai-state-machine'}
      >
        <div class="diagram-container" class:is-terminal={diagram === 'ai-state-machine'}>
          {#if diagram === 'ai-state-machine'}
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
          {:else}
            <svg viewBox="0 0 600 300" class="diagram-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge
                >
              </filter>
              <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge
                >
              </filter>

              <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" class="shield-stop" stop-opacity="0" />
                <stop offset="50%" class="shield-stop" stop-opacity="0.6" />
                <stop offset="100%" class="shield-stop" stop-opacity="0" />
              </linearGradient>

              <linearGradient id="trail-green" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" class="trail-stop" stop-opacity="1" />
                <stop offset="100%" class="trail-stop" stop-opacity="0" />
              </linearGradient>
            </defs>

            <g class="connection-lines" stroke-width="1">
              <line x1="50" y1="150" x2="300" y2="120" />
              <line x1="50" y1="150" x2="300" y2="150" />
              <line x1="50" y1="150" x2="300" y2="180" />
              <line x1="300" y1="150" x2="500" y2="150" stroke-dasharray="4 4" />
            </g>

            <g transform="translate(500, 150)">
              <text
                x="0"
                y="-40"
                text-anchor="middle"
                class="label-text"
                font-family="monospace"
                font-size="10"
                letter-spacing="2">ORIGIN</text
              >
              <g>
                <path class="origin-box" d="M-20 -25 L20 -25 L20 25 L-20 25 Z" stroke-width="2" />
                <ellipse class="origin-box" cx="0" cy="-25" rx="20" ry="6" stroke-width="2" />
                <circle cx="10" cy="15" r="2" class="status-indicator" opacity="0.3">
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="4s"
                    begin="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>

            <g transform="translate(300, 150)">
              <text
                x="0"
                y="-80"
                text-anchor="middle"
                class="edge-label"
                font-family="monospace"
                font-size="10"
                letter-spacing="2"
                font-weight="bold">EDGE</text
              >
              <rect
                x="-2"
                y="-60"
                width="4"
                height="120"
                fill="url(#shield-gradient)"
                class="pulse-slow"
              >
                <animate
                  attributeName="fill-opacity"
                  values="0.6; 1; 0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>

            <g transform="translate(50, 150)">
              <text
                x="0"
                y="-40"
                text-anchor="middle"
                class="label-text"
                font-family="monospace"
                font-size="10"
                letter-spacing="2">CLIENT</text
              >
              <circle class="client-dot" cx="0" cy="0" r="4" />
            </g>

            <g>
              <path id="path-top" d="M50 150 Q 175 120 300 120 Q 175 120 50 150" fill="none" />
              <path id="path-mid" d="M50 150 L 300 150 L 50 150" fill="none" />
              <path id="path-bot" d="M50 150 Q 175 180 300 180 Q 175 180 50 150" fill="none" />

              <rect
                width="12"
                height="3"
                fill="url(#trail-green)"
                rx="1.5"
                filter="url(#glow-green)"
              >
                <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#path-top" />
                </animateMotion>
              </rect>

              <rect
                width="12"
                height="3"
                fill="url(#trail-green)"
                rx="1.5"
                filter="url(#glow-green)"
              >
                <animateMotion dur="2.3s" begin="0.5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#path-mid" />
                </animateMotion>
              </rect>

              <rect
                width="12"
                height="3"
                fill="url(#trail-green)"
                rx="1.5"
                filter="url(#glow-green)"
              >
                <animateMotion dur="1.8s" begin="0.2s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#path-bot" />
                </animateMotion>
              </rect>
            </g>

            <g>
              <path id="path-ssr" d="M50 150 L 500 150 L 50 150" fill="none" />

              <circle class="ssr-circle" r="4" filter="url(#glow-blue)">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  begin="1s"
                  keyPoints="0;0.5;0.5;1"
                  keyTimes="0;0.4;0.6;1"
                >
                  <mpath href="#path-ssr" />
                </animateMotion>
              </circle>
            </g>

            <g transform="translate(450, 50)" font-family="monospace" font-size="10">
              <text x="0" y="0" class="hit-rate-text" font-weight="bold">HIT: [redacted]</text>
            </g>
          </svg>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .project-card {
    position: relative;
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    overflow: hidden;
    transition:
      border-color 0.3s,
      background-color 0.3s,
      box-shadow 0.3s;
  }

  .project-card:hover {
    border-color: var(--text-muted);
    background: var(--bg-primary);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
  }

  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .card-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    position: relative;
    z-index: 10;
  }

  .content-inner {
    flex: 1;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-primary-light);
    background: var(--accent-primary-10);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }

  .card-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
  }

  .metric-value {
    font-size: 1.25rem;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-primary);
  }

  .metric-label {
    font-size: 0.625rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .card-footer {
    margin-top: 2rem;
  }

  .view-button {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }

  .project-card:hover .view-button {
    color: var(--accent-primary-light);
  }

  .arrow-icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;
  }

  .project-card:hover .arrow-icon {
    transform: translateX(0.25rem);
  }

  .card-visual {
    position: relative;
    height: 300px;
    overflow: hidden;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
  }

  .card-visual.is-terminal {
    background: #f2f5f9;
    border-color: var(--border-color);
  }

  :global(.dark) .card-visual.is-terminal {
    background: #0a0a0a;
    border-color: rgba(255, 255, 255, 0.08);
  }

  @media (min-width: 1024px) {
    .card-visual {
      height: auto;
      border-top: none;
      border-left: 1px solid var(--border-color);
    }
  }

  .visual-overlay,
  .diagram-overlay {
    position: absolute;
    inset: 0;
    transition:
      opacity 0.5s ease-in-out,
      visibility 0.5s ease-in-out;
    pointer-events: none;
  }

  .visual-overlay.opacity-100,
  .diagram-overlay.opacity-100 {
    pointer-events: auto;
  }

  .ui-placeholder {
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .browser-window {
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .browser-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .window-controls {
    display: flex;
    gap: 0.5rem;
  }

  .control-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }

  .control-red {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.5);
  }

  .control-yellow {
    background: rgba(234, 179, 8, 0.2);
    border: 1px solid rgba(234, 179, 8, 0.5);
  }

  .control-green {
    background: rgba(34, 197, 94, 0.2);
    border: 1px solid rgba(34, 197, 94, 0.5);
  }

  .url-bar {
    flex: 1;
    height: 0.5rem;
    background: var(--bg-secondary);
    border-radius: 0.125rem;
    margin-left: 0.5rem;
    border: 1px solid var(--border-color);
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .browser-content {
    flex: 1;
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  .sidebar {
    width: 25%;
    height: 75%;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    opacity: 0.6;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .content-header {
    width: 100%;
    height: 8rem;
    background: var(--accent-primary-10);
    border: 1px solid var(--accent-primary-20);
    border-radius: 0.25rem;
    position: relative;
    overflow: hidden;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .content-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, var(--accent-primary-10), transparent);
    animation: shimmer 2s infinite;
    transform: translateX(-100%);
    transition: background 0.2s;
  }

  .content-line {
    height: 1rem;
    background: var(--bg-secondary);
    border-radius: 0.125rem;
    opacity: 0.6;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  .content-line-1 {
    width: 75%;
  }

  .content-line-2 {
    width: 50%;
  }

  .content-block {
    width: 100%;
    height: 6rem;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
    margin-top: 0.5rem;
    opacity: 0.4;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .diagram-overlay {
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 2;
    visibility: hidden;
    transition:
      background-color 0.2s,
      opacity 0.5s ease-in-out,
      visibility 0.5s ease-in-out;
  }

  .diagram-overlay.opacity-100 {
    visibility: visible;
  }

  .visual-overlay {
    z-index: 1;
    visibility: visible;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    transition:
      background-color 0.2s,
      opacity 0.5s ease-in-out,
      visibility 0.5s ease-in-out;
  }

  .visual-overlay.opacity-0 {
    visibility: hidden;
  }

  .diagram-container {
    width: 100%;
    height: 100%;
    min-height: 240px;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    position: relative;
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .diagram-svg {
    width: 100%;
    height: 100%;
    max-width: 36rem;
    min-height: 240px;
  }

  /* Connection lines */
  .connection-lines {
    stroke: var(--text-primary);
    stroke-opacity: 0.1;
    transition: stroke-opacity 0.2s;
  }

  :global(.dark) .connection-lines {
    stroke-opacity: 0.03;
  }

  /* Labels */
  .label-text {
    fill: var(--text-muted);
    transition: fill 0.2s;
  }

  .edge-label {
    fill: var(--accent-primary);
    transition: fill 0.2s;
  }

  /* Origin box */
  .origin-box {
    fill: var(--bg-secondary);
    stroke: var(--border-color);
    transition:
      fill 0.2s,
      stroke 0.2s;
  }

  /* Status indicator */
  .status-indicator {
    fill: var(--status-error);
  }

  /* Client dot */
  .client-dot {
    fill: var(--text-primary);
    transition: fill 0.2s;
  }

  /* SSR circle */
  .ssr-circle {
    fill: var(--accent-primary);
    transition: fill 0.2s;
  }

  /* Hit rate text */
  .hit-rate-text {
    fill: var(--status-success);
    transition: fill 0.2s;
  }

  /* Gradient stops */
  .shield-stop {
    stop-color: var(--accent-primary);
    transition: stop-color 0.2s;
  }

  .trail-stop {
    stop-color: var(--status-success);
    transition: stop-color 0.2s;
  }

  .pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* Meta note chip */
  .meta-note {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    opacity: 0.7;
    transition:
      color 0.2s,
      border-color 0.2s;
  }

  /* ── Token Stream (data-terminal aesthetic — light + dark) ── */
  .token-stream {
    /* Light-mode design tokens (default) */
    --ts-bg: linear-gradient(145deg, #f2f5f9 0%, #eaeff6 100%);
    --ts-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    --ts-header-color: rgba(0, 0, 0, 0.38);
    --ts-header-border: rgba(0, 0, 0, 0.07);
    --ts-header-bg-color: rgba(0, 0, 0, 0.02);
    --ts-id-color: rgba(0, 0, 0, 0.5);
    --ts-col-left: rgba(0, 0, 0, 0.2);
    --ts-token-base-border: rgba(0, 0, 0, 0.06);
    --ts-pre-bg: rgba(0, 0, 0, 0.03);
    --ts-pre-color: rgba(0, 0, 0, 0.18);
    --ts-pre-border: rgba(0, 0, 0, 0.07);
    --ts-post-bg: rgba(0, 119, 213, 0.07);
    --ts-post-color: #0055a4;
    --ts-post-border: rgba(0, 119, 213, 0.35);
    --ts-post-shadow: inset 0 0 8px rgba(0, 119, 213, 0.08);

    width: 100%;
    height: 100%;
    min-height: 240px;
    background: var(--ts-bg);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono', 'IBM Plex Mono', var(--font-mono), monospace;
    overflow: hidden;
    cursor: crosshair;
    box-shadow: var(--ts-shadow);
    align-self: stretch;
    transition: background 0.2s;
  }

  :global(.dark) .token-stream {
    --ts-bg: radial-gradient(circle at top left, #1a1a1a, #0a0a0a);
    --ts-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    --ts-header-color: rgba(255, 255, 255, 0.28);
    --ts-header-border: rgba(255, 255, 255, 0.05);
    --ts-header-bg-color: rgba(255, 255, 255, 0.02);
    --ts-id-color: rgba(255, 255, 255, 0.4);
    --ts-col-left: rgba(255, 255, 255, 0.15);
    --ts-token-base-border: rgba(255, 255, 255, 0.05);
    --ts-pre-bg: rgba(255, 255, 255, 0.03);
    --ts-pre-color: rgba(255, 255, 255, 0.08);
    --ts-pre-border: rgba(255, 255, 255, 0.05);
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
    color: var(--ts-header-color);
    border-bottom: 1px solid var(--ts-header-border);
    background: var(--ts-header-bg-color);
    flex-shrink: 0;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition:
      color 0.2s,
      border-color 0.2s,
      background-color 0.2s;
  }

  .stream-id {
    font-weight: 700;
    color: var(--ts-id-color);
  }

  .stream-live {
    color: #0077d5;
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
    color: var(--ts-col-left);
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
    background: #0077d5;
    z-index: 3;
    box-shadow: 0 0 20px rgba(0, 119, 213, 0.8);
    animation: tfb-pulse 2s ease-in-out infinite;
  }

  .tfb-label {
    position: absolute;
    top: 45%;
    left: 10px;
    font-size: 9px;
    font-weight: 700;
    color: #0077d5;
    transform: rotate(-90deg);
    transform-origin: left center;
    white-space: nowrap;
    letter-spacing: 2px;
    opacity: 0.8;
    text-transform: uppercase;
  }

  @keyframes tfb-pulse {
    0%, 100% {
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
    border: 1px solid var(--ts-token-base-border);
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
    from { transform: translateX(-100px); }
    to { transform: translateX(700px); }
  }

  @keyframes stoken-verify {
    0%, 36% {
      background: var(--ts-pre-bg);
      color: var(--ts-pre-color);
      border-color: var(--ts-pre-border);
      box-shadow: none;
    }
    44%, 100% {
      background: var(--ts-post-bg);
      color: var(--ts-post-color);
      border-color: var(--ts-post-border);
      box-shadow: var(--ts-post-shadow);
    }
  }

  .st-1a { animation-duration: 3s, 3s; animation-delay: 0s, 0s; }
  .st-1b { animation-duration: 3s, 3s; animation-delay: -1.5s, -1.5s; }
  .st-2a { animation-duration: 3.6s, 3.6s; animation-delay: -0.8s, -0.8s; }
  .st-2b { animation-duration: 3.6s, 3.6s; animation-delay: -2.4s, -2.4s; }
  .st-3a { animation-duration: 2.8s, 2.8s; animation-delay: -0.4s, -0.4s; }
  .st-3b { animation-duration: 2.8s, 2.8s; animation-delay: -1.8s, -1.8s; }

  .scitation {
    position: absolute;
    right: 12%;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #fff;
    background: #0077d5;
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
    0%, 12% {
      opacity: 0;
      transform: scale(0.85) translateY(4px);
    }
    28%, 72% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    88%, 100% {
      opacity: 0;
      transform: scale(0.85) translateY(-4px);
    }
  }

  /* ── Terminal overlay: matches token-stream bg per mode ── */

  .diagram-overlay.is-terminal {
    background: #f2f5f9;
    padding: 0;
  }

  :global(.dark) .diagram-overlay.is-terminal {
    background: #0a0a0a;
  }

  /* Container: flatten — token-stream fills the full area */
  .diagram-container.is-terminal {
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: hidden;
  }

</style>
