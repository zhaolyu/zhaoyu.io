#!/usr/bin/env node
/**
 * Writes the Claude Design hand-off bundle from the prerendered /design-system
 * pages.
 *
 * Each card becomes one self-contained HTML file under design-system/, with
 * every stylesheet inlined (Claude Design serves the files standalone, with no
 * /_app asset path) and a first-line `@dsCard` marker, which is what the
 * Design System pane indexes.
 *
 * Usage:  pnpm build && pnpm design-system
 *
 * Then, from a LOCAL Claude Code session (design sync needs an interactive
 * login that a remote session cannot perform):  /design-sync
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONT_FILES, buildStylesCss, unresolvedConventionTokens } from './design-system-styles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build', 'design-system');
const outDir = join(root, 'design-system');

// Read the card registry out of the TS source rather than importing it, so the
// script stays dependency-free and runs without a TS loader.
const registrySrc = readFileSync(join(root, 'src/lib/constants/design-system.ts'), 'utf8');
const cards = [
  ...registrySrc.matchAll(
    /\{\s*slug: '([^']+)',\s*name: '([^']+)',\s*group: '([^']+)',\s*subtitle:\s*'([^']*)',\s*viewport: \{ width: (\d+), height: (\d+) \},?\s*\}/g,
  ),
].map(([, slug, name, group, subtitle, width, height]) => ({
  slug,
  name,
  group,
  subtitle,
  width: Number(width),
  height: Number(height),
}));

if (!cards.length) {
  console.error('Parsed no cards from src/lib/constants/design-system.ts — did its shape change?');
  process.exit(1);
}

if (!existsSync(buildDir)) {
  console.error(`No prerendered cards at ${buildDir}.\nRun \`pnpm build\` first.`);
  process.exit(1);
}

/**
 * Inline every same-origin stylesheet; the bundle is served standalone, with no
 * /_app path. Prerendered pages one level deep reference `../_app/...`, so
 * leading `./` and `../` segments are stripped before resolving against build/.
 */
function inlineStyles(html) {
  let inlined = 0;

  const out = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, (tag) => {
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (!href || /^https?:/.test(href)) return tag;

    const assetPath = join(root, 'build', href.replace(/^(\.\.?\/)+/, ''));
    if (!existsSync(assetPath)) return tag;

    inlined++;
    return `<style>\n${readFileSync(assetPath, 'utf8')}\n</style>`;
  });

  return { html: out, inlined };
}

/**
 * Drop the SvelteKit hydration payload — these are static previews.
 *
 * The inner `(?:(?!<\/script>)[\s\S])*?` matters: a plain `[\s\S]*?` will
 * happily run from the theme script in <head> through to the first
 * `__sveltekit` occurrence, taking the entire <body> with it. That produced
 * 370-byte "cards" the first time this ran.
 */
function stripAppScripts(html) {
  const scriptWithPayload = new RegExp(
    '<script[^>]*>(?:(?!</script>)[\\s\\S])*?__sveltekit(?:(?!</script>)[\\s\\S])*?</script>',
    'g',
  );
  return html.replace(scriptWithPayload, '').replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '');
}

rmSync(outDir, { recursive: true, force: true });

let written = 0;
let bytes = 0;

for (const card of cards) {
  const flat = join(buildDir, `${card.slug}.html`);
  const nested = join(buildDir, card.slug, 'index.html');
  const source = existsSync(flat) ? flat : nested;

  if (!existsSync(source)) {
    console.error(`Missing prerendered page for card "${card.slug}". Run \`pnpm build\`.`);
    process.exit(1);
  }

  const marker = `<!-- @dsCard group="${card.group}" name="${card.name}" subtitle="${card.subtitle}" width="${card.width}" height="${card.height}" -->`;
  const styled = inlineStyles(readFileSync(source, 'utf8'));
  const html = `${marker}\n${stripAppScripts(styled.html)}`;

  // A card that ships without its stylesheet renders as unstyled markup in the
  // Design System pane, and looks like a design problem rather than a build one.
  if (!styled.inlined) {
    console.error(`No stylesheet inlined for "${card.slug}" — the bundle would be unstyled.`);
    process.exit(1);
  }
  if (html.length < 4000) {
    console.error(`Card "${card.slug}" came out at ${html.length} bytes — content was stripped.`);
    process.exit(1);
  }

  const dir = join(outDir, card.group.toLowerCase());
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${card.slug}.html`), html);

  written++;
  bytes += Buffer.byteLength(html);
  console.log(
    `  ${card.group.toLowerCase()}/${card.slug}.html  ${(html.length / 1024).toFixed(0)}KB`,
  );
}

/*
 * styles.css + fonts/ — the half of the bundle the design *agent* consumes.
 *
 * Rendered designs receive only styles.css's @import closure; the cards above
 * are a human-facing picker. Without this file every var(--accent-primary) the
 * agent writes resolves to nothing, and it falls back to inventing literals —
 * which is design → code, the wrong direction for this repo.
 */
const tokensCssPath = join(root, 'static/tokens.css');
if (!existsSync(tokensCssPath)) {
  console.error('No static/tokens.css — run `pnpm tokens` (or `pnpm build`, which does).');
  process.exit(1);
}

const stylesCss = buildStylesCss({
  appCss: readFileSync(join(root, 'src/app.css'), 'utf8'),
  tokensCss: readFileSync(tokensCssPath, 'utf8'),
});
writeFileSync(join(outDir, 'styles.css'), stylesCss);

mkdirSync(join(outDir, 'fonts'), { recursive: true });
let fontBytes = 0;
for (const font of FONT_FILES) {
  const from = join(root, 'node_modules', font.pkg, font.source);
  if (!existsSync(from)) {
    console.error(`Missing font ${font.pkg}/${font.source} — run \`pnpm install\`.`);
    process.exit(1);
  }
  copyFileSync(from, join(outDir, 'fonts', font.file));
  fontBytes += readFileSync(from).length;
}

