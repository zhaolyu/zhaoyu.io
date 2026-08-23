# design-sync notes — zhaoyu.io

Read this before re-running `/design-sync`. `config.json` alongside pins the target project.

## Shape: hand-authored preview bundle (off-script)

This is a SvelteKit 5 site, not a React component library, so the design-sync
converter (`package-build.mjs` / esbuild bundle / `_ds_bundle.js`) does not
apply. The repo produces its own layout:

```
pnpm build && pnpm design-system      # from frontend/ — writes design-system/ (gitignored)
```

`scripts/build-design-system.mjs` prerenders one self-contained HTML per card
from `src/routes/design-system/[card]` (real components, compiled CSS inlined,
hydration payload stripped) and stamps a first-line `@dsCard` marker. The card
registry is `src/lib/constants/design-system.ts`.

Bundle layout (as of 2026-08-19, 17 cards / 1611 KB):

```
design-system/
  README.md
  index.html                      # local browse index only — never uploaded
  foundations/{color,status,data-viz,surface,type,type-rhythm,spacing,radius,elevation,motion}.html
  components/{system-card,note-card,section-header,stat-card,data-table,annotated-chart,segmented}.html
```

Note the paths are `<group>/<slug>.html`, NOT the converter's
`components/<group>/<Name>/<Name>.html`. The Design System pane indexes cards
from the `@dsCard` first line, so this was uploaded as-is — and **confirmed
working**: the user opened the project on 2026-08-16 and all cards populated
in the Design System pane. No `register_assets` call is needed for this
layout (keep it as the fallback only if a future layout change breaks
indexing).

## First sync — 2026-08-16 (local terminal)

- Target: new project **zhaoyu.io** — `fb0221b2-12c4-4b10-8c83-6b215f6f677d`
  → https://claude.ai/design/p/fb0221b2-12c4-4b10-8c83-6b215f6f677d
- Path: incremental (project created this run, empty). One `finalize_plan`:
  `localDir=frontend/design-system`, writes `foundations/**, components/**,
README.md, _ds_needs_recompile`, deletes `foundations/**, components/**`.
- Uploaded: sentinel → README + 8 foundations → 3 components → sentinel re-arm.
  Post-upload `list_files` = 11 cards + README + sentinel, matching disk exactly.
- No `_ds_sync.json` anchor was written: the sidecar's `keyRecipe`/hash
  envelope belongs to the converter shapes and this layout has none.
  Consequence: every re-sync re-uploads all cards (cheap — 11 files) and must
  hand-derive deletes by diffing `list_files` against `design-system/`.
- Two pre-existing EMPTY projects both named "Design System"
  (`f238327f-aaaf-423e-8927-17cc3250da03`, `2d61063c-186b-4916-b540-fc85b4987701`,
  created 2026-08-17 ~01:22 UTC) were found and left untouched. They look like
  leftovers from an earlier attempt and are safe to delete in the UI.
- Cards were spot-checked locally before upload (served `design-system/` over
  http and screenshotted `foundations/color.html`, `components/system-card.html`
  — both fully styled, both themes rendering).

## Re-sync 2 — 2026-08-16, after PR #40 merged the branch into main

- `main@8ddad9b` is content-identical to the branch tip synced above (empty
  `git diff`). Rebuilt + regenerated; **skipped the upload** because the
  project already matched — see the CSP note below.
- **Build nondeterminism to expect:** every regenerated card differs from the
  previous build in exactly one place — the second `sha256-…` in the
  `<meta http-equiv="content-security-policy">` `script-src`. That hash covers
  the SvelteKit hydration script, which `stripAppScripts` removes from the
  card, so it is dead weight and never affects rendering. When deciding whether
  a re-sync has anything to upload, diff with that CSP meta masked (or fetch
  one remote card via `get_file` and diff). Cleaner fix: have
  `build-design-system.mjs` drop the CSP `<meta>` (or its stale hash) so the
  bundle is byte-deterministic and a no-change re-sync is detectable by
  checksum alone.

## Re-sync 3 — 2026-08-16, dashboard/data-viz kit port (11 → 16 cards)

- Ported `templates/dashboard-dataviz-kit/handoff/` into the repo: status family
  extended (`-text`, `-10/-20`, `--status-info`), new `--viz-*` series palette,
  5 UI components, 5 new cards (`status`, `data-viz`, `stat-card`, `data-table`,
  `annotated-chart`).
