# Publishing Checklist

Every content change — engineering notes, case studies, project copy, `llms.txt` — goes
through this list before merge. Code-only PRs can skip it.

This is the **reviewer's** checklist. The author-side process (voice, note shape, the exact
publish steps) lives in the `writer` skill at
[`.claude/skills/writer`](.claude/skills/writer/SKILL.md); invoke it before writing rather
than working from memory. Don't duplicate its steps here — this file only asks whether they
were followed.

## Editorial

- [ ] The piece makes one claim and defends it; the title works as a standalone thesis statement.
- [ ] Every claim carries a receipt — a number, a named system, a cited study, or a specific
      incident. A note with no receipt and no mechanism should not ship at all.
- [ ] Facts, metrics, and project statuses are current. If a number changes, update it
      everywhere it appears (`content.ts`, `llms.txt`, README) in the same PR — numbers that
      drift across surfaces read as carelessness.
- [ ] The piece is written for both audiences: a person scrolling and an AI agent summarizing.

## Disclosure boundaries

Versant is a public company, and this is the rule the repository actually enforces — see
the disclosure policy in [CLAUDE.md](CLAUDE.md).

- [ ] Every employer-related number, on every surface (copy, `<meta>`, JSON-LD, `llms.txt`,
      OG cards), traces to a public source in `SOURCES` in `content.ts`, and carries its
      `basis`. `disclosure-guard.test.ts` holds the deny-list and scans every surface;
      `content.test.ts` enforces basis + source on metrics.
- [ ] Nothing Versant or CNBC has not disclosed publicly appears **anywhere in the
      repository** — not behind a feature flag. `content.ts` is bundled into client JS
      whether or not a card renders, so embargoed copy stays out of the repo entirely
      until it is public.
- [ ] No third-party private information (colleagues, partners, vendors).
- [ ] Framing stays on generic engineering domains — architecture, performance, AI
      engineering — not employer-vertical specifics.

## Mechanics

- [ ] Slug is stable and canonical (`/blog/{slug}`, `/work/{slug}`); it will never be
      renamed after publish — it is also the OG filename and the RSS guid.
- [ ] `dateISO` uses a full `YYYY-MM-DD` date for new posts.
- [ ] Tags are accurate; the excerpt (`noteExcerpt`) reads well standalone.
- [ ] `llms.txt` highlights updated if applicable (`llms-links.test.ts` enforces link
      validity and that the newest note is listed).
- [ ] **OG cards regenerated** — `pnpm build && pnpm og`, and both the PNG and
      `static/og/manifest.json` committed. `og.test.ts` fails without this, and a title or
      tag edit to an _existing_ note needs it too.
- [ ] Social preview verified (LinkedIn Post Inspector or opengraph.xyz) — title,
      description, and image render correctly.
- [ ] `pnpm build` output spot-checked: the new URL is prerendered and present in
      `sitemap.xml`.

## Gates

```bash
cd frontend && pnpm check && pnpm lint && pnpm test && pnpm format
```
