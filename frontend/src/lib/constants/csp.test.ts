import { describe, expect, it } from 'vitest';
import config from '../../../svelte.config.js';

/**
 * The CSP is the site's main defence against injected script, and it is easy to
 * weaken by accident — a third-party widget that "needs" 'unsafe-inline', or a
 * stray origin pasted in to make one console error go away.
 *
 * These tests pin the shape of the policy rather than its exact contents: new
 * origins may be added deliberately, but the escape hatches that would make the
 * policy decorative must stay out.
 */

const csp = config.kit?.csp;
const directives = csp?.directives ?? {};

const scriptSrc: readonly string[] = directives['script-src'] ?? [];
const connectSrc: readonly string[] = directives['connect-src'] ?? [];

describe('CSP configuration', () => {
  it('is delivered in hash mode', () => {
    // 'auto' would emit nonces, which cannot work on prerendered HTML: the
    // markup is built once and served to every visitor, so a nonce would be
    // shared by all of them and stop being a secret.
    expect(csp?.mode).toBe('hash');
  });

  it('declares the directives that make a policy restrictive', () => {
    for (const directive of [
      'default-src',
      'script-src',
      'object-src',
      'base-uri',
      'form-action',
    ] as const) {
      expect(directives[directive], `${directive} must be set`).toBeDefined();
    }
    expect(directives['object-src']).toEqual(['none']);
  });

  it("never allows 'unsafe-inline' or 'unsafe-eval' for script", () => {
    // Either one lets an injected <script> run and makes the rest of the policy
    // decorative. 'wasm-unsafe-eval' is deliberately allowed and is not the
    // same thing: it permits WASM compilation (PGlite on /infra), not eval of
    // arbitrary strings.
    expect(scriptSrc).not.toContain('unsafe-inline');
    expect(scriptSrc).not.toContain('unsafe-eval');
  });

  it('allows no wildcard or plaintext-http source anywhere', () => {
    for (const [directive, sources] of Object.entries(directives)) {
      for (const source of sources as readonly string[]) {
        expect(source, `${directive} must not use a wildcard`).not.toBe('*');
        expect(source, `${directive} must not allow http:`).not.toMatch(/^http:\/\//);
      }
    }
  });

  it('allows the Cloudflare Web Analytics beacon to load and report', () => {
    // Cloudflare injects the beacon at the edge. Without these two origins the
    // browser refuses it and the site collects no traffic data at all — the
    // state the site shipped in until this was fixed.
    expect(scriptSrc).toContain('https://static.cloudflareinsights.com');
    expect(connectSrc).toContain('https://cloudflareinsights.com');
  });

  it('keeps the ElectricSQL sync origin reachable', () => {
    // Cost-Guard on /infra syncs from this origin; dropping it silently breaks
    // the dashboard rather than failing the build.
    expect(connectSrc.some((source) => source.includes('ingestion-api'))).toBe(true);
  });
});
