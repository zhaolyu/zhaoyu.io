import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { notesData } from './content';

/**
 * `static/_redirects` is the one artifact in the merge that no other gate
 * covers: Cloudflare evaluates it at the edge, the build only copies it, and
 * the preview deployment sits behind Access, so its behaviour cannot be
 * exercised from CI or from a local build. That is the shape this repo's own
 * flagship note warns about — a green build that never ran the thing it is
 * taken as evidence for.
 *
 * This cannot prove Cloudflare honours the file. It proves the two things that
 * would actually break it in this repo: a target that stopped existing, and a
 * source slug that came back to life and now shadows its own redirect.
 */
const staticDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../static');
const redirectsPath = resolve(staticDir, '_redirects');

interface RedirectRule {
  from: string;
  to: string;
  status: number;
}

function parseRedirects(): RedirectRule[] {
  const raw = readFileSync(redirectsPath, 'utf8');
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      const [from, to, status] = line.split(/\s+/);
      return { from, to, status: Number(status) };
    });
}

describe('static/_redirects', () => {
  const noteSlugs = new Set(notesData.notes.map((n) => n.slug));

  it('exists, because two published URLs depend on it', () => {
    expect(existsSync(redirectsPath), 'static/_redirects is missing').toBe(true);
  });

  it('parses every rule into a source, a target and a status', () => {
    const rules = parseRedirects();
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.from, 'rule has no source').toMatch(/^\//);
      expect(rule.to, `${rule.from} has no target`).toMatch(/^\//);
      expect(Number.isFinite(rule.status), `${rule.from} has no numeric status`).toBe(true);
    }
  });

  it('sends every retired slug to a note that still exists', () => {
    // The failure this catches: the merged note is renamed or retired later,
    // and the redirect silently starts pointing at a 404.
    for (const rule of parseRedirects()) {
      const target = rule.to.replace(/^\/blog\//, '');
      expect(noteSlugs.has(target), `${rule.from} -> ${rule.to} (target note does not exist)`).toBe(
        true,
      );
    }
  });

  it('never redirects a slug that is also a live note', () => {
    // The failure this catches: a note is re-added under a redirected slug.
    // Cloudflare evaluates _redirects before serving assets, so the redirect
    // wins and the new note becomes unreachable at its own canonical URL.
    for (const rule of parseRedirects()) {
      const source = rule.from.replace(/^\/blog\//, '');
      expect(
        noteSlugs.has(source),
        `${rule.from} is both a redirect source and a live note slug; the redirect would shadow it`,
      ).toBe(false);
    }
  });

  it('uses permanent redirects, so the canonical URL actually moves', () => {
    for (const rule of parseRedirects()) {
      expect(rule.status, `${rule.from} should be a 301`).toBe(301);
    }
  });

  it('does not point a redirect at another redirect', () => {
    // A chain costs a round trip and Cloudflare does not resolve it for you.
    const rules = parseRedirects();
    const sources = new Set(rules.map((r) => r.from));
    for (const rule of rules) {
      expect(sources.has(rule.to), `${rule.from} -> ${rule.to} is a redirect chain`).toBe(false);
    }
  });
});
