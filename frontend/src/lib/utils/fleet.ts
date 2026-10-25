import type { FleetDay, FleetRecord, FleetRoutine, FleetTotals } from '$lib/types';

/**
 * Shape check for a fetched fleet record. The page falls back to the committed
 * sample on anything that is not exactly schema 1, so a publisher change that
 * drops or renames a field shows the labelled sample rather than a broken page
 * or a blank one.
 */

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isCount = (v: unknown): v is number => isNum(v) && v >= 0 && Number.isInteger(v);
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const TOTAL_KEYS: (keyof FleetTotals)[] = [
  'days',
  'runs',
  'routine_runs',
  'interactive_runs',
  'edit_runs',
  'verified',
  'unverified',
  'unaudited',
];

function isTotals(v: unknown): v is FleetTotals {
  return isObj(v) && TOTAL_KEYS.every((k) => isCount(v[k])) && isNum(v.api_equivalent_usd);
}

function isDay(v: unknown): v is FleetDay {
  return (
    isObj(v) &&
    isDate(v.date) &&
    isCount(v.runs) &&
    isCount(v.routine) &&
    isCount(v.interactive) &&
    isCount(v.edit_runs) &&
    isCount(v.verified) &&
    isNum(v.api_equivalent_usd)
  );
}

function isRoutine(v: unknown): v is FleetRoutine {
  return (
    isObj(v) &&
    typeof v.name === 'string' &&
    v.name.length > 0 &&
    (v.cadence === null || typeof v.cadence === 'string') &&
    isCount(v.runs) &&
    isDate(v.first_run) &&
    isDate(v.last_run) &&
    isNum(v.median_usd) &&
    (v.verified_share === null ||
      (isNum(v.verified_share) && v.verified_share >= 0 && v.verified_share <= 1))
  );
}

/** Returns the record when it is a well-formed schema-1 fleet record, else null. */
export function parseFleetRecord(input: unknown): FleetRecord | null {
  if (!isObj(input) || input.schema !== 1) return null;
  if (typeof input.generated_at !== 'string' || Number.isNaN(Date.parse(input.generated_at)))
    return null;
  if (typeof input.source !== 'string' || typeof input.pricing_note !== 'string') return null;
  if (!isObj(input.window) || !isDate(input.window.from) || !isDate(input.window.to)) return null;
  if (!isTotals(input.totals)) return null;
  if (!Array.isArray(input.days) || input.days.length === 0 || !input.days.every(isDay))
    return null;
  if (!Array.isArray(input.routines) || !input.routines.every(isRoutine)) return null;
  return input as unknown as FleetRecord;
}

const DAY_NAMES = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
];

function dayList(field: string): string | null {
  if (field === '*') return 'daily';
  if (field === '1-5') return 'weekdays';
  if (field === '1-6') return 'Monday to Saturday';
  if (field === '0,6' || field === '6,0') return 'weekends';
  const parts = field.split(',');
  const names: string[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 7) return null;
    names.push(DAY_NAMES[n % 7]);
  }
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
}

/**
 * A five-field cron in words, for the one shape the fleet uses: a fixed minute
 * and hour, every day of the month, on a day-of-week pattern. Anything else is
 * returned as the raw expression rather than guessed at. Times are the fleet
 * machine's local clock, which runs on US Eastern time.
 */
export function cronToWords(cron: string | null): string {
  if (cron === null) return 'on demand';
  const f = cron.trim().split(/\s+/);
  if (f.length !== 5) return cron;
  const [min, hour, dom, mon, dow] = f;
  const m = Number(min);
  const h = Number(hour);
  if (!Number.isInteger(m) || !Number.isInteger(h) || m < 0 || m > 59 || h < 0 || h > 23)
    return cron;
  if (dom !== '*' || mon !== '*') return cron;
  const days = dayList(dow);
  if (!days) return cron;
  const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ET`;
  return `${days} at ${time}`;
}

export function formatUsd(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
}

/** Axis ticks: whole dollars, compact from one thousand, no cents. */
export function formatUsdTick(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Math.round(v)}`;
}

export function formatShare(v: number | null): string {
  if (v === null) return 'no edits';
  return `${Math.round(v * 100)}%`;
}

export function formatCount(v: number): string {
  if (v >= 10_000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString('en-US');
}

/** YYYY-MM-DD → "Oct 24". */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
