# CI/CD Workflows

GitHub Actions workflows for zhaoyu.io — a fully static SvelteKit site (all code
under `frontend/`) deployed to Cloudflare Pages.

## Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI - Quality Checks and Build | `ci.yml` | Pull requests | Quality gates + preview deployment |
| Deploy to Cloudflare Pages | `cloudflare-pages.yml` | Push to `main`, manual | Production deployment |
| Cost Guard - Report Infrastructure Costs | `cost-guard.yml` | Manual only | Cost snapshot ingestion for `/infra` |

```
Pull request opened / updated
        │
        ▼
┌──────────────────────────────────────────────┐
│  ci.yml                                      │
│  type-check ─┐                               │
│  lint        ├─ parallel (~2-3 min)          │
│  test        │                               │
│  build      ─┘                               │
│        │                                     │
│        ▼ (build passed)                      │
│  deploy → Cloudflare Pages preview           │
│         → sticky PR comment with URL         │
│        │                                     │
│        ▼                                     │
│  ci-success (summary gate)                   │
└──────────────────────────────────────────────┘

Merge to main (push)
        │
        ▼
┌──────────────────────────────────────────────┐
│  cloudflare-pages.yml                        │
│  check → lint → test → build → verify        │
│        → Cloudflare Pages production         │
│          (https://zhaoyu.io)                 │
└──────────────────────────────────────────────┘
```

## ci.yml — CI Quality Checks and Build

**Triggers:** `pull_request` (`opened`, `reopened`, `synchronize`) targeting any
branch. There is no push trigger — CI runs on PRs only.

**Skipped when:**

- The PR is a draft (every job checks `github.event.pull_request.draft == false`).
- The change touches only docs/config no-ops: `**.md`, `docs/**`, `.gitignore`,
  `.prettierrc`, `LICENSE` (via `paths-ignore`).

`.github/**` is deliberately **not** in the ignore list: workflow edits used to be
skipped as "config", which meant changes to CI itself merged with zero checks.
Don't re-add it.

**Concurrency:** one run per ref (`ci-${{ github.ref }}`); a new commit cancels
the in-progress run.

**Jobs:**

1. **type-check / lint / test / build** — run in parallel (~2-3 min total instead
   of ~4-5 sequential). Each job checks out, installs with pnpm
   (`--frozen-lockfile`), runs `pnpm run sync` where SvelteKit's generated files
   are needed (all except lint), then its check. `build` also verifies the output
   (`build/index.html` exists) and prints size/file-count stats.
