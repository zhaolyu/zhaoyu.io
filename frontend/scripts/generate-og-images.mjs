#!/usr/bin/env node
/**
 * Renders the prerendered /og/<slug> pages to 1200x630 PNGs in static/og/.
 *
 * The cards are built from the content constants (see src/routes/og/[slug]/+page.ts),
 * so the copy on an image can't drift from the copy on the site — but the PNGs are
 * committed artifacts, so they only refresh when this script runs. og.test.ts fails
 * when content changes without a regeneration, which is the guard that matters.
 *
 * Usage:  pnpm build && pnpm og
 *
 * Needs a Chromium binary. Set CHROMIUM_BIN, or let it find a Playwright install.
 */
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build', 'og');
const outDir = join(root, 'static', 'og');
const tmpDir = join(root, '.og-tmp');

function findChromium() {
  if (process.env.CHROMIUM_BIN) return process.env.CHROMIUM_BIN;

  const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
  if (!existsSync(browsersPath)) return undefined;

  const entries = readdirSync(browsersPath);

  // headless_shell first across *all* installs, not the first install that has
  // any binary. Full chrome under --headless runs the newer headless mode,
  // which composites the card differently: the bottom strip and the smaller
  // mono text drop out, and it does so silently.
  for (const candidate of ['headless_shell', 'chrome']) {
    for (const entry of entries) {
      const bin = join(browsersPath, entry, 'chrome-linux', candidate);
      if (existsSync(bin)) return bin;
    }
  }
  return undefined;
}

if (!existsSync(buildDir)) {
  console.error(
    `No prerendered cards at ${buildDir}.\nRun \`pnpm build\` first, then \`pnpm og\`.`,
  );
  process.exit(1);
}

const chromium = findChromium();
if (!chromium) {
  console.error(
    'No Chromium binary found.\n' +
      'Set CHROMIUM_BIN=/path/to/chrome, or install Playwright browsers, then re-run.',
  );
  process.exit(1);
}

/** Optional slug filter: `pnpm og site` regenerates one card. */
const only = process.argv[2];

// adapter-static writes prerendered pages as flat <slug>.html files, but a
// trailingSlash config would make them <slug>/index.html — accept either.
// Non-HTML siblings (manifest.json, previously generated PNGs) are skipped.
const slugs = readdirSync(buildDir, { withFileTypes: true })
  .flatMap((e) => {
    if (e.isFile() && e.name.endsWith('.html')) return [e.name.replace(/\.html$/, '')];
    if (e.isDirectory() && existsSync(join(buildDir, e.name, 'index.html'))) return [e.name];
    return [];
  })
  .filter((slug) => !only || slug === only)
  .sort();

const pagePath = (slug) => {
  const flat = join(buildDir, `${slug}.html`);
  return existsSync(flat) ? flat : join(buildDir, slug, 'index.html');
};

if (!slugs.length) {
  console.error(`No card pages under ${buildDir}.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

// Chromium writes screenshots relative to cwd and clobbers on collision, so
// each render goes to its own temp path before being moved into place.
let bytes = 0;

for (const slug of slugs) {
  const page = pagePath(slug);
  const shot = join(tmpDir, `${slug}.png`);

  execFileSync(
    chromium,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--force-color-profile=srgb',
      // Each render gets its own profile. Sharing the default user-data-dir
      // across back-to-back launches corrupts later screenshots — text drops
      // out and background layers go missing, silently and only after the
      // first few images.
      `--user-data-dir=${join(tmpDir, `profile-${slug}`)}`,
      // Deliberately no --virtual-time-budget: it advances a synthetic clock
      // and captures before the compositor has applied the card's blurred
      // glow and grid layers, silently dropping them and thinning the text.
      '--window-size=1200,630',
      `--screenshot=${shot}`,
      `file://${page}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  if (!existsSync(shot)) {
    console.error(`Chromium produced no image for ${slug}`);
    process.exit(1);
  }

  const png = readFileSync(shot);
  writeFileSync(join(outDir, `${slug}.png`), png);
  bytes += png.length;

  console.log(`  ${slug}.png  ${(png.length / 1024).toFixed(0)}KB`);
}

// The card copy as prerendered from the content constants, committed next to
// the PNGs so og.test.ts can tell when an image no longer matches the site.
// Read from cards.json and written as manifest.json deliberately: a prerendered
// route and a static/ file that resolve to the same output path collide at
// build time, and the static copy silently wins.
// Only refreshed on a full run — a filtered run would write a partial file.
if (!only) {
  copyFileSync(join(buildDir, 'cards.json'), join(outDir, 'manifest.json'));
}

// Keep the legacy flat URL alive: links shared before per-card images existed
// still point at /og-image.png.
copyFileSync(join(outDir, 'site.png'), join(root, 'static', 'og-image.png'));

rmSync(tmpDir, { recursive: true, force: true });

console.log(
  `\nWrote ${slugs.length} cards (${(bytes / 1024).toFixed(0)}KB total) to static/og/.\n` +
    'Run `pnpm build` again so they are copied into the build output.',
);
