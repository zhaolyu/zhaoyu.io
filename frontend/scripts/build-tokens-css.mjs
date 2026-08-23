#!/usr/bin/env node
/**
 * Emits static/tokens.css — the custom-property layer, with no components and
 * no Tailwind, for consumers that are not this app.
 *
 * The dashboards in the other repos are vanilla HTML/CSS on Cloudflare Pages.
 * They cannot import a Svelte component, but they can link one stylesheet, so
 * this is the only part of the design system that actually travels. Extracted
 * from app.css rather than maintained by hand for the same reason
 * design-tokens.test.ts exists: two hand-kept copies of a token set diverge.
 *
 * The extraction itself lives in tokens-css.mjs, which tokens-css.test.ts runs
 * against app.css to catch a committed sheet that nobody regenerated.
 *
 * Usage:  pnpm tokens   (runs automatically via prebuild)
 * Served at https://zhaoyu.io/tokens.css once the site deploys.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokensCss } from './tokens-css.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'static/tokens.css');

try {
  const { css, tokenCount, darkCount } = buildTokensCss(
    readFileSync(join(root, 'src/app.css'), 'utf8'),
  );
  writeFileSync(outPath, css);
  console.log(`tokens.css: ${tokenCount} tokens, ${darkCount} dark overrides → static/tokens.css`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
