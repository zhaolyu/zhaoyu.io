<script lang="ts">
  import { BrowserMock, TokenStream } from '$lib/components/ui';

  interface Props {
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string }>;
    tags: string[];
    diagram?: string;
  }

  let { title, description, metrics, tags, diagram }: Props = $props();
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
          {#each tags as tag (tag)}
            <span class="tag">{tag}</span>
          {/each}
        </div>

        <h3 class="card-title">{title}</h3>
        <p class="card-description">{description}</p>

        <div class="metrics-grid">
          {#each metrics as metric (metric.label)}
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
        <BrowserMock />
      </div>

      <div
        class="diagram-overlay"
        class:opacity-100={isHovered || showDiagram}
        class:opacity-0={!isHovered && !showDiagram}
        class:is-terminal={diagram === 'ai-state-machine'}
      >
        <div class="diagram-container" class:is-terminal={diagram === 'ai-state-machine'}>
          {#if diagram === 'ai-state-machine'}
            <TokenStream />
          {:else}
            <svg viewBox="0 0 600 300" class="diagram-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge
                    ><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge
                  >
                </filter>
                <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge
                    ><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge
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
    /* Surround + border for the terminal diagram: they track TokenStream's own
       panel gradient endpoints, which have no global equivalent. */
    --terminal-surround: #f2f5f9;
    --terminal-border: var(--border-color);

    position: relative;
    width: 100%;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    background: var(--surface-raised);
    overflow: hidden;
    transition:
      border-color 0.3s,
      background-color 0.3s,
      box-shadow 0.3s;
  }

  :global(.dark) .project-card {
    --terminal-surround: #0a0a0a;
    --terminal-border: var(--border-subtle);
  }

  .project-card:hover {
    border-color: var(--text-muted);
    background: var(--bg-primary);
    box-shadow: var(--shadow-lg);
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
    padding: var(--space-xl);
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
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .tag {
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--accent-primary-text);
    background: var(--accent-primary-10);
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--radius-xs);
  }

  .card-title {
    font-size: var(--type-xl);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
    line-height: 1.2;
  }

  .card-description {
    color: var(--text-secondary);
    font-size: var(--type-sm);
    line-height: var(--leading-normal);
    margin-bottom: var(--space-lg);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
    border-top: 1px solid var(--border-color);
    padding-top: var(--space-lg);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
  }

  .metric-value {
    font-size: var(--type-lg);
    font-family: var(--font-mono);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
  }

  .metric-label {
    font-size: var(--type-2xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .card-footer {
    margin-top: var(--space-xl);
  }

  .view-button {
    font-size: var(--type-sm);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color var(--duration-base);
  }

  .project-card:hover .view-button {
    color: var(--accent-primary-text);
  }

  .arrow-icon {
    width: 1rem;
    height: 1rem;
    transition: transform var(--duration-base);
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
    background: var(--terminal-surround);
    border-color: var(--terminal-border);
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

  .diagram-overlay {
    background: var(--surface-raised);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
    z-index: 2;
    visibility: hidden;
    transition:
      background-color var(--duration-base),
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
    padding: var(--space-md);
    transition:
      background-color var(--duration-base),
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
    border-radius: var(--radius-lg);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
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
    transition: stroke-opacity var(--duration-base);
  }

  :global(.dark) .connection-lines {
    stroke-opacity: 0.03;
  }

  /* Labels */
  .label-text {
    fill: var(--text-muted);
    transition: fill var(--duration-base);
  }

  .edge-label {
    fill: var(--accent-primary);
    transition: fill var(--duration-base);
  }

  /* Origin box */
  .origin-box {
    fill: var(--surface-raised);
    stroke: var(--border-color);
    transition:
      fill var(--duration-base),
      stroke var(--duration-base);
  }

  /* Status indicator */
  .status-indicator {
    fill: var(--status-error);
  }

  /* Client dot */
  .client-dot {
    fill: var(--text-primary);
    transition: fill var(--duration-base);
  }

  /* SSR circle */
  .ssr-circle {
    fill: var(--accent-primary);
    transition: fill var(--duration-base);
  }

  /* Hit rate text */
  .hit-rate-text {
    fill: var(--status-success);
    transition: fill var(--duration-base);
  }

  /* Gradient stops */
  .shield-stop {
    stop-color: var(--accent-primary);
    transition: stop-color var(--duration-base);
  }

  .trail-stop {
    stop-color: var(--status-success);
    transition: stop-color var(--duration-base);
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
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-color);
    opacity: 0.7;
    transition:
      color var(--duration-base),
      border-color var(--duration-base);
  }

  /* ── Terminal overlay: matches TokenStream's panel gradient per mode ── */
  .diagram-overlay.is-terminal {
    background: var(--terminal-surround);
    padding: 0;
  }

  /* Container: flatten — TokenStream fills the full area */
  .diagram-container.is-terminal {
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: hidden;
  }
</style>
