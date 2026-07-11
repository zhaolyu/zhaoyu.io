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
    expect(body).toContain('<loc>https://zhaoyu.io/ai-manifesto</loc>');
  });

  it('includes every engineering note permalink', async () => {
    const { body } = await fetchSitemap();
    for (const note of notesData.notes) {
      expect(body).toContain(`<loc>https://zhaoyu.io/blog/${note.slug}</loc>`);
    }
  });

  it('excludes /infra because that page is noindex', async () => {
    const { body } = await fetchSitemap();
    expect(body).not.toContain('/infra');
  });
});
