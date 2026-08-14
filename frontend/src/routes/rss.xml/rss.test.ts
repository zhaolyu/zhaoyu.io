import { describe, it, expect } from 'vitest';
import { GET } from './+server';
import { notesData } from '$lib/constants/content';

async function fetchFeed() {
  const res = GET();
  const body = await res.text();
  return { res, body };
}

describe('rss.xml GET', () => {
  it('responds with an RSS content type', async () => {
    const { res } = await fetchFeed();
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml');
  });

  it('is a well-formed RSS 2.0 channel with a self-referencing atom link', async () => {
    const { body } = await fetchFeed();
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain('<channel>');
    expect(body).toContain(
      '<atom:link href="https://zhaoyu.io/rss.xml" rel="self" type="application/rss+xml" />',
    );
  });

  it('includes every note as an item with a permalink guid', async () => {
    const { body } = await fetchFeed();
    for (const note of notesData.notes) {
      const url = `https://zhaoyu.io/blog/${note.slug}`;
      expect(body, `feed is missing ${note.slug}`).toContain(`<link>${url}</link>`);
      expect(body).toContain(`<guid isPermaLink="true">${url}</guid>`);
    }
    expect(body.match(/<item>/g)).toHaveLength(notesData.notes.length);
  });

  it('orders items newest first', async () => {
    const { body } = await fetchFeed();
    const slugOrder = [...body.matchAll(/blog\/([a-z0-9-]+)<\/link>/g)].map((m) => m[1]);
    const expected = [...notesData.notes]
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      .map((n) => n.slug);

    expect(slugOrder).toEqual(expected);
  });

  it('emits RFC 822 pubDates anchored to the note month', async () => {
    const { body } = await fetchFeed();
    const newest = notesData.notes.reduce((max, n) => (n.dateISO > max.dateISO ? n : max));
    const expected = new Date(`${newest.dateISO}-01T00:00:00Z`).toUTCString();

    expect(body).toContain(`<pubDate>${expected}</pubDate>`);
    expect(body).toContain(`<lastBuildDate>${expected}</lastBuildDate>`);
  });

  it('escapes XML-significant characters in titles and tags', async () => {
    const { body } = await fetchFeed();
    // Note titles legitimately contain ampersands and quotes; a raw one would
    // break every reader parsing the feed.
    const outsideCdata = body.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    expect(outsideCdata).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });

  it('carries note bodies in CDATA so inline markup survives', async () => {
    const { body } = await fetchFeed();
    expect(body).toContain('<content:encoded><![CDATA[');
    // The CDATA close sequence inside content would terminate the block early.
    expect(body.split('<![CDATA[').slice(1).join('')).not.toMatch(/\]\]>[^<]*\]\]>/);
  });
});
