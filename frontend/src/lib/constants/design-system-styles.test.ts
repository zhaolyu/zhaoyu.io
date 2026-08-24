import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import {
  FONT_FILES,
  buildStylesCss,
  declaredTokens,
  referencedTokens,
  undocumentedTokenFamilies,
  unresolvedConventionTokens,
} from '../../../scripts/design-system-styles.mjs';

/**
 * The Claude Design bundle ships two things the *design agent* reads, as
 * opposed to the `@dsCard` previews humans browse: `styles.css` and the
 * conventions header prepended to the README.
 *
 * Both fail silently. A design that references `var(--accent-primary)` when
 * styles.css never declared it renders with the property unset — no error,
 * just a colour quietly missing, discovered only by eye in a rendered design
 * nobody diffed. A conventions header naming a token that no longer exists is
 * worse: it actively teaches vocabulary that does nothing.
 *
 * So the header is checked against the generated stylesheet here rather than
 * only inside `pnpm design-system`, which needs a full build to run and is
 * skipped on every commit that isn't a sync.
 */

const here = dirname(fileURLToPath(import.meta.url));
const frontend = resolve(here, '../../..');
const appCss = readFileSync(resolve(frontend, 'src/app.css'), 'utf8');
const tokensCss = readFileSync(resolve(frontend, 'static/tokens.css'), 'utf8');
const conventions = readFileSync(resolve(frontend, '.design-sync/conventions.md'), 'utf8');
const stylesCss = buildStylesCss({ appCss, tokensCss });

describe('bundle styles.css', () => {
  it('declares every token the site does, in both themes', () => {
    const shipped = declaredTokens(stylesCss);
    const missing = [...declaredTokens(tokensCss)].filter((name) => !shipped.has(name));

    expect(missing, 'styles.css must carry the whole token layer').toEqual([]);
    expect(stylesCss).toContain(':root {');
    expect(stylesCss).toContain('.dark {');
  });

  it('loads the font families the type tokens name', () => {
    for (const font of FONT_FILES) {
      expect(stylesCss).toContain(`font-family: '${font.family}'`);
      expect(stylesCss, 'the face must resolve inside the bundle').toContain(
        `url('./fonts/${font.file}')`,
      );
    }
  });

  it('ships the metric-matched fallback, copied from app.css rather than restated', () => {
    // The size-adjust / ascent-override numbers were measured against the real
    // font files; a second hand-kept copy would drift and reintroduce the CLS
    // those overrides exist to remove.
    const measured = appCss.match(/size-adjust:\s*([\d.]+%)/)?.[1];
    expect(measured, 'app.css should still declare a measured size-adjust').toBeTruthy();
    expect(stylesCss).toContain("font-family: 'Geist Sans Fallback'");
    expect(stylesCss).toContain(`size-adjust: ${measured}`);
  });

  it('names the font files it declares, and they exist to be copied', () => {
    for (const font of FONT_FILES) {
      const path = resolve(frontend, 'node_modules', font.pkg, font.source);
      expect(existsSync(path), `${font.pkg}/${font.source} is missing`).toBe(true);
    }
  });

  it('refuses a tokens.css that lost a theme block', () => {
    expect(() => buildStylesCss({ appCss, tokensCss: ':root { --bg-primary: #fff; }' })).toThrow(
      /tokens.css/,
    );
  });
});

describe('conventions header', () => {
  it('names only tokens a rendered design can actually resolve', () => {
    expect(
      unresolvedConventionTokens(conventions, stylesCss),
      'conventions.md would teach the design agent vocabulary that resolves to nothing',
    ).toEqual([]);
  });

  it('documents every token family the system ships', () => {
    expect(
      undocumentedTokenFamilies(conventions, tokensCss),
      'a new token family needs a line in conventions.md, like it needs an entry in design-tokens.ts',
    ).toEqual([]);
  });

  it('states the rule the whole system rests on', () => {
    expect(conventions).toMatch(/[Nn]ever hardcode/);
    expect(conventions).toMatch(/class="dark"/);
  });
});

describe('token reference parsing', () => {
  it('expands brace groups so a family can be written once', () => {
    const { names } = referencedTokens('`--status-{success,error}-text`');
    expect([...names].sort()).toEqual(['status-error-text', 'status-success-text']);
  });

  it('treats a trailing -* as a family prefix, satisfied by any member', () => {
    const { prefixes } = referencedTokens('`--scrollbar-*`');
    expect([...prefixes]).toEqual(['scrollbar']);
    expect(unresolvedConventionTokens('`--scrollbar-*`', tokensCss)).toEqual([]);
    expect(unresolvedConventionTokens('`--nonesuch-*`', tokensCss)).toEqual(['--nonesuch-*']);
  });

  it('reports a token that does not exist', () => {
    expect(unresolvedConventionTokens('use `--accent-imaginary`', tokensCss)).toEqual([
      '--accent-imaginary',
    ]);
  });
});
