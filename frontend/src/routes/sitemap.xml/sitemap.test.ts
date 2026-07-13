import { describe, it, expect } from 'vitest';
import { GET } from './+server';
import { notesData } from '$lib/constants/content';

async function fetchSitemap() {
  const res = GET();
  const body = await res.text();
  return { res, body };
}

describe('sitemap.xml GET', () => {
  it('responds with an XML content type', async () => {
    const { res } = await fetchSitemap();
    expect(res.headers.get('Content-Type')).toBe('application/xml');
  });

  it('is a well-formed urlset with absolute canonical URLs', async () => {
    const { body } = await fetchSitemap();
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(body).toContain('<loc>https://zhaoyu.io/</loc>');
    expect(body).toContain('<loc>https://zhaoyu.io/blog</loc>');
    expect(body).toContain('<loc>https://zhaoyu.io/ai-manifesto</loc>');
  });

  it('includes every engineering note permalink', async () => {
    const { body } = await fetchSitemap();
    for (const note of notesData.notes) {
      expect(body).toContain(`<loc>https://zhaoyu.io/blog/${note.slug}</loc>`);
    }
  });

  it('stamps note entries with a full-date lastmod from their publication month', async () => {
    const { body } = await fetchSitemap();
    for (const note of notesData.notes) {
      expect(body).toContain(`<lastmod>${note.dateISO}-01</lastmod>`);
    }
  });

  it('emits only full YYYY-MM-DD lastmod values', async () => {
    const lastmods = [...(await fetchSitemap()).body.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)];
    expect(lastmods.length).toBeGreaterThan(0);
    for (const [, value] of lastmods) {
      expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('stamps the home and blog index entries with the newest note date', async () => {
    const { body } = await fetchSitemap();
    const newest = notesData.notes.reduce(
      (max, note) => (note.dateISO > max ? note.dateISO : max),
      '',
    );
    const homeEntry = body.slice(body.indexOf('<url>'), body.indexOf('</url>'));
    expect(homeEntry).toContain(`<lastmod>${newest}-01</lastmod>`);
  });

  it('excludes /infra because that page is noindex', async () => {
    const { body } = await fetchSitemap();
    expect(body).not.toContain('/infra');
  });
});
