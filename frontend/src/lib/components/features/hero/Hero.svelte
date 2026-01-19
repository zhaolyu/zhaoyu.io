<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { heroContent } from '$lib/constants/content';
  import { handleAnchorNavigation } from '$lib/utils/navigation';

  // Memoize formatted bio to avoid re-processing on every render
  const formattedBio = $derived(
    heroContent.bio
      .replace(/Zhao Yu/g, '<strong class="bio-name font-semibold">Zhao Yu</strong>')
      .replace(/shaving milliseconds off a render/g, '<strong class="bio-emphasis font-normal">shaving milliseconds off a render</strong>')
      .replace(/sub-1:25 half-marathon/g, '<span class="bio-link border-b border-blue-500/30 pb-0.5 hover:border-blue-500 transition-colors cursor-default">sub-1:25 half-marathon</span>')
  );
</script>

<section class="hero-section relative min-h-screen w-full overflow-hidden flex items-center justify-center border-b">
  
  <div class="absolute inset-0 z-0 pointer-events-none">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute inset-0 radial-overlay"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 blur-[120px] rounded-full animate-pulse duration-[4000ms]"></div>
  </div>

  <div class="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
    <div 
      in:fly={{ y: -20, duration: 800, delay: 0 }}
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 dark:bg-blue-900/20 border border-blue-500/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-mono mb-8 backdrop-blur-sm transition-colors"
    >
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
      </span>
      {heroContent.badge}
    </div>
    
    <h1 
      in:fly={{ y: 20, duration: 800, delay: 200, easing: backOut }}
      class="hero-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
    >
      {heroContent.headline.primary}<br />
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
        {heroContent.headline.accent}
      </span>
    </h1>
    
    <p 
      in:fly={{ y: 20, duration: 800, delay: 400 }}
      class="hero-bio text-lg md:text-2xl font-light tracking-wide max-w-4xl mx-auto leading-relaxed mb-10"
    >
      {@html formattedBio}
    </p>

    <div 
      in:fly={{ y: 10, duration: 800, delay: 600 }}
      class="flex flex-col md:flex-row gap-4 justify-center items-center"
    >
      <a 
        href="/#work" 
        onclick={(e) => handleAnchorNavigation(e, '/#work')}
        class="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors w-full md:w-auto"
      >
        {heroContent.cta.primary}
      </a>
      <a 
        href="/#notes" 
        onclick={(e) => handleAnchorNavigation(e, '/#notes')}
        class="px-8 py-3 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors w-full md:w-auto"
      >
        {heroContent.cta.secondary}
      </a>
    </div>

    <div 
      in:fade={{ duration: 1000, delay: 1000 }}
      class="hero-motto mt-20 flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]"
    >
      <span class="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-default">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        {heroContent.motto[0]}
      </span>
      <span class="hidden md:inline text-neutral-300 dark:text-neutral-800">•</span>
      <span class="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-default">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {heroContent.motto[1]}
      </span>
      <span class="hidden md:inline text-neutral-300 dark:text-neutral-800">•</span>
      <span class="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-default">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        {heroContent.motto[2]}
      </span>
    </div>

  </div>
</section>

<style>
  .hero-section {
    background-color: var(--bg-primary);
    border-color: var(--border-color);
    transition: background-color 0.2s, border-color 0.2s;
  }

  .radial-overlay {
    background: radial-gradient(circle 800px at 50% 50%, transparent, var(--bg-primary));
    transition: background 0.2s;
  }

  .hero-headline {
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .hero-bio {
    color: var(--text-secondary);
    transition: color 0.2s;
  }

  .hero-motto {
    color: var(--text-muted);
    transition: color 0.2s;
  }

  /* Bio text colors that adapt to theme */
  :global(.bio-name) {
    color: var(--text-primary);
    transition: color 0.2s;
  }

  :global(.bio-emphasis) {
    color: var(--text-primary);
    transition: color 0.2s;
  }

  :global(.bio-link) {
    color: var(--text-primary);
    transition: color 0.2s, border-color 0.2s;
  }

  :global(.bio-link:hover) {
    color: var(--text-primary);
  }
</style>
