import type { EngineeringNote } from '$lib/constants/content';

/**
 * A month's worth of notes, for the archive's date headings.
 *
 * The archive groups rather than stamping each row, because a per-row date
 * repeats the same string once per note in any month that saw more than one
 * publication — which reads as a dump rather than an archive. The exact date
 * still lives where it carries meaning: on the note itself, and in the RSS,
 * sitemap and JSON-LD that machines read.
 */
export interface NoteMonthGroup {
  /** `YYYY-MM`, for the heading's `datetime` attribute. */
  monthISO: string;
  /** Human heading, e.g. "July 2026". */
  label: string;
  notes: EngineeringNote[];
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2026-07-11" -> "July 2026". Returns null if the date is unusable. */
function monthLabel(monthISO: string): string | null {
  const [year, month] = monthISO.split('-');
  const name = MONTHS[Number(month) - 1];
  return name && year ? `${name} ${year}` : null;
}

/**
 * Groups notes into months, newest month first, preserving the incoming order
 * within each month.
 *
 * Notes whose `dateISO` is missing or malformed are kept rather than dropped —
 * silently losing a note from the archive is worse than showing it without a
 * heading — and collected under a final untitled group.
 */
export function groupNotesByMonth(notes: readonly EngineeringNote[]): NoteMonthGroup[] {
  const byMonth = new Map<string, EngineeringNote[]>();
  const undated: EngineeringNote[] = [];

  for (const note of notes) {
    const match = /^(\d{4}-\d{2})/.exec(note.dateISO ?? '');
    if (!match) {
      undated.push(note);
      continue;
    }
    const monthISO = match[1];
    const bucket = byMonth.get(monthISO);
    if (bucket) bucket.push(note);
    else byMonth.set(monthISO, [note]);
  }

  const groups = [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthISO, groupNotes]) => ({
      monthISO,
      label: monthLabel(monthISO) ?? monthISO,
      notes: groupNotes,
    }));

  if (undated.length > 0) {
    groups.push({ monthISO: '', label: '', notes: undated });
  }

  return groups;
}
