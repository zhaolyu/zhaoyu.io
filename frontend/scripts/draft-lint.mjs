#!/usr/bin/env node
// draft-lint: the content-voice rules and the receipt schema, run against a
// draft that is not in content.ts yet. It imports the same module the vitest
// suite imports, so a draft that passes here passes the gate on merge.
//
//   node scripts/draft-lint.mjs <draft.json> [--json]
//
// Exit 0 clean, 1 findings, 2 could not run (no file, unreadable, bad JSON,
// wrong shape). It always prints the file it checked, so an empty or wrong
// argument is visible rather than silent.
import { readFileSync } from 'node:fs';
import { lintNote, lintReceipts, receiptSchemaApplies } from '../src/lib/constants/voice-rules.ts';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const file = args.find((a) => !a.startsWith('--'));
const emit = (o) => console.log(asJson ? JSON.stringify(o) : o.text);

if (!file) {
  emit({ status: 'could-not-run', text: 'draft-lint: could not run, no draft file given' });
  process.exit(2);
}

let note;
try {
  note = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  emit({ status: 'could-not-run', file, text: `draft-lint: could not run, ${file}: ${e.message}` });
  process.exit(2);
}
if (typeof note.title !== 'string' || !Array.isArray(note.content)) {
  emit({
    status: 'could-not-run',
    file,
    text: `draft-lint: could not run, ${file} is not a note (needs title: string, content: string[])`,
  });
  process.exit(2);
}

const voice = lintNote(note);
const receipts = receiptSchemaApplies(note) ? lintReceipts(note) : [];
const findings = [...voice, ...receipts];
const head = `draft-lint: checked ${file} (${note.slug || 'no slug'}, dateISO ${note.dateISO || 'unset'})`;

if (findings.length === 0) {
  emit({ status: 'clean', file, slug: note.slug, findings, text: `${head}\n  clean, 0 findings` });
  process.exit(0);
}
const lines = findings.map((f) => `  - [${f.rule}] ${f.where}: ${f.detail}`);
emit({
  status: 'findings',
  file,
  slug: note.slug,
  findings,
  text: `${head}\n  ${findings.length} finding(s)\n${lines.join('\n')}`,
});
process.exit(1);