- Atomic path (project non-empty + pinned). One `finalize_plan`:
  `localDir=frontend/design-system`, writes `foundations/**, components/**,
README.md, _ds_needs_recompile`, **deletes `[]`** — every remote path still
  existed on disk, so this was a pure overwrite plus 5 additions.
  Note `finalize_plan` rejects an omitted `deletes`; pass `[]` explicitly.
- Uploaded: sentinel → README + 10 foundations → 6 components → sentinel re-arm.
  Post-upload `list_files` = 16 cards + README + sentinel, matching disk.
- **All 11 pre-existing cards were re-uploaded, not just the 5 new ones.** Every
  card inlines `app.css`, which grew ~63 lines; `color.html` additionally lost
  its status swatches and had its subtitle retitled. Assume a token change means
  a full re-upload.
- `TokenGrid` gated swatch rendering on `group.id === 'color' || 'surface'`, so
  the two new foundation cards first generated as unlabelled text lists — a
  colour card with no colour. Fixed with a `SWATCH_GROUPS` list before upload.
  **Any future token group needs adding there**, or its card ships as text.
- The project was being edited from the Claude Design side during this run — an
  `exocortex-viz/` handoff, `dashboard-style.css`, `build-tokens-css.mjs`,
  `uploads/` and `screenshots/` appeared mid-session. None were touched; the
  plan globs cover only `foundations/`, `components/` and `README.md`.
- `build-design-system.mjs` now also emits `design-system/index.html`, a local
  browse index. The bare `python -m http.server` listing ships no CSS and no
  `color-scheme`, so in a dark browser it renders black-on-black. The index has
  no `@dsCard` marker and sits outside the plan globs — it is never uploaded.

## Re-sync 4 — 2026-08-19, data-viz library additions + Segmented (16 → 17 cards)

