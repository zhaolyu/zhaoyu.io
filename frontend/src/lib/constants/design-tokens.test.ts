import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { tokenGroups, COVERED_PREFIXES } from './design-tokens';

/**
 * app.css is the source of truth; design-tokens.ts is an index of it that the
 * previews and the Claude Design bundle enumerate. Nothing in the type system
 * connects the two, so these assertions are the only thing keeping the index
 * honest when someone edits the stylesheet.
 */
const appCss = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../app.css'),
  'utf8',
);

/** Declarations inside a top-level `selector { ... }` block. */
function declarations(selector: string): Map<string, string> {
  const start = appCss.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`app.css has no ${selector} block`);

  const open = appCss.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < appCss.length; i++) {
    if (appCss[i] === '{') depth++;
    if (appCss[i] === '}') depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }

  const block = appCss.slice(open, end);
  const found = new Map<string, string>();
  for (const [, name, value] of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    found.set(name, value.trim().replace(/\s*\/\*.*$/, ''));
  }
  return found;
}

const root = declarations(':root');
const dark = declarations('.dark');
const registry = tokenGroups.flatMap((group) => group.tokens);

describe('design token registry', () => {
  it('lists only tokens app.css actually declares, with matching values', () => {
    for (const token of registry) {
      expect(root.has(token.name), `--${token.name} is in the registry but not in app.css`).toBe(
        true,
      );
      expect(root.get(token.name), `--${token.name} value drifted from app.css`).toBe(token.value);
    }
  });

  it('records the dark override when — and only when — .dark redefines a token', () => {
    for (const token of registry) {
      if (dark.has(token.name)) {
        expect(
          token.dark,
          `--${token.name} is redefined under .dark but the registry omits it`,
        ).toBe(dark.get(token.name));
      } else {
        expect(
          token.dark,
          `--${token.name} claims a dark value that .dark does not declare`,
        ).toBeUndefined();
      }
    }
  });

  it('covers every app.css token in the families it claims', () => {
    const listed = new Set(registry.map((t) => t.name));
    const uncovered = [...root.keys()].filter(
      (name) => COVERED_PREFIXES.some((p) => name.startsWith(p)) && !listed.has(name),
    );
    expect(uncovered, `app.css declares tokens the registry never surfaces: ${uncovered}`).toEqual(
      [],
    );
  });

  it('gives every token a usage note, so a preview is never an unlabelled swatch', () => {
    for (const token of registry) {
      expect(token.usage.length, `--${token.name} has no usage note`).toBeGreaterThan(0);
    }
  });

  it('keeps group ids unique and token names unique across the whole system', () => {
    const ids = tokenGroups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);

    const names = registry.map((t) => t.name);
    expect(new Set(names).size, 'a token is listed in two groups').toBe(names.length);
  });
});
