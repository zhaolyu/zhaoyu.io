#!/usr/bin/env node
// artifact-guard: the checks a public-shaped page must clear before it is
// published anywhere, run against an HTML file that is not in the site.
//
//   node scripts/artifact-guard.mjs <page.html> [--manifest <forge/manifest.yaml>]
//                                   [--allow <slug,slug>] [--json]
//
// Three checks, each with a single source elsewhere:
//   1. employer-metric shapes, from src/lib/constants/disclosure-shapes.ts,
//      exempting the values performanceMetrics in content.ts already sources;
//   2. private child-repo slugs, read from the Forge manifest; "never name the
//      private child repo slugs" was a sentence in a prompt, now it is a scan
//      (the public repo and this site are allowed by default);
//   3. the identifier sweep from the vault's extraction plan: the employer
//      names, the SSO identifier fragments, and the OB1 pipeline's own terms.
//
// Exit 0 clean, 1 findings, 2 could not run. Always prints the file it checked.
import { readFileSync } from 'node:fs';
import { findUnsourced, makeExempt } from '../src/lib/constants/disclosure-shapes.ts';
import { performanceMetrics } from '../src/lib/constants/content.ts';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const file = args.find((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const emit = (o) => console.log(asJson ? JSON.stringify(o) : o.text);

if (!file) {
  emit({ status: 'could-not-run', text: 'artifact-guard: could not run, no page given' });
  process.exit(2);
}
let html;
try {
  html = readFileSync(file, 'utf8');
} catch (e) {
  emit({
    status: 'could-not-run',
    file,
    text: `artifact-guard: could not run, ${file}: ${e.message}`,
  });
  process.exit(2);
}

// Prose only: drop code and pre blocks (illustrative), then tags.
const prose = html
  .replace(/<(code|pre|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#?[a-zA-Z0-9]+;/g, ' ');
const lines = prose.split('\n');
const lineOf = (needle) => {
  const idx = prose.indexOf(needle);
  return idx < 0 ? '?' : prose.slice(0, idx).split('\n').length;
};

const findings = [];

// 1. employer-metric shapes
const exempt = makeExempt(performanceMetrics.map((m) => m.value));
for (const h of findUnsourced(prose, exempt)) {
  findings.push({ check: 'metric-shape', kind: h.kind, match: h.match, line: lineOf(h.match) });
}

// 2. private child-repo slugs from the manifest
const allow = new Set([
  'receipts',
  'zhaoyu-io',
  'zhaoyu.io',
  ...(opt('--allow') || '').split(',').filter(Boolean),
]);
const manifestPath = opt('--manifest');
let slugs = [];
if (manifestPath) {
  try {
    const y = readFileSync(manifestPath, 'utf8');
    slugs = [...y.matchAll(/^\s*slug:\s*([A-Za-z0-9._-]+)\s*$/gm)]
      .map((m) => m[1])
      .filter((s) => !allow.has(s));
  } catch (e) {
    emit({
      status: 'could-not-run',
      file,
      text: `artifact-guard: could not run, manifest ${manifestPath}: ${e.message}`,
    });
    process.exit(2);
  }
} else {
  findings.push({
    check: 'manifest',
    kind: 'not supplied',
    match: '(pass --manifest to scan for private repo slugs)',
    line: '-',
  });
}
for (const slug of slugs) {
  const re = new RegExp(
    `(?<![A-Za-z0-9_-])${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`,
    'gi',
  );
  const n = (prose.match(re) || []).length;
  if (n > 0)
    findings.push({
      check: 'private-slug',
      kind: 'child repo slug',
      match: `${slug} ×${n}`,
      line: lineOf(prose.match(re)[0]),
    });
}

// 3. identifier sweep (ops/exocortex-pipeline-extraction-plan.md, scrub list 5) plus OB1 terms
const SWEEP = [
  'bwt3',
  '206485301',
  'Versant',
  'CNBC',
  'Project Alpha',
  'Phoenix',
  'exocortex-et-al',
  'OB1',
  'exocortex_to_ob1',
  'load_to_ob1',
  'sync-to-ob1',
  'match_thoughts',
  'thoughts table',
];
// --allow covers sweep terms as well as slugs: a name the site already carries in
// shipped copy (content.ts names the retrieval layer and the vault) is not a leak
// on a proof card, and the author says so on the command line rather than the
// guard guessing.
const allowLower = new Set([...allow].map((s) => s.toLowerCase()));
for (const term of SWEEP) {
  if (allowLower.has(term.toLowerCase())) continue;
  const re = new RegExp(
    `(?<![A-Za-z0-9_])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_])`,
    'gi',
  );
  const n = (prose.match(re) || []).length;
  if (n > 0)
    findings.push({
      check: 'identifier-sweep',
      kind: 'employer or pipeline identifier',
      match: `${term} ×${n}`,
      line: lineOf(prose.match(re)[0]),
    });
}

const head = `artifact-guard: checked ${file} (${lines.length} prose lines${manifestPath ? `, manifest ${slugs.length} private slugs` : ''})`;
if (findings.length === 0) {
  emit({ status: 'clean', file, findings, text: `${head}\n  clean, 0 findings` });
  process.exit(0);
}
const out = findings.map((f) => `  - [${f.check}] line ${f.line}: ${f.kind}: ${f.match}`);
emit({
  status: 'findings',
  file,
  findings,
  text: `${head}\n  ${findings.length} finding(s)\n${out.join('\n')}`,
});
process.exit(1);
