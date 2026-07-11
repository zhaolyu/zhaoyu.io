import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('$app/environment', () => ({
  browser: true,
}));

// The module wires scroll listeners at import time, so import fresh per suite.
async function freshScroll() {
  vi.resetModules();
  return import('./scroll');
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

async function scrollTo(value: number) {
  setScrollY(value);
  window.dispatchEvent(new Event('scroll'));
  // isScrolled updates behind a 10ms debounce
  await vi.advanceTimersByTimeAsync(20);
}

beforeEach(() => {
  vi.useFakeTimers();
  setScrollY(0);
});

describe('scroll store', () => {
  it('tracks window.scrollY', async () => {
    const { scroll } = await freshScroll();
    expect(get(scroll)).toBe(0);

    setScrollY(150);
    window.dispatchEvent(new Event('scroll'));
    expect(get(scroll)).toBe(150);
  });
});

describe('isScrolled store', () => {
  it('starts false at the top of the page', async () => {
    const { isScrolled } = await freshScroll();
    expect(get(isScrolled)).toBe(false);
  });

  it('becomes true after scrolling past the nav threshold', async () => {
    const { isScrolled } = await freshScroll();
    await scrollTo(100);
    expect(get(isScrolled)).toBe(true);
  });

  it('returns to false after scrolling back to the top', async () => {
    const { isScrolled } = await freshScroll();
    await scrollTo(100);
    expect(get(isScrolled)).toBe(true);

    await scrollTo(0);
    expect(get(isScrolled)).toBe(false);
  });

  it('applies hysteresis around the threshold (20px nav trigger)', async () => {
    const { isScrolled } = await freshScroll();
    // Scrolling down: needs > threshold + 5 (i.e. > 25)
    await scrollTo(24);
    expect(get(isScrolled)).toBe(false);
    await scrollTo(26);
    expect(get(isScrolled)).toBe(true);
    // Scrolling up: stays true until <= threshold - 5 (i.e. <= 15)
    await scrollTo(16);
    expect(get(isScrolled)).toBe(true);
    await scrollTo(14);
    expect(get(isScrolled)).toBe(false);
  });
});
