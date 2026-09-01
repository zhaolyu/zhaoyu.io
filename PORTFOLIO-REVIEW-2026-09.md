# Portfolio review and spec — September 2026

Reviewed against `main` at `32028fb` on 2026-09-01. Goal set by Zhao: get the site to a
standard a recruiter can act on, with the page focused on **his reasoning, understanding,
and mental models of the world we are moving towards**, drawing on the exocortex where
that makes sense.

This document is the audit plus the spec for everything still outstanding. It follows the
shape of `LANDING-PAGE-RETHINK.md`: findings first, then a prioritised work plan with
acceptance criteria, then the decisions only Zhao can make.

---

## 1. Health baseline (measured, not assumed)

Everything below was run on this branch, this session:

| Check                          | Result                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                    | **934 passed / 934**, 29 files, exit 0                                                                                                          |
| `pnpm build`                   | exit 0; 17 URLs prerendered into `sitemap.xml`                                                                                                  |
| Notes shipped                  | 14 (12 notes + 2 essays)                                                                                                                        |
| Case studies shipped           | **0** — `CASE_STUDIES` is an empty array                                                                                                        |
| Vault (`/home/user/exocortex`) | 2,028 files; **1,760** assertion-type notes; **8,863** claim→claim links; **2,994 (34%)** cross-domain; 143 topic maps, 25 of them cross-domain |

**The codebase is not the problem.** Test coverage, disclosure enforcement, design-token
discipline, structured data, OG generation and the machine-readable layer are all in good
order and genuinely above the bar for a personal site. Every finding below is editorial,
architectural, or a piece of machinery that shipped without its content.

---

## 2. Findings

### F1 — The site promises receipts; nine of fourteen notes do not carry one a stranger can check

The hero says "Engineering notes with receipts." `PUBLISHING.md` states the rule: _"A note
with no receipt and no mechanism should not ship at all."_ Measured across `notesData`:

| Note                                          | Date   | Words | Sources with an `https` link |
| --------------------------------------------- | ------ | ----: | ---------------------------: |
| your-checks-are-lying-to-you                  | Aug 30 | 1,432 |                            2 |
| reinforcement-anchors-beat-emphasis…          | Aug 14 |   310 |                            3 |
| spec-quality-is-the-bottleneck…               | Jul 11 |   237 |                            3 |
| why-i-made-this-site-readable-by-machines…    | Jul 11 |   228 |                            2 |
| building-with-ai-the-compound-advantage       | Jul 11 |   132 |                            1 |
| agents-re-derive-judgment…                    | Aug 30 |   294 |                            0 |
| the-agent-run-is-the-new-unit-of-work         | Jul 11 |   294 |                            0 |
| agents-degrade-quietly…                       | Jul 11 |   265 |                            0 |
| the-three-tiers-of-using-ai…                  | Jul 11 |   245 |                            0 |
| agent-failures-are-loop-failures              | Jul 11 |   230 |                            0 |
| the-url-is-the-source-of-truth                | Jul 11 |   160 |                            0 |
| idempotency-in-distributed-systems            | Jul 11 |   126 |                            0 |
| sovereign-resilience…                         | Jul 11 |   123 |                            0 |
| decoupling-state-from-render-in-llm-streaming | Jul 11 |   106 |                            0 |

A `First-hand:` label is a legitimate receipt and the `NoteSource` type documents why. The
problem is not the type, it is the **concentration**: the bottom five notes are 106–160
words carrying a single unlinked first-hand label and no named mechanism. Those are
assertions, and they sit on the landing page at the same visual weight as the essay.

This is the site's own model turned on itself. `agentEraModels` ships "fail-open checks:
a check whose _did not run_ is indistinguishable from _passed_." A receipts rule that the
corpus does not actually satisfy is the same shape: the promise closes the question
without doing the work.

### F2 — The publication record reads as one batch, not a practice

Ten of the fourteen notes carry `dateISO: 2026-07-11`. Then one on Aug 14, two on Aug 30.
A recruiter reading the archive sees a dump followed by near-silence followed by a
restart. The two recent notes are excellent and clearly the current standard; the archive
drags the average down and the date distribution says the site is a project rather than a
habit.

