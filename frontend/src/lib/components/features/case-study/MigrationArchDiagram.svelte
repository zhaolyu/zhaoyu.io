<!--
  CS-1 figure: the request path before and after the edge migration.
  Static and explanatory by design — the case study argues with it, so it
  favors legibility over the animated treatment on the work card.
-->
<svg
  viewBox="0 0 720 300"
  role="img"
  aria-label="Before: every request travels to the origin monolith, which renders and serves. After: Akamai EdgeWorkers render and serve at the network edge; the origin is contacted only for data."
  class="diagram"
>
  <!-- BEFORE row -->
  <text x="16" y="34" class="row-label">Before</text>
  <g class="node">
    <rect x="16" y="52" width="120" height="52" rx="8" />
    <text x="76" y="74" text-anchor="middle" class="node-title">Browser</text>
    <text x="76" y="90" text-anchor="middle" class="node-sub">~47M readers</text>
  </g>
  <g class="edge-line dim">
    <line x1="136" y1="78" x2="360" y2="78" />
    <text x="248" y="68" text-anchor="middle" class="wire-label">every request</text>
  </g>
  <g class="node">
    <rect x="360" y="52" width="150" height="52" rx="8" />
    <text x="435" y="74" text-anchor="middle" class="node-title">CDN cache</text>
    <text x="435" y="90" text-anchor="middle" class="node-sub">static pass-through</text>
  </g>
  <g class="edge-line dim">
    <line x1="510" y1="78" x2="570" y2="78" />
  </g>
  <g class="node warn">
    <rect x="570" y="42" width="134" height="72" rx="8" />
    <text x="637" y="66" text-anchor="middle" class="node-title">Origin monolith</text>
    <text x="637" y="82" text-anchor="middle" class="node-sub">render + logic + data</text>
    <text x="637" y="98" text-anchor="middle" class="node-sub">single point of strain</text>
  </g>

  <!-- divider -->
  <line x1="16" y1="146" x2="704" y2="146" class="divider" />

  <!-- AFTER row -->
  <text x="16" y="176" class="row-label accent">After</text>
  <g class="node">
    <rect x="16" y="194" width="120" height="52" rx="8" />
    <text x="76" y="216" text-anchor="middle" class="node-title">Browser</text>
    <text x="76" y="232" text-anchor="middle" class="node-sub">~47M readers</text>
  </g>
  <g class="edge-line strong">
    <line x1="136" y1="220" x2="330" y2="220" />
    <text x="233" y="210" text-anchor="middle" class="wire-label">served at the edge</text>
  </g>
  <g class="node accent-node">
    <rect x="330" y="184" width="180" height="72" rx="8" />
    <text x="420" y="206" text-anchor="middle" class="node-title">Akamai EdgeWorkers</text>
    <text x="420" y="222" text-anchor="middle" class="node-sub">isomorphic render + logic</text>
    <text x="420" y="238" text-anchor="middle" class="node-sub">cache close to the reader</text>
  </g>
  <g class="edge-line dashed">
    <line x1="510" y1="220" x2="570" y2="220" />
    <text x="540" y="210" text-anchor="middle" class="wire-label">data only</text>
  </g>
  <g class="node">
    <rect x="570" y="194" width="134" height="52" rx="8" />
    <text x="637" y="216" text-anchor="middle" class="node-title">Origin</text>
    <text x="637" y="232" text-anchor="middle" class="node-sub">APIs, off the hot path</text>
  </g>
</svg>

<style>
  .diagram {
    width: 100%;
    height: auto;
    display: block;
  }

  .row-label {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    fill: var(--text-muted);
  }

  .row-label.accent {
    fill: var(--accent-primary-text);
  }

  .node rect {
    fill: var(--bg-primary);
    stroke: var(--border-color);
    stroke-width: 1.5;
  }

  .node.warn rect {
    stroke: var(--status-warning);
  }

  .node.accent-node rect {
    fill: var(--accent-primary-10);
    stroke: var(--accent-primary);
  }

  .node-title {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: var(--weight-bold);
    fill: var(--text-primary);
  }

  .node-sub {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--text-muted);
  }

  .edge-line line {
    stroke: var(--text-muted);
    stroke-width: 1.5;
  }

  .edge-line.strong line {
    stroke: var(--accent-primary);
    stroke-width: 2;
  }

  .edge-line.dashed line {
    stroke: var(--text-muted);
    stroke-dasharray: 5 4;
  }

  .wire-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    fill: var(--text-muted);
  }

  .divider {
    stroke: var(--border-color);
    stroke-dasharray: 2 4;
  }
</style>
