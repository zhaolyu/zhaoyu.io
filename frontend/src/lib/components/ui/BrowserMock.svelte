<!--
  BrowserMock — decorative, non-interactive mock of an app window (traffic-light
  controls, URL bar, sidebar, shimmering content blocks). Pure illustration:
  no props, no state, no real content. Fills its container.
-->

<div class="browser-mock">
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

<style>
  .browser-mock {
    width: 100%;
    height: 100%;
    background: var(--surface-raised);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
  }

  .browser-window {
    width: 100%;
    height: 100%;
    background: var(--surface-raised);
    border-radius: var(--radius-xs);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .browser-header {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .window-controls {
    display: flex;
    gap: var(--space-xs);
  }

  .control-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
  }

  /* Traffic-light hues are the illustration's own literal palette — they are
     window-chrome iconography, not the app's semantic status colours. */
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
    background: var(--surface-raised);
    border-radius: 0.125rem;
    margin-left: var(--space-xs);
    border: 1px solid var(--border-color);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .browser-content {
    flex: 1;
    display: flex;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .sidebar {
    width: 25%;
    height: 75%;
    background: var(--surface-raised);
    border-radius: var(--radius-xs);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    opacity: 0.6;
    transition:
      background-color var(--duration-base),
      opacity var(--duration-base);
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .content-header {
    width: 100%;
    height: 8rem;
    background: var(--accent-primary-10);
    border: 1px solid var(--accent-primary-20);
    border-radius: var(--radius-xs);
    position: relative;
    overflow: hidden;
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .content-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, var(--accent-primary-10), transparent);
    animation: shimmer 2s infinite;
    transform: translateX(-100%);
    transition: background var(--duration-base);
  }

  .content-line {
    height: 1rem;
    background: var(--surface-raised);
    border-radius: 0.125rem;
    opacity: 0.6;
    transition:
      background-color var(--duration-base),
      opacity var(--duration-base);
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
    background: var(--surface-raised);
    border-radius: var(--radius-xs);
    margin-top: var(--space-xs);
    opacity: 0.4;
    transition:
      background-color var(--duration-base),
      opacity var(--duration-base);
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
</style>