### F3 — The mental models on the site are all one tier and one domain

`agentEraModels` (5) + `codeStandards` (5) + `footerManifesto` (4) are all
engineering-and-agent models. They are good, but they are _craft_ models. The vault's
genuinely rare asset — and the one that answers "mental models of the world we are moving
towards" — is the **domain-independent** layer: models that hold in engineering, in
capital allocation, and in knowledge work at once, with a receipt from each.

The vault's own link graph ranks these. Of its 70 most-referenced claims, **69 pass
`redline-enum.py` clean** (one is Tier-E and excluded). The top of that list is not on the
site in any form:

- `a-written-instruction-file-is-context-not-enforcement-a-hard-requirement-needs-a-deterministic-control` (41 inbound) — the general form of the fail-open essay, and the single most useful thing to say to an org adopting agents.
- `replacing-the-intuitive-measurement-unit-with-the-analytically-correct-one-reveals-systematic-distortions-hidden-by-convenient-proxies` (39) — the risk-parity → capacity-aware-load-balancing generalisation.
- `displacement-resistance-follows-hierarchy-from-cognitive-to-relational-to-physical-to-regulatory` (30) — a framework for what AI actually displaces.
- `ai-tool-alpha-converges-to-zero-through-symmetric-adoption-leaving-only-human-edge-as-residual-advantage` (29) — the economic model of the moment.
- `prevented-loss-invisibility-means-high-value-work-that-averts-bad-outcomes-is-structurally-underrewarded-because-good-judgment-looks-like-nothing-happening` (28) — an engineering-management model with an investment receipt.
- `builder-and-reviewer-agents-should-be-separated-by-design…` (28), `evaluation-environment-must-be-quarantined-from-construction…` (29), `minimum-effective-intelligence-routing…` (31).

The site currently shows the outputs of this thinking. It does not show the thinking.

### F4 — The flagship proof point is built but empty

`case-studies.ts` ships the full machinery — route, OG card, JSON-LD, sitemap entry,
`case-studies.test.ts` enforcing ≥1,200 words, sourced outcomes, a required `regrets`
section, a `myRoleVsTeam` credit boundary — and `CASE_STUDIES = []`.

`CASE-STUDY-DRAFT-nextgen-migration.md` is a complete draft blocked on four facts only
Zhao holds (period, ratification, cutover mechanics, regrets + team boundary). A decision
record with a real regrets section is the highest-value artifact a senior engineering
candidate can put on the internet, and it is ten minutes of wiring behind four answers.

### F5 — Nothing on the site shows Zhao disagreeing with himself

The vault holds **61 tension-type notes** — explicit, preserved disagreements between
positions he holds. Every portfolio has opinions. Almost none show a live tension the
author has declined to resolve, which is the clearest available signal that the reasoning
is real rather than performed.

### F6 — A recruiter cannot answer "who, what level, how do I reach them" above the fold

The Option A restructure was right for differentiation and should stand. But the hero now
renders headline + accent + bio + two CTAs and nothing else. There is no role, no level,
no location, no contact affordance, and no résumé until `#about` (section 5) and
`#connect` (section 7). The role survives only in `<title>`, meta, JSON-LD and `llms.txt`
— all finding aids a human scanner never sees.

Craft-first is not in tension with scannability. A one-line identity strip is a fact, not
a pitch; six repetitions of a scope claim was the thing worth deleting, and that stays
deleted.

### F7 — Two working artifacts are unreachable

- `/infra` — the Cost-Guard dashboard (PGlite + ElectricSQL, live sync, what-if simulator) is not in `navLinks` and not in `sitemap.xml`. It is genuinely impressive and effectively unlisted.
- `/work` — `ROUTES.WORK` exists and `/work/{slug}` renders, but there is no `/work` index. The first published case study will have no parent page.

### F8 — Number drift against the site's own standard

The site's rule is that every figure carries a basis and a source. Two figures do not:

