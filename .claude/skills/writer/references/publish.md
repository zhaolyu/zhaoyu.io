# Shipping a note

All commands run from `frontend/`. Steps 1–3 are required for a new note; skipping step 3
fails `og.test.ts`.

## 1. Add the note to `content.ts`

Insert at the **top** of `notesData.notes` (the array is maintained newest-first):

```ts
{
  slug: 'kebab-case-slug-from-the-claim',
  title: 'The Claim, Stated as a Sentence',
  date: 'Aug 2026',
  dateISO: '2026-08',
  tags: ['AI Engineering', 'Agent Architecture', 'Reliability'],
  content: [
    'Paragraph one — situation, complication, claim, mechanism.',
    'Paragraph two — corrective, evidence, and the <strong>closing rule</strong>.',
  ],
},
```

The slug is permanent: it is the canonical URL, the OG image filename, and the RSS guid.
Derive it from the claim, keep it under ~60 characters, and never rename it casually.

Nothing else needs a manual entry — `/blog/[slug]`, the blog index, the home-page notes
section, `sitemap.xml`, and `rss.xml` all derive from this array.

## 2. Link it in `static/llms.txt`

Add the note to the "Selected notes" list, newest first. `llms-links.test.ts` asserts that
the newest note by `dateISO` appears there, and that every linked slug still exists.

## 3. Regenerate OG cards

```bash
pnpm build && pnpm og
```

This writes `static/og/<slug>.png` and updates `static/og/manifest.json`. Commit both.
`og.test.ts` compares the manifest against the current card definitions, so a title or tag
edit on an *existing* note also requires this step.

## 4. Verify

```bash
pnpm test && pnpm check && pnpm lint && pnpm format
```

The tests that specifically guard content:

| Test | Guards |
|---|---|
| `og.test.ts` | A committed PNG per card; manifest matches current copy |
| `llms-links.test.ts` | llms.txt links resolve; newest note is listed |
| `sitemap.test.ts` | One URL per note; lastmod tracks `dateISO` |
| `rss.test.ts` | Feed entries and pubDates |
| `blog/[slug]/page.test.ts` | Prerender entries and 404 behavior |
| `positioning.test.ts` | Hero, bio and social copy (constraints and length caps) |

## Editing existing copy

- **Body text only** → steps 1 and 4.
- **Title or tags** → steps 1, 3, 4 (the OG card embeds both).
- **Slug** → treat as a migration: it breaks inbound links and the existing OG filename.
  Update `llms.txt`, delete the stale PNG, regenerate, and say so in the commit.
- **Hero / bio / social** → both positioning variants, then step 4; `pnpm og` too, since the
  site card tracks `heroContent`.
