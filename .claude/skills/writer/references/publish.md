# Shipping a note

All commands run from `frontend/`. Steps 1–4 are required for a new note; skipping step 3
fails `og.test.ts`, and skipping step 4 ships unreviewed prose — the one thing this site
says it never does.

## 1. Add the note to `content.ts`

Insert at the **top** of `notesData.notes` (the array is maintained newest-first):

```ts
{
  slug: 'kebab-case-slug-from-the-claim',
  title: 'The Claim, Stated as a Sentence',
  date: 'Oct 2026',
  dateISO: '2026-10-04',
  tags: ['AI Engineering', 'Agent Architecture', 'Reliability'],
  sources: [
    {
      label: 'First-hand: what the receipt is, in one line',
      ref: 'abc1234',
      host: 'linux',
      verified_on: '2026-10-04',
    },
    { label: 'Publisher, title of the cited page', href: 'https://example.com/source' },
  ],
  content: [
    'Paragraph one: situation, complication, claim, mechanism.',
    'Paragraph two: corrective, evidence, and the <strong>closing rule</strong>.',
  ],
},
```

`dateISO` is a full `YYYY-MM-DD` and never in the future (`content.test.ts`); `date` is the
display string the OG eyebrow upper-cases (the corpus has both `Aug 30, 2026` and
`Sep 2026`). Every note carries at least one source; an unlinked one must start with
"First-hand" or "This site", and a first-hand one carries `ref`, `host` and `verified_on`
(`content.test.ts`, `content-voice.test.ts`). Add `format: 'essay'` for the essay lane and
`dateModified` for a later substantive edit.

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

Run it unfiltered. `pnpm og <slug>` renders one card but leaves `manifest.json` alone, so
it cannot satisfy `og.test.ts` for a new or changed card. A full run re-renders every PNG,
and unrelated cards can come back byte-different with no copy change: revert those with
`git restore static/og/<slug>.png` rather than committing the churn. The run also copies
`site.png` to `static/og-image.png`; commit that only when the site card itself changed.

## 4. Run the writer judge

Invoke the `writer-judge` skill from a context that did not author the draft — the
authoring session spawns a fresh subagent per draft, at the authoring tier or above, per
the judge's SKILL.md. Every fresh judge context runs the known-dirty calibration fixture
first, and the author checks the result against the judge's expected-findings reference;
a judge that passes the fixture is broken. The draft file the judge reads lists any code
or gate change shipping with the draft, and a provenance line for each assertion.

Fix blocking findings and re-judge. Paste the final verdict and findings table into the
PR body verbatim, with a disposition for every advisory (taken, overruled with a reason,
owner decision, or follow-up). An edit made after a PASS is disclosed in the PR body or
re-judged. A test loosened so the draft passes is not a fix: fix the prose, unless the
change is a recorded owner policy change.

## 5. Verify

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
| `content-voice.test.ts` | Note and essay shape, banned phrases, the dash ban, the receipt schema |
| `content.test.ts` | Full dates, at least one source per note, unlinked-source labels, metric sources |
| `disclosure-guard.test.ts` | No employer-shaped figure without a `performanceMetrics` source, on any surface |
| `positioning.test.ts` | Hero headline and bio rules, identity = `roleTitle`, meta cap, scope phrasing on bio/meta/llms.txt, retired claims |

## Editing existing copy

- **Body text only** → steps 1 and 4.
- **Title or tags** → steps 1, 3, 4 (the OG card embeds both).
- **Slug** → treat as a migration: it breaks inbound links and the existing OG filename.
  Update `llms.txt`, delete the stale PNG, regenerate, and say so in the commit.
- **Hero / bio / social** → `positioning.test.ts`, then step 4. Step 3 too when the site
  card moves: its subtitle is `heroContent.tagline`, its eyebrow is `roleLine`, and its
  footnote is set in `og.ts`. Commit `site.png`, `og-image.png` and `manifest.json`, and
  revert any note PNG that re-rendered with no copy change. A `socialDescriptions.meta`
  edit also changes the JSON-LD Person description (`structured-data.ts`).
