import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import {
  parseFleetRecord,
  cronToWords,
  formatUsd,
  formatUsdTick,
  formatShare,
  formatCount,
  shortDate,
} from './fleet';

const samplePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../static/fleet.sample.json',
);
const sample = JSON.parse(readFileSync(samplePath, 'utf8')) as unknown;

describe('parseFleetRecord', () => {
  it('accepts the committed sample, so the fallback can never be rejected', () => {
    const rec = parseFleetRecord(sample);
    expect(rec).not.toBeNull();
    expect(rec!.schema).toBe(1);
    expect(rec!.days.length).toBeGreaterThan(0);
    expect(rec!.totals.runs).toBeGreaterThan(0);
  });

  it('rejects another schema version', () => {
    expect(parseFleetRecord({ ...(sample as object), schema: 2 })).toBeNull();
  });

  it('rejects a record with no closed days', () => {
    expect(parseFleetRecord({ ...(sample as object), days: [] })).toBeNull();
  });

  it('rejects a day row with a malformed date or a negative count', () => {
    const rec = structuredClone(sample) as { days: Record<string, unknown>[] };
    rec.days[0].date = '2026/10/24';
    expect(parseFleetRecord(rec)).toBeNull();
    const rec2 = structuredClone(sample) as { days: Record<string, unknown>[] };
    rec2.days[0].runs = -1;
    expect(parseFleetRecord(rec2)).toBeNull();
  });

  it('rejects a routine whose verified share is outside 0..1', () => {
    const rec = structuredClone(sample) as { routines: Record<string, unknown>[] };
    rec.routines[0].verified_share = 1.5;
    expect(parseFleetRecord(rec)).toBeNull();
  });

  it('rejects non-objects, nulls and arrays', () => {
    expect(parseFleetRecord(null)).toBeNull();
    expect(parseFleetRecord('{}')).toBeNull();
    expect(parseFleetRecord([sample])).toBeNull();
  });

  it('carries no slot for the excluded fields', () => {
    // The policy excludes these from the public record. The sample must not
    // smuggle them in, and the parser must not need them.
    const text = readFileSync(samplePath, 'utf8');
    for (const key of [
      '"minutes"',
      '"open"',
      '"first_prompt"',
      '"cwd"',
      '"repo_roots"',
      '"outcome"',
    ]) {
      expect(text, `sample contains excluded field ${key}`).not.toContain(key);
    }
  });
});

describe('cronToWords', () => {
  it('reads the fleet cadences', () => {
    expect(cronToWords('45 7 * * 1-5')).toBe('weekdays at 07:45 ET');
    expect(cronToWords('0 7 * * *')).toBe('daily at 07:00 ET');
    expect(cronToWords('13 7 * * 2,5')).toBe('Tuesdays and Fridays at 07:13 ET');
    expect(cronToWords('30 8 * * 0')).toBe('Sundays at 08:30 ET');
    expect(cronToWords('5 7 * * 1-6')).toBe('Monday to Saturday at 07:05 ET');
    expect(cronToWords(null)).toBe('on demand');
  });

  it('returns anything it cannot read verbatim rather than guessing', () => {
    expect(cronToWords('*/15 10-15 * * 1-5')).toBe('*/15 10-15 * * 1-5');
    expect(cronToWords('0 9 1 * *')).toBe('0 9 1 * *');
    expect(cronToWords('nonsense')).toBe('nonsense');
  });
});

describe('formatters', () => {
  it('compacts dollars from one thousand and counts from ten thousand', () => {
    expect(formatUsd(3.1)).toBe('$3.10');
    expect(formatUsd(2015.42)).toBe('$2.0K');
    expect(formatUsdTick(500)).toBe('$500');
    expect(formatUsdTick(0)).toBe('$0');
    expect(formatUsdTick(1000)).toBe('$1.0K');
    expect(formatCount(919)).toBe('919');
    expect(formatCount(12_345)).toBe('12.3K');
  });

  it('shows a share as a whole percent and names a routine that never edits', () => {
    expect(formatShare(0.974)).toBe('97%');
    expect(formatShare(null)).toBe('no edits');
  });

  it('shortens a date without shifting the day across time zones', () => {
    expect(shortDate('2026-10-24')).toBe('Oct 24');
    expect(shortDate('2026-01-01')).toBe('Jan 1');
  });
});
