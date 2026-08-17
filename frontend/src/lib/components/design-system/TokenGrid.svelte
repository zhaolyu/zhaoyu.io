<script lang="ts">
  import type { TokenGroup } from '$lib/constants/design-tokens';

  interface Props {
    group: TokenGroup;
    /** Rendered inside a `.dark` scope so both themes sit side by side. */
    dark?: boolean;
  }

  let { group, dark = false }: Props = $props();

  const v = (name: string) => `var(--${name})`;
</script>

<div class="token-panel" class:dark>
  <p class="panel-theme">{dark ? 'Dark' : 'Light'}</p>

  <div class="token-list" class:swatches={group.id === 'color' || group.id === 'surface'}>
    {#each group.tokens as token (token.name)}
      {@const value = dark && token.dark ? token.dark : token.value}

      <div class="token">
        {#if group.id === 'color' || group.id === 'surface'}
          <span class="chip" style="background: {v(token.name)}"></span>
        {:else if group.id === 'spacing'}
          <span class="bar" style="width: {v(token.name)}"></span>
        {:else if group.id === 'radius'}
          <span class="radius-box" style="border-radius: {v(token.name)}"></span>
        {:else if group.id === 'elevation'}
          <span class="shadow-box" style="box-shadow: {v(token.name)}"></span>
        {:else if group.id === 'type'}
          <span class="type-sample" style="font-size: {v(token.name)}">Ag</span>
        {:else if group.id === 'type-rhythm'}
          <span
            class="rhythm-sample"
            style={token.name.startsWith('leading')
              ? `line-height: ${v(token.name)}`
              : token.name.startsWith('tracking')
                ? `letter-spacing: ${v(token.name)}`
                : `font-weight: ${v(token.name)}`}
          >
            {token.name.startsWith('leading') ? 'Two lines of body copy set at this leading' : 'Ag'}
          </span>
        {:else if group.id === 'motion'}
          <span class="motion-sample" style="transition-duration: {v(token.name)}"></span>
        {/if}

        <span class="token-meta">
          <code class="token-name">--{token.name}</code>
          <span class="token-value">{value}</span>
          <span class="token-usage">{token.usage}</span>
        </span>
      </div>
    {/each}
  </div>
</div>

<style>
  .token-panel {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .panel-theme {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }

  .token-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .token-list.swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: var(--space-sm);
  }

  .token {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-height: 2.25rem;
  }

  .token-meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .token-name {
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    color: var(--text-primary);
  }

  .token-value {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    color: var(--text-muted);
  }

  .token-usage {
    font-size: var(--type-2xs);
    color: var(--text-secondary);
  }

  .chip {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .bar {
    height: 0.75rem;
    background: var(--accent-primary);
    border-radius: var(--radius-xs);
    flex-shrink: 0;
  }

  .radius-box,
  .shadow-box {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    background: var(--bg-secondary);
  }

  .radius-box {
    border: 2px solid var(--accent-primary);
  }

  .shadow-box {
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }

  .type-sample {
    font-family: var(--font-sans);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    min-width: 5rem;
    flex-shrink: 0;
  }

  .rhythm-sample {
    font-family: var(--font-sans);
    font-size: var(--type-base);
    width: 16rem;
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  /* Motion is the one token you cannot show statically; the swatch slides on
     hover so the duration is legible in the live preview. */
  .motion-sample {
    width: 3rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
    background: var(--accent-primary);
    transition-property: transform;
    transition-timing-function: var(--ease-out);
    flex-shrink: 0;
  }

  .token:hover .motion-sample {
    transform: translateX(2rem);
  }
</style>