- `builderProjects` OB1 card: "1,700" atomic claims, no basis, no date.
- `llms.txt` §7: "1,700 atomic, cross-linked claims", same.

Measured today the vault holds **1,760** assertion-type notes and **8,863** claim-to-claim
links. The `agents-re-derive-judgment` note does this correctly — it states
"measured 30 Aug 2026" — and the other two surfaces should match that pattern rather than
chase the number.

---

## 3. The spec

Ordered by recruiter value per unit of effort. Every item lists the files it touches and
what has to be true before it ships. Gates for all of them:
`cd frontend && pnpm check && pnpm lint && pnpm test && pnpm format`, plus `PUBLISHING.md`
for anything that changes prose.

### P0 — Ships the site to a recruiter-ready floor

#### P0.1 Publish the Next-Gen migration case study

**Blocked on Zhao.** Answer the four questions in `CASE-STUDY-DRAFT-nextgen-migration.md`
§"The four questions blocking publication". Then:

- Paste the entry into `CASE_STUDIES` in `frontend/src/lib/constants/case-studies.ts`, set `dateISO`.
- `pnpm build && pnpm og`; commit the PNG and `static/og/manifest.json`.
- Add `/work/cnbc-com-edge-migration` to `static/llms.txt` Key pages.
- Run the `writer-judge` skill; put the verdict in the PR body.

**Acceptance:** `case-studies.test.ts` green (word count, sources, every outcome has a
basis, `relatedNotes` resolve); the URL appears in `sitemap.xml`; the `regrets` section
names something that actually went wrong.

#### P0.2 Restore a compact identity strip and a reachable contact

Craft-first body order is unchanged. Add, in `frontend/src/lib/components/features/hero/Hero.svelte`:

- One line under the CTAs rendering the existing `roleLine` constant plus location — a fact stated once, in sans, at secondary weight. Not a badge, not a chip row.
- A tertiary text link to `#connect` beside the two CTAs, or an email link in `Navbar.svelte`.

**Acceptance:** `positioning.test.ts` still green **without widening any scope-claim rule**
— this adds one statement of a claim the tests already permit, it does not relax them.
Role/level/contact all resolvable from the first viewport at 390px and 1440px.

#### P0.3 Close the receipts gap on the five thin notes

Target: `sovereign-resilience…`, `idempotency-in-distributed-systems`,
`the-url-is-the-source-of-truth`, `decoupling-state-from-render-in-llm-streaming`,
`building-with-ai-the-compound-advantage`.

Per note, pick one:

- **Upgrade** — add a public receipt (a spec, a paper, a postmortem, a CrUX figure) and one named mechanism. Use the `research` skill to find citable sources.
- **Merge** — fold two or three into one substantial note. `the-url-is-the-source-of-truth` already carries the single-leader-replication framing; `idempotency` and `sovereign-resilience` belong with it as one piece on distributed-systems reasoning applied to the front end.

Slugs are permanent (`PUBLISHING.md`): a merged note keeps one slug and the others get a
redirect or stay as short stubs pointing at the merged piece. Do not delete a published URL.

**Acceptance:** every note in `notesData` carries either ≥1 `https` source or a first-hand
label naming a specific system, number, or incident. Consider encoding this in
`content.test.ts` so it cannot regress.

#### P0.4 Attach a basis to the vault figures

`content.ts` `builderProjects` OB1 card and `static/llms.txt` §7: state the measured count
with its date, matching the pattern the `agents-re-derive-judgment` note already uses.

**Acceptance:** `disclosure-guard.test.ts` and `content.test.ts` green; no figure on any
surface lacks a basis.

### P1 — The differentiator: make the reasoning the product

#### P1.1 A `Models` surface, sourced from the exocortex

This is the item that most directly answers the brief. New route `/models` (prerendered),
plus a compact teaser section on the landing page between the writing and the work.

**Shape.** Each model is one card:

1. **The rule**, one sentence, in Zhao's voice.
2. **The mechanism** — two or three sentences on _why_ it holds. Not an example; the reason.
3. **Receipts from two domains** — one engineering, one from capital allocation or knowledge work. This is the whole point: a model that only pays off in one domain is a heuristic.
4. **Where it came from** — the source, named. Relayed models say so.
5. **Where it links** — the note or case study that argues it at length, when one exists.

