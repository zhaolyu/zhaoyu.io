import { notesData } from '$lib/constants/content';
import { ROUTES } from '$lib/constants/routes';

export const prerender = true;

const SITE_URL = 'https://zhaoyu.io';

function urlEntry(path: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  // /infra is deliberately excluded: the page sets <meta name="robots" content="noindex">,
  // and a sitemap entry would contradict that signal.
  const staticEntries = [
    urlEntry(ROUTES.HOME, 'weekly', '1.0'),
    urlEntry(ROUTES.AI_MANIFESTO, 'monthly', '0.5'),
  ];

  const blogEntries = notesData.notes.map((note) =>
    urlEntry(`/blog/${note.slug}`, 'monthly', '0.7'),
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
