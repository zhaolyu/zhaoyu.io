import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('$app/environment', () => ({
  browser: true,
}));

// The store computes its initial value at import time, so each test gets a
// fresh module instance via resetModules + dynamic import.
async function freshTheme() {
  vi.resetModules();
  const mod = await import('./theme');
  return mod.theme;
}

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: prefersDark });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  mockMatchMedia(false);
});

describe('initial theme', () => {
  it('uses the stored theme when localStorage has one', async () => {
    localStorage.setItem('theme', 'dark');
    const theme = await freshTheme();
    expect(get(theme)).toBe('dark');
  });

  it('falls back to system preference when nothing is stored', async () => {
    mockMatchMedia(true);
    const theme = await freshTheme();
    expect(get(theme)).toBe('dark');
  });

  it('defaults to light with no stored value and no dark preference', async () => {
    const theme = await freshTheme();
    expect(get(theme)).toBe('light');
  });

  it('ignores invalid stored values', async () => {
    localStorage.setItem('theme', 'hotdog');
    const theme = await freshTheme();
    expect(get(theme)).toBe('light');
  });
});

describe('toggle', () => {
  it('flips the theme, persists it, and syncs the .dark class', async () => {
    const theme = await freshTheme();
    expect(get(theme)).toBe('light');

    theme.toggle();
    expect(get(theme)).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    theme.toggle();
    expect(get(theme)).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('set', () => {
  it('applies an explicit theme and persists it', async () => {
    const theme = await freshTheme();
    theme.set('dark');
    expect(get(theme)).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('init', () => {
  it('applies the stored theme class to the document root', async () => {
    localStorage.setItem('theme', 'dark');
    const theme = await freshTheme();
    theme.init();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes the dark class when the resolved theme is light', async () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'light');
    const theme = await freshTheme();
    theme.init();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