**Seed set (8–10), all verified clean against `redline-enum.py`:**

| Model                                                                       | Cross-domain receipt                                                                         |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Instructions are context; enforcement needs a deterministic control         | A prompt rule vs. a CI gate :: a stated investment policy vs. a pre-committed kill criterion |
| Use the analytically correct unit, not the intuitive one                    | Capacity-aware load balancing :: risk parity                                                 |
| A check that cannot report "did not run" certifies nothing                  | Fail-open lint :: a backtest whose window cannot contain the event it claims to rule out     |
| Displacement resistance runs cognitive → relational → physical → regulatory | What agents absorb first :: which analyst work survives automation                           |
| Tool alpha cancels under symmetric adoption; the residual is the edge       | Every team gets the same model API :: every fund gets the same screener                      |
| Separate the builder from the reviewer                                      | Builder/reviewer agent split :: maker-checker in a decision process                          |
| Grade the decision, not the outcome                                         | Postmortems that survive a good quarter :: ex-ante reasoning quality                         |
| Prevented loss is invisible, and therefore under-rewarded                   | The incident that never happened :: the position not taken                                   |

**Sourcing rule (non-negotiable).** Every candidate claim runs
`python3 ops/scripts/redline-enum.py --check notes/<slug>.md` first. **Exit 0 is Tier-E and
excluded. Exit 2 is could-not-determine and also excluded.** Only exit 1 proceeds. The
vault's single highest-degree claim (54 inbound links, and a well-known cross-domain
parallel in its own right) is Tier-E purely because its body cites an employer project —
the _model_ is public and can be re-derived from public sources, but that note's prose and
its filename cannot leave the vault, which is why neither appears in this document. Vault prose is
never pasted: claims are re-written for the site through the `writer` skill, the way any
source is transformed.

**Files:** new `frontend/src/lib/constants/models.ts` + colocated `models.test.ts`; new
`frontend/src/routes/(main)/models/+page.svelte`; a `Models` feature component;
`design-system.ts` registry entry; `routes.ts`; `Navbar.svelte`; `llms.txt`; sitemap
(automatic once prerendered).

**Acceptance:** a test asserting every model has a rule, a mechanism, **receipts from ≥2
distinct domains**, and a named source; `/models` in `sitemap.xml` and `llms.txt`; the
section renders its content unconditionally (reveal is animation-only, per the design
system rule).

#### P1.2 Two or three notes that argue the new models at length

The Models page states; the notes argue. Highest-value first drafts, each a note the site
does not have and most sites cannot write:

1. **"Your instructions are not enforcement."** The general form of the fail-open essay, aimed at engineering leaders standing up agent workflows. Receipts exist: the vault's own instruction-file-vs-deterministic-control claim carries 41 inbound links and a documented failure ledger.
2. **"Tool alpha cancels. What's left is the whole job."** Why a cheaper model API confers no advantage until the savings buy something rivals cannot purchase from the same API. The clearest statement of the world we are moving towards, and it is an _economics_ argument, which is the differentiator.
3. **"Prevented loss is invisible."** Why the best engineering-management work looks like nothing happening, and what to do about it in performance review. Cross-domain by construction.

Each goes through `writer` → `writer-judge` → `PUBLISHING.md`, verdict in the PR body.

### P2 — Depth signals

#### P2.1 A tensions surface

Two or three live disagreements Zhao holds, stated as tensions and deliberately unresolved
— e.g. systematising judgment vs. preserving adaptive judgment through a regime shift;
concentration vs. diversification of attention. Either a `## Tensions` block on `/models`
or a short standalone page.

**Acceptance:** each tension states both positions in their strongest form, names why it
is not resolved, and does not conclude. A tension with a winner is an opinion, and belongs
in the models list instead.

#### P2.2 `/work` index and `/infra` in navigation

