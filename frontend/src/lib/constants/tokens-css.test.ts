import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { buildTokensCss } from '../../../scripts/tokens-css.mjs';

/**
 * static/tokens.css is generated from app.css by `pnpm tokens`, and it is the
 * only part of the design system that leaves this repo — the vanilla
 * dashboards in the other repos link it rather than importing a component.
 *
 * Nothing regenerates it when app.css changes except a developer remembering
 * to, and it has already gone stale unnoticed: the metric-matched
 * 'Geist Sans Fallback' was added to --font-sans and the exported sheet went on
 * advertising the old stack until someone read the two files side by side.
 * `pnpm build` runs the generator, but a build that rewrites a tracked file
 * fails no gate — it just leaves a dirty tree for the next person.
 *
 * This runs the real generator rather than re-deriving the token list, so the
 * assertion cannot drift from what `pnpm tokens` would actually write.
 */

const here = dirname(fileURLToPath(import.meta.url));
const appCss = readFileSync(resolve(here, '../../app.css'), 'utf8');
const committed = readFileSync(resolve(here, '../../../static/tokens.css'), 'utf8');
const generated = buildTokensCss(appCss).css;

const STALE = 'static/tokens.css is out of date with app.css — run `pnpm tokens` and commit it';

/**
 * Declarations of one selector block in a generated sheet. The output has no
 * nested rules, so the first `}` after the selector closes it.
 */
function declarations(css: string, selector: string): Map<string, string> {
  const body = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
  const found = new Map<string, string>();
  for (const [, name, value] of body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    found.set(name, value.trim());
  }
  return found;
}

describe('generated tokens.css', () => {
  it('is what the generator emits from app.css today', () => {
    expect(committed, STALE).toBe(generated);
  });

  it('names the tokens that drifted, so the diff is readable', () => {
    // The byte comparison above is the gate; this one turns a 190-line string
    // diff into the handful of token names that actually moved.
    for (const selector of [':root', '.dark']) {
      const fresh = declarations(generated, selector);
      const shipped = declarations(committed, selector);

      for (const [name, value] of fresh) {
        expect(shipped.get(name), `${selector} --${name} is stale or missing. ${STALE}`).toBe(
          value,
        );
      }

      const dropped = [...shipped.keys()].filter((name) => !fresh.has(name));
      expect(dropped, `${selector} exports tokens app.css no longer declares. ${STALE}`).toEqual(
        [],
      );
    }
  });
});