- Source: `main@29e7d2d` (PR #43, "Finish the data-viz library additions and
  ship tokens.css"), run from the `claude/design-system-sync-9c8f53` worktree.
  Fresh `pnpm install --frozen-lockfile` was needed — worktrees start without
  `node_modules`.
- Atomic path again (project non-empty + pinned). `get_project` confirmed
  `PROJECT_TYPE_DESIGN_SYSTEM`, `canEdit: true`. One `finalize_plan`:
  `localDir=frontend/design-system`, writes `foundations/**, components/**,
README.md, _ds_needs_recompile`, `deletes: []` — every remote card path still
  existed on disk.
- Pre-upload `list_files` showed the previous sentinel had been consumed
  (`_ds_needs_recompile` absent; `_ds_manifest.json` + `_ds_bundle.js` present),
  i.e. the app did recompile after re-sync 3.
- **Uploaded one file per `write_files` call** (the "card by card, not
  wholesale" discipline): sentinel (`"1"`, text/plain) → README → 10
  foundations → 7 components → sentinel re-arm. 20 calls, all `written: 1`.
- All 16 pre-existing cards re-uploaded, not just `segmented`: `app.css` grew
  38 lines (`--viz-series-*-dense`, `--viz-structure/quiet/conflict`) and every
  card inlines the compiled CSS. Spot-checked before upload: `data-viz.html`
  body references all 11 new tokens; `segmented.html` renders 4 groups / 12
  buttons across Light + Dark (no text-only fallback).
- Post-upload `list_files` = 17 cards + README + sentinel, matching disk. The
  Claude-Design-side files (`templates/**`, `uploads/**`, `screenshots/**`,
  `_ds_*`, `_adherence.oxlintrc.json`, `github.md`) were untouched.
- The `styles.css` / conventions-header gaps below still stand. `pnpm tokens`
  now emits `static/tokens.css` for the _site_ (served at `/tokens.css`), but
  the bundle itself still ships no stylesheet file — the fix is the same as
  before: have `build-design-system.mjs` also write a `styles.css` and add it
  to the plan's writes.

## Re-sync 5 — 2026-08-23, disclosure fix + font-fallback tokens (17 cards, all re-uploaded)

- Source: `main@bb646af` (PR #58). Run from the `claude/design-system-sync-9c8f53`
  worktree after fast-forwarding it 44 commits to `origin/main`.
- **Why it was needed, and not just "tokens changed":** re-sync 4 was built
  from a worktree whose index carried a stale, uncommitted copy edit that
  replaced the `[redacted]` placeholders in `content.ts` with the employer
  figures they stood for. `pnpm build` reads the **working tree, not HEAD**,
  and `components/system-card.html` renders `builderProjects[0]` from
  `content.ts`, so the uploaded card carried those figures into the Design
  project. Main had meanwhile rewritten that copy on public-sourced claims
  only (`803cf8c`), so the card was both leaking and stale. The stale index was
  stashed (not applied, not committed) and the bundle rebuilt from main. The
  values themselves are deliberately not written down here — see the header of
  `disclosure-guard.test.ts` for why a list of them is the worst artefact to
  keep in this repo.
- Pre-flight this time: `pnpm check` (0 errors), `pnpm lint` (clean),
  `pnpm test` (886 passed, incl. the new tokens.css drift guard), `pnpm build`
  (tokens.css regenerated byte-identical to the committed file). The disclosure
  guard in that suite scans the very sources the cards render from, so a green
  run on a clean tree is the leak check; a final `grep -rl '\[redacted\]'
design-system/` for the placeholder itself came back empty.
- Atomic path, `finalize_plan` with the usual globs and `deletes: []`. Pushed
  **one file per `write_files`**, `system-card.html` first so the fix landed
  before anything else: sentinel → system-card → README → 10 foundations → 6
  components → sentinel re-arm. 20 calls, all `written: 1`.
- Verification went one step further than structure: `get_file` on the remote
  `components/system-card.html` → no employer-metric shapes present, sha256
  identical to the local card. (`get_file` output lands in a persisted tool-result file,
  so the check costs nothing in context — grep that file rather than reading
  it.) Post-upload `list_files` = 17 cards + README + sentinel, matching disk.
- Live site checked in the same pass: `/`, `/tokens.css`, `/llms.txt`,
  `/sitemap.xml` all 200; `tokens.css` and `llms.txt` byte-identical to main;
  homepage and llms.txt carry no `[redacted]` markers and pass the same shape
  check.
- Bundle grew 1611 → 1659 KB (app.css gained the font-fallback metrics block);
  17 cards, same layout.

## Re-sync procedure

0. `git fetch && git status` — the checkout must be **clean and at
   `origin/main`** (fast-forward a worktree branch if it lags). The build reads
   the working tree, not HEAD: a stale index or uncommitted copy edit ships
   inside the cards (see re-sync 5).
1. `cd frontend && pnpm install --frozen-lockfile && pnpm test && pnpm build && pnpm design-system`.
   `pnpm test` is not optional here: `disclosure-guard.test.ts` scans the same
   sources the cards render from, and it is the only thing standing between a
   dirty tree and an employer figure inside a card. Then
   `grep -rl '\[redacted\]' design-system/` must come back empty (the
   placeholder is not a leak, but it is not a card either).
2. `DesignSync(list_files)` on the pinned project → project is non-empty and
   pinned before the run → **atomic path**.
3. Diff `list_files` against `design-system/`: any remote path under
   `foundations/` or `components/` that disk no longer has goes into the plan's
   `deletes` explicitly.
4. `finalize_plan` with the same globs as above (add new top-level groups if
   the registry grew one), then: sentinel → all writes → deletes → sentinel.
5. Skip `_ds_sync.json` (see above).

## Known gaps / follow-ups (not blockers)

- **No `styles.css` in the bundle.** Rendered designs in Claude Design receive
  only `styles.css`'s `@import` closure, so the token vocabulary in the cards
  (`--bg-*`, `--accent-*`, `--space-*`, …) does not reach designs the agent
  builds — the cards are a human-facing reference today. Fix: have
  `build-design-system.mjs` also emit the compiled `build/_app/immutable/assets/*.css`
  as `styles.css`, add it to the plan's writes, and re-sync.
- **No conventions header** (`.design-sync/conventions.md` → README). Deferred
  deliberately: without `styles.css` a header telling the design agent to use
  `var(--accent-primary)` would name vocabulary that doesn't resolve in designs.
  Author it together with the `styles.css` fix — CLAUDE.md's "Design System"
  token-family table is the right starting content, and every name must be
  grepped against the compiled CSS before shipping. The build script would need
  a small hook to prepend the file to the generated README.
- No `.d.ts` / `.prompt.md` per component — not applicable to Svelte
  components; the design agent gets previews + README only.