- New `frontend/src/routes/(main)/work/+page.svelte`: case-study cards + the selected-work list, so `/work/{slug}` has a parent.
- Add `/infra` to `navLinks` (or link it from the Cost-Guard card) and to the sitemap.

**Acceptance:** no route reachable only by typing the URL; `sitemap.test.ts` updated.

#### P2.3 Cadence machinery

The archive's Jul-11 batch cannot be un-dumped; the trend line is fixable. Pick a cadence
(the vault's `/weekly` Phase 7 already drafts a brief when fewer than two are in flight)
and keep a visible queue. A dated "last updated" on `/blog` helps a recruiter more than it
costs.

### P3 — Hygiene

- Résumé/CV: decide whether a PDF or a `/now` page belongs on the site. Recruiters look for one; the site currently offers neither.
- Build emits a chunk-size warning. Not urgent; worth a look before the next perf claim.
- Re-run `pnpm og` after any title or tag edit to an existing note — `og.test.ts` catches it, but only after the fact.

---

## 4. How the exocortex should feed the site

Not as a data source — as an upstream. The vault is permanently private
(`ops/publication-policy.md`); nothing is exported. The pipeline is:

```
vault claim (link-ranked)
  → redline-enum.py --check   [exit 1 only; 0 and 2 both excluded]
  → /brief stealth check      [required for any public surface, whatever drafted it]
  → writer skill              [transformation into site voice, never paste]
  → writer-judge              [independent verdict, from a context that did not draft]
  → PUBLISHING.md             [receipts, disclosure, mechanics, gates]
  → content.ts / models.ts
```

Two properties make this worth doing rather than writing from scratch:

- **The link graph ranks the material.** Inbound link count is a measured signal of which models actually load-bear across the work, not which felt good to write. That is how the P1.1 seed set was chosen.
- **Cross-domain edges are the differentiator.** 2,994 of 8,863 claim-to-claim links (34%) cross a domain boundary. Those edges are the site's rarest asset: a model with a receipt in both engineering and capital allocation is one almost no engineering portfolio can show.

The failure mode to guard against is quoting. Vault claim prose is written for an audience
of one, and the site's voice contract (`.claude/skills/writer`) is specific. Every claim
gets re-derived, not relayed.

---

## 5. Decisions — resolved 2026-09-01

Zhao answered four of the six. Recorded here so the spec is the record:

| #   | Decision       | Answer                                                                                                                                                                                                                                                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2   | Identity strip | **Add one line under the hero CTAs** — `roleLine` + location, secondary weight, sans. Craft-first body order unchanged.                                                                                                                                                                                                               |
| 3   | Thin notes     | **Merge three, upgrade two.** `the-url-is-the-source-of-truth` + `idempotency-in-distributed-systems` + `sovereign-resilience…` become one distributed-systems-reasoning note; `decoupling-state-from-render…` and `building-with-ai-the-compound-advantage` get public receipts in place. Old slugs redirect; no published URL dies. |
| 4   | Models surface | **Full `/models` page plus a landing teaser.** Prerendered page with 8–10 models; four-card teaser between the writing and the work.                                                                                                                                                                                                  |
| 5   | Résumé         | **A `/now` page.** No PDF. Fits the craft-first register, carries the currency signal, and needs no artifact kept in sync with `content.ts`.                                                                                                                                                                                          |

Still open:

1. **The four case-study blockers** (P0.1) — unchanged, and still the single highest-value unlock on the list.
2. **Tensions** (P2.1) — which two or three are publishable. Candidates are proposed in §6.3.

## 6. What is still needed from Zhao, precisely

Everything else in this spec can be built without further input. This is the complete list
of what cannot.

### 6.1 The case study — four facts (unblocks P0.1, and PR 6 behind it)

From `CASE-STUDY-DRAFT-nextgen-migration.md`. Each is one to three sentences from memory;
none of it can be inferred, and the site does not ship invented receipts.

1. **Period.** What display years does the migration cover — e.g. "2022 to 2024"? No public source pins this.
2. **Ratification.** Who made or signed off the call, in one clause? "I architected" is shipped copy; the decision section should say how the decision was _carried_ — an architecture review, a staff-plus forum, a director sign-off.
3. **Cutover mechanics.** One or two honest sentences on how zero downtime was actually achieved. Progressive traffic shifting? Route by route? Percentage ramp? What was the rollback story at the edge?
4. **Regrets, and the team boundary.** The two sections a skeptical senior reader checks first:
   - _Regrets_ — either (a) what did the edge runtime make harder than expected: local development parity, debugging at the PoP, observability into worker execution? or (b) what would you sequence differently: which surface migrated first, and was it the right first surface?
   - _Team boundary_ — which teams built the worker runtime integration, the origin API changes, and the cutover tooling? The scope rules apply: describe what was yours precisely, credit the rest explicitly.

### 6.2 One line of biography (unblocks PR 1, which is otherwise ready to start)

**Location** for the identity strip — city or metro, however you want it stated
("New York", "NYC", "New York, NY"). One string; nothing else about PR 1 is blocked.

### 6.3 Which tensions to publish (unblocks P2.1)

The vault holds 61 tension-type notes. Most are publishable in principle; a few touch
personal strategy and stay private. Rather than an open question, three candidates that
are clean, cross-domain, and genuinely unresolved:

- **Systematising judgment vs. preserving adaptive judgment.** A rule-based process removes emotional interference and, by the same mechanism, removes the judgment that adapts when the regime shifts. Engineering has the identical tension in automated remediation.
- **Concentration vs. diversification of attention.** Senior evaluation is dominated by one or two visible flagship efforts, which argues for concentration; the compounding case argues for surface area. Both are true and they do not reconcile.
- **Depth vs. adaptability as the durable edge.** Layer-below understanding is a permanent advantage because abstractions leak; relearning capacity is the hedge when the layer itself is replaced. These recommend different investments of the same hours.

Pick two or three, or name your own. The bar is that each states both positions in their
strongest form, says why it is not resolved, and does not conclude.

### 6.4 Optional, improves the work but does not block it

- **A first-hand number for the streaming note** (P0.3). Public receipts exist for the 16 ms frame budget, but a measured figure from your own profiling — dropped frames before and after, or tokens per second sustained — is a stronger receipt than a spec citation.
- **`/now` page inputs** (P3). I can draft it from active projects and the vault's reading state, but what you are actually working on and reading this month is yours to confirm before it ships.
- **Vault figure basis** (P0.4). The site says "1,700 claims" on the OB1 card and in `llms.txt` with no basis. Three defensible counts exist depending on the rule: 2,028 files, 1,760 assertion-type notes, and 8,863 claim-to-claim links (14,819 by `vault.py density`, which counts every link including navigation). **The fix is to state the counting rule alongside the number**, the way the `agents-re-derive-judgment` note already does with "measured 30 Aug 2026" — not to swap in a bigger number. Tell me which rule you want to be canonical, or I will use assertion-type notes and claim-to-claim links and say so.

## 7. Suggested sequencing

Decisions 2 to 5 are resolved, so most of this is now unblocked.

| PR  | Contents                                                          | Blocked on                             |
| --- | ----------------------------------------------------------------- | -------------------------------------- |
| 1   | P0.2 identity strip + contact link, P0.4 vault figure basis       | **§6.2 location string** (one word)    |
| 2   | P0.3 merge three notes into one, upgrade two with public receipts | — ready                                |
| 3   | P1.1 `/models` page + landing teaser + `models.test.ts`           | — ready                                |
| 4   | P1.2 first long-form note against a new model                     | PR 3                                   |
| 5   | P3 `/now` page                                                    | §6.4 inputs, confirmable at draft time |
| 6   | P0.1 case study                                                   | **§6.1 four facts**                    |
| 7   | P2.2 `/work` index, `/infra` in nav                               | PR 6                                   |
| 8   | P2.1 tensions                                                     | **§6.3 pick two or three**             |

PRs 2 and 3 can start immediately and carry the most weight against the brief. PR 1 needs
one string. PR 6 is the highest-value item on the list and is the only one that needs real
work from Zhao rather than a decision.
