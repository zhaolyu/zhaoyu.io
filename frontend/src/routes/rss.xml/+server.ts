import { notesData, type EngineeringNote } from '$lib/constants/content';
import { ROUTES } from '$lib/constants/routes';
import { noteExcerpt } from '$lib/utils/note-excerpt';

export const prerender = true;

const SITE_URL = 'https://zhaoyu.io';
const FEED_TITLE = 'Zhao Yu — Engineering Notes';
const FEED_DESCRIPTION =
  'Notes on edge performance, LLM streaming interfaces, agent reliability, and shipping at scale.';

/** XML text nodes must not carry raw markup; note content is HTML by design. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Note dates are month-granularity (YYYY-MM). RFC 822 requires a full
 * timestamp, so anchor to midnight UTC on the first of that month —
 * stable across rebuilds, which a "now" fallback would not be.
 */
function toPubDate(dateISO: string): string {
  return new Date(`${dateISO.length === 7 ? `${dateISO}-01` : dateISO}T00:00:00Z`).toUTCString();
}

function item(note: EngineeringNote): string {
  const url = `${SITE_URL}/blog/${note.slug}`;
  const categories = note.tags
    .map((tag) => `    <category>${escapeXml(tag)}</category>`)
    .join('\n');

  return `  <item>
    <title>${escapeXml(note.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${toPubDate(note.dateISO)}</pubDate>
    <description>${escapeXml(noteExcerpt(note, 300))}</description>
${categories}
    <content:encoded><![CDATA[${note.content.map((p) => `<p>${p}</p>`).join('\n')}]]></content:encoded>
  </item>`;
}

export function GET() {
  // Maintained newest-first, but sort defensively — dateISO is YYYY-MM, so
  // lexicographic comparison orders correctly.
  const notes = [...notesData.notes].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const lastBuildDate = notes.length ? toPubDate(notes[0].dateISO) : undefined;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${escapeXml(FEED_TITLE)}</title>
  <link>${SITE_URL}${ROUTES.BLOG}</link>
  <description>${escapeXml(FEED_DESCRIPTION)}</description>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${
    lastBuildDate ? `\n  <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ''
  }
${notes.map(item).join('\n')}
</channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml' },
  });
}