2. **deploy** — needs `build`. Rebuilds from scratch (see
   [Design decisions](#design-decisions)), then:
   - Deploys a **preview** via `cloudflare/wrangler-action` v4:
     `pages deploy frontend/build --project-name=zhaoyu-io --branch=<PR head branch>`
   - Creates a GitHub deployment record (the "View deployment" button on the PR).
   - Posts a **sticky PR comment** with the preview URL — the branch-alias URL
     when available, otherwise the atomic deployment URL. The comment is updated
     in place on subsequent pushes, not duplicated.
3. **ci-success** — summary gate that `needs` all of the above. Fails on any
   `failure`, passes on `success`/`skipped` (so draft PRs and docs-only changes
   don't block). Use this as the required status check.

## cloudflare-pages.yml — Production Deploy

**Triggers:**

- `push` to `main` (i.e., PR merges) → production deploy to
  [zhaoyu.io](https://zhaoyu.io).
- `workflow_dispatch` → manual deploy of any ref. Useful when a merge skipped CI
  (docs-only changes) or a deploy needs re-running. Dispatching from a non-`main`
  ref deploys a preview, not production.

**Concurrency:** one deploy per branch (`deploy-<branch>`); a newer push cancels
the in-progress deploy.

**Steps:** checkout → pnpm install → `pnpm run sync` → **type-check → lint →
test** → build → verify output → deploy via `wrangler-action` v4 → record a
GitHub deployment (`production` environment for `main`, `preview` otherwise).

The quality gates are re-run here on purpose, even though `ci.yml` exists: this
workflow fires on any push to `main`, and a direct push (bypassing the PR flow)
would otherwise reach production having passed nothing. See
[Design decisions](#design-decisions).

## cost-guard.yml — Cost Snapshot Ingestion

**Trigger:** `workflow_dispatch` only, with a required `total_monthly_estimate`
input (USD).

Sends an HMAC-SHA256-signed (`X-Hub-Signature-256`) JSON snapshot — org id,
project id, commit hash, the supplied estimate, empty `costs` array — to the
Cost-Guard ingestion API on Cloud Run, which feeds the site's `/infra`
dashboard.

It is manual-only because this repo has no Terraform, so there is no real cost
data to compute in CI. It previously ran on every push and sent a hardcoded $0
snapshot per commit, which flooded the `/infra` dashboard with empty "Estimate"
rows. Trigger it manually with a real estimate to exercise the ingestion
pipeline end to end.

## Shared conventions

- **Toolchain:** Node `24.13.0`, pnpm via `pnpm/action-setup` (version read from
  `frontend/package.json`), pnpm store cached against `frontend/pnpm-lock.yaml`.
- **Working directory:** every project command runs in `frontend/`.
- **SvelteKit sync:** `pnpm run sync` runs before check/test/build — type
  checking and builds fail without the generated files.
- **Action pinning:** every action is pinned to a commit SHA (with a version
  comment); Dependabot keeps the pins updated. Keep it that way.
- **Least privilege:** jobs default to `permissions: contents: read`; deploy
  jobs add only `deployments: write` (and `pull-requests: write` in `ci.yml`
  for the preview comment).
- **Timeouts** on every job (1-15 min) so hung runs can't burn minutes.

## Secrets

| Secret | Used by | Purpose |
|--------|---------|---------|
| `CLOUDFLARE_API_TOKEN` | `ci.yml`, `cloudflare-pages.yml` | Pages deploy (needs Pages edit permission) |
| `CLOUDFLARE_ACCOUNT_ID` | `ci.yml`, `cloudflare-pages.yml` | Target Cloudflare account |
| `COST_GUARD_SECRET` | `cost-guard.yml` | HMAC signing key for ingestion requests |

The site is fully static — anything in `frontend/src/` or `frontend/static/`
ships to the client, so secrets exist only here, in Actions.

## Design decisions

Three of these were learned the hard way; the workflow comments record them too.

1. **CI must run on workflow changes.** `paths-ignore` once contained
   `.github/**`, so edits to the workflows themselves got zero checks before
   merging. The ignore list now covers only true no-ops. A CI skip-list must
   never include the CI configuration itself.
2. **Every path to production carries its own gates.** PR checks protect only
   the PR path; `cloudflare-pages.yml` re-runs check/lint/test because a direct
   push to `main` deploys too. The duplicated ~2 minutes is the price of the
   deploy path being self-sufficient rather than trusting that everything goes
   through a PR.
3. **No automated placeholder telemetry.** Cost-Guard went from per-push
   (hardcoded $0 snapshots that buried real data) to manual-only with a required
   real estimate.
4. **No artifact passing between jobs.** The deploy jobs rebuild rather than
   download the CI build artifact. Duplicate build work is accepted in exchange
   for simpler workflows and no cross-job artifact permission issues; builds are
   fast enough for this to be cheap.
5. **`wrangler-action` v4** replaced the deprecated `cloudflare/pages-action@v1`.
   It exposes `deployment-url` (atomic) and `pages-deployment-alias-url` (branch
   alias) outputs, which the preview comment uses.

## Running things manually

- **Re-deploy production:** Actions → *Deploy to Cloudflare Pages* → Run
  workflow → branch `main`. Do this after merging a docs-only PR if the change
  should ship (CI skips `**.md`, and merges of skipped PRs still trigger the
  push deploy — manual dispatch is for edge cases like re-runs).
- **Send a cost snapshot:** Actions → *Cost Guard - Report Infrastructure
  Costs* → Run workflow → enter a real monthly estimate.

## Troubleshooting

**A quality gate fails** — reproduce locally from `frontend/`:
`pnpm check`, `pnpm lint` (or `pnpm lint:fix`), `pnpm test`, `pnpm build`.

**Preview URL shows "Nothing is here yet"** — deployments take 1-2 minutes to
propagate. Then check the Cloudflare Pages dashboard → Deployments tab for the
deployment's actual status.

**Cloudflare deploy fails** — verify the `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` secrets, and that the Pages project is named
`zhaoyu-io`. Details in the wrangler step logs and the Cloudflare dashboard.

**Preview comment missing** — the deploy job only comments after a successful
deploy and URL extraction; check the "Extract deployment URLs" step logs.

## Cloudflare Pages configuration

Dashboard settings that make branch previews work: production branch `main`,
preview deployments allowed for all non-production branches, and (optionally) a
public access policy for previews. Full walkthrough:
[CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md).
