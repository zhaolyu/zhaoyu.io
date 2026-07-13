import { notesData } from '$lib/constants/content';
import { ROUTES } from '$lib/constants/routes';

export const prerender = true;

const SITE_URL = 'https://zhaoyu.io';

// Note dates are month-granularity (YYYY-MM); Google only trusts <lastmod>
// values that look precise, so normalize to the first day of that month.
function toLastmod(dateISO: string): string {
  return dateISO.length === 7 ? `${dateISO}-01` : dateISO;
}

function urlEntry(path: string, changefreq: string, priority: string, lastmod?: string): string {
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${SITE_URL}${path}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  // The notes array is maintained newest-first, but compute the max defensively.
  // dateISO is YYYY-MM, so lexicographic comparison orders correctly.
  const newestNoteDate = notesData.notes.reduce(
    (max, note) => (note.dateISO > max ? note.dateISO : max),
    '',
  );

  // /infra is deliberately excluded: the page sets <meta name="robots" content="noindex">,
  // and a sitemap entry would contradict that signal.
  const staticEntries = [
    urlEntry(ROUTES.HOME, 'weekly', '1.0', toLastmod(newestNoteDate)),
    urlEntry(ROUTES.BLOG, 'weekly', '0.8', toLastmod(newestNoteDate)),
    urlEntry(ROUTES.AI_MANIFESTO, 'monthly', '0.5'),
  ];

  const blogEntries = notesData.notes.map((note) =>
    urlEntry(`/blog/${note.slug}`, 'monthly', '0.7', toLastmod(note.dateISO)),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...blogEntries].join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
