<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import ThemeToggle from './ThemeToggle.svelte';
  import { handleAnchorNavigation, scrollToTop } from '$lib/utils/navigation';
  import { scroll, isScrolled } from '$lib/stores';

  let isMenuOpen = $state(false);
  let lastScrollY = $state(0);

  const navLinks = [
    { name: '/skills', href: '/#skills' },
    { name: '/career', href: '/#career' },
    { name: '/architecture', href: '/#work' },
    { name: '/latency', href: '/#latency' },
    { name: '/manifesto', href: '/#manifesto' },
    { name: '/notes', href: '/#notes' },
  ];

  const headerClasses = $derived.by(() => {
    // DIAGNOSTIC: Keep padding constant (py-4) to prevent height changes
    // Height changes cause browser to adjust scroll position to maintain visual alignment
    const baseClasses = 'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b header-nav py-4';
    const scrolledClasses = isScrolled
      ? 'backdrop-blur-md header-scrolled'
      : 'border-transparent';
    return `${baseClasses} ${scrolledClasses}`;
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  function handleNavClick(e: MouseEvent, href: string) {
    handleAnchorNavigation(e, href);
    closeMenu();
  }

  function handleOverlayKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  }

  // Store scroll position when menu opens
  $effect(() => {
    if (isMenuOpen) {
      lastScrollY = $scroll;
      document.body.style.overflow = 'hidden';
      // Also prevent scroll on document and html
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });

  // Close menu on any scroll change
  $effect(() => {
    if (isMenuOpen && Math.abs($scroll - lastScrollY) > 5) {
      closeMenu();
    }
  });

  // Handle wheel events (mouse wheel scrolling)
  function handleWheel(e: WheelEvent) {
    if (isMenuOpen) {
      // Allow scrolling within the menu itself
      const target = e.target as HTMLElement;
      const menuElement = target.closest('.mobile-menu');
      if (!menuElement) {
        closeMenu();
      }
    }
  }

  // Handle touch scrolling on mobile
  let touchStartY = 0;
  function handleTouchStart(e: TouchEvent) {
    if (isMenuOpen) {
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (isMenuOpen) {
      const target = e.target as HTMLElement;
      const menuElement = target.closest('.mobile-menu');
      const touchY = e.touches[0].clientY;
      const deltaY = Math.abs(touchY - touchStartY);
      
      // If scrolling outside the menu or significant scroll detected, close menu
      if (!menuElement || deltaY > 10) {
        closeMenu();
      }
    }
  }
</script>

<svelte:window 
  onwheel={handleWheel} 
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove} 
/>

<header class={headerClasses}>
  <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
    
    <a href="/" onclick={(e) => scrollToTop(e)} class="group flex items-center gap-2">
      <div class="font-mono font-bold text-xl tracking-tighter text-neutral-900 dark:text-white">
        zhaoyu.io
      </div>
      <div class="h-5 w-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-100 animate-pulse"></div>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <a 
          href={link.href} 
          onclick={(e) => handleAnchorNavigation(e, link.href)}
          class="text-sm font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative group"
        >
          {link.name}
          <span class="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full"></span>
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-4">
      <div class="hidden md:block h-4 w-px bg-neutral-300 dark:bg-neutral-800"></div>
      
      <a href="https://github.com/zhaolyu" target="_blank" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
        <span class="sr-only">GitHub</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
      </a>
      
      <a href="https://linkedin.com/in/zhaolyu" target="_blank" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
        <span class="sr-only">LinkedIn</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd"></path></svg>
      </a>

      <ThemeToggle />

      <!-- Hamburger Menu Button (Mobile Only) -->
      {#if !isMenuOpen}
        <button
          onclick={toggleMenu}
          class="md:hidden hamburger-button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      {/if}
    </div>
  </div>
</header>

<!-- Mobile Menu Overlay (outside header for proper positioning) -->
{#if isMenuOpen}
  <div
    class="mobile-menu-overlay"
    role="button"
    tabindex="-1"
    onclick={closeMenu}
    onkeydown={handleOverlayKeydown}
    transition:fade={{ duration: 200 }}
  >
    <div
      class="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      tabindex="0"
      onkeydown={(e) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      }}
      transition:slide={{ axis: 'x', duration: 300 }}
    >
      <div class="mobile-menu-header">
        <span class="font-mono font-bold text-lg mobile-menu-title">Navigation</span>
        <button
          onclick={closeMenu}
          class="mobile-menu-close"
          aria-label="Close menu"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mobile-menu-links">
        {#each navLinks as link}
          <a
            href={link.href}
            onclick={(e) => handleNavClick(e, link.href)}
            class="mobile-menu-link"
          >
            <span class="font-mono">{link.name}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .header-nav {
    background-color: var(--bg-primary);
    border-color: transparent;
    transition: background-color 0.2s, border-color 0.2s;
    /* Prevent layout shifts from backdrop-filter */
    will-change: background-color, border-color;
    /* Ensure consistent rendering */
    transform: translateZ(0);
  }

  .header-scrolled {
    background-color: var(--bg-primary);
    border-color: var(--border-color);
    opacity: 0.95;
  }

  @supports (backdrop-filter: blur(12px)) {
    .header-scrolled {
      background-color: color-mix(in srgb, var(--bg-primary) 80%, transparent);
      /* Use will-change to hint browser about backdrop-filter changes */
      will-change: backdrop-filter;
    }
  }

  /* Hamburger Button */
  .hamburger-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 60;
    gap: 5px;
  }

  .hamburger-line {
    width: 24px;
    height: 2px;
    background-color: var(--text-primary);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }


  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 55;
    backdrop-filter: blur(4px);
  }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 80%;
    max-width: 320px;
    background-color: var(--bg-primary);
    border-left: 1px solid var(--border-color);
    z-index: 60;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s, border-color 0.2s;
  }

  :global(.dark) .mobile-menu {
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    transition: border-color 0.2s;
  }

  .mobile-menu-title {
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .mobile-menu-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
    border-radius: 0.5rem;
    transition: background-color 0.2s, color 0.2s;
  }

  .mobile-menu-close:hover {
    background-color: var(--bg-secondary);
  }

  .mobile-menu-links {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    overflow-y: auto;
    flex: 1;
  }

  .mobile-menu-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    text-decoration: none;
    font-size: 0.9375rem;
    transition: background-color 0.2s, color 0.2s;
    border-left: 3px solid transparent;
    min-height: 44px;
  }

  .mobile-menu-link:hover,
  .mobile-menu-link:focus {
    background-color: var(--bg-secondary);
    border-left-color: var(--accent-primary);
    color: var(--text-primary);
  }

  .mobile-menu-link svg {
    color: var(--text-muted);
    transition: color 0.2s, transform 0.2s;
  }

  .mobile-menu-link:hover svg,
  .mobile-menu-link:focus svg {
    color: var(--accent-primary);
    transform: translateX(4px);
  }

  /* Hide hamburger on desktop */
  @media (min-width: 768px) {
    .hamburger-button {
      display: none;
    }
  }
</style>