console.log(
  `\n  styles.css  ${(Buffer.byteLength(stylesCss) / 1024).toFixed(0)}KB` +
    `   fonts/  ${FONT_FILES.length} files, ${(fontBytes / 1024).toFixed(0)}KB`,
);

/*
 * The conventions header is prepended to the README, which is the design
 * agent's usage reference. It names token families, so a name that no longer
 * resolves would teach the agent vocabulary that silently does nothing —
 * hence the check here as well as in design-system-styles.test.ts, which is
 * what catches it without a build.
 */
const conventions = readFileSync(join(root, '.design-sync/conventions.md'), 'utf8').trim();
const unresolved = unresolvedConventionTokens(conventions, stylesCss);
if (unresolved.length) {
  console.error(
    `conventions.md names ${unresolved.length} token(s) that styles.css does not declare:\n` +
      `  ${unresolved.join(', ')}\nFix the header (or add the token to app.css) before syncing.`,
  );
  process.exit(1);
}

writeFileSync(
  join(outDir, 'README.md'),
  `# zhaoyu.io design system — Claude Design bundle

Generated by \`pnpm design-system\`. Do not edit these files by hand; edit the
components and tokens they are rendered from, then regenerate.

- Source of truth for tokens: \`frontend/src/app.css\`
- Token index (guarded by \`design-tokens.test.ts\`): \`frontend/src/lib/constants/design-tokens.ts\`
- Card registry: \`frontend/src/lib/constants/design-system.ts\`
- Previews: \`frontend/src/routes/design-system/\`
- Conventions header below: \`frontend/.design-sync/conventions.md\`

## What is in here

- \`styles.css\` — the design vocabulary. Rendered designs receive only this
  file's \`@import\` closure, so it carries the web fonts and the full token
  layer (\`:root\` light, \`.dark\` overrides).
- \`fonts/\` — the two woff2 faces \`styles.css\` declares.
- \`foundations/\`, \`components/\` — one self-contained \`@dsCard\` preview per
  card, rendered from the real components.

## Pushing to Claude Design

Design sync needs an interactive login, so it cannot run from a remote
Claude Code web session. From a local terminal in this repo:

\`\`\`
pnpm build && pnpm design-system
/design-sync
\`\`\`

Push component by component rather than wholesale — that is the documented
discipline for keeping a local library and a Design project in step.

${written} cards, ${(bytes / 1024).toFixed(0)}KB total.

---

${conventions}
`,
);

/*
 * A browsable index for the LOCAL bundle.
 *
 * Without it, serving design-system/ falls back to the web server's own
 * directory listing, which ships no CSS and no `color-scheme` — a dark browser
 * then paints the page dark but leaves the default black heading and #0000EE
 * links on top, so the index reads as black-on-black.
 *
 * This file is local chrome only: it carries no `@dsCard` marker and sits
 * outside the design-sync plan globs (foundations/**, components/**,
 * README.md), so it never reaches the Design project.
 */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const indexBody = [...new Set(cards.map((c) => c.group))]
  .map((group) => {
    const items = cards
      .filter((c) => c.group === group)
      .map(
        (c) =>
          `        <li><a href="${group.toLowerCase()}/${c.slug}.html">` +
          `<span class="name">${esc(c.name)}</span>` +
          `<span class="sub">${esc(c.subtitle)}</span></a></li>`,
      )
      .join('\n');
    return `      <section>\n        <h2>${esc(group)}</h2>\n        <ul>\n${items}\n        </ul>\n      </section>`;
  })
  .join('\n');

writeFileSync(
  join(outDir, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>zhaoyu.io design system</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #ffffff;
        --panel: #f9fafb;
        --fg: #111827;
        --muted: #6b7280;
        --line: rgba(0, 0, 0, 0.1);
        --accent: #1d4ed8;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #111827;
          --panel: #1f2937;
          --fg: #f9fafb;
          --muted: #9ca3af;
          --line: rgba(255, 255, 255, 0.1);
          --accent: #60a5fa;
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 3rem 1.5rem;
        background: var(--bg);
        color: var(--fg);
        font: 400 16px/1.6 ui-sans-serif, system-ui, -apple-system, sans-serif;
      }
      main { max-width: 60rem; margin: 0 auto; }
      h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
      .lede { color: var(--muted); margin: 0 0 2.5rem; font-size: 0.875rem; }
      h2 {
        font: 600 0.625rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--muted);
        margin: 2rem 0 0.75rem;
      }
      ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem;
           grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); }
      a {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        padding: 0.875rem 1rem;
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 0.75rem;
        text-decoration: none;
        color: inherit;
      }
      a:hover { border-color: var(--accent); }
      a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      .name { font-weight: 600; color: var(--accent); }
      .sub { font-size: 0.8125rem; color: var(--muted); }
      footer { margin-top: 3rem; font-size: 0.8125rem; color: var(--muted); }
    </style>
  </head>
  <body>
    <main>
      <h1>zhaoyu.io design system</h1>
      <p class="lede">${written} cards, ${(bytes / 1024).toFixed(0)}KB. Generated by <code>pnpm design-system</code>.</p>
${indexBody}
      <footer>Local preview index — not part of the Claude Design bundle.</footer>
    </main>
  </body>
</html>
`,
);

console.log(`\nWrote ${written} cards (${(bytes / 1024).toFixed(0)}KB total) to design-system/.`);
console.log('Open design-system/index.html (or serve the folder) to browse them.');
