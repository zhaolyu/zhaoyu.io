# zhaoyu.io — SvelteKit Frontend

Personal portfolio site built with SvelteKit 2 + Svelte 5, fully static
(`adapter-static`, prerender + SPA fallback), deployed to Cloudflare Pages.

## Quick Start

Prerequisites: Node.js 24.13.0 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev       # dev server at http://localhost:5173
pnpm build     # production build → build/
pnpm preview   # preview the production build
```

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — svelte-kit sync + svelte-check (type checking)
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` — Prettier
- `pnpm test` / `pnpm test:watch` — Vitest
- `pnpm tokens` — regenerate `static/tokens.css` from `app.css` (also runs before every build)
- `pnpm og` — regenerate OG cards after a build (note titles/tags, hero tagline)
- `pnpm design-system` — after a build, write the `/design-system` preview bundle for the Claude Design hand-off

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/       # features/ · layout/ · ui/
│   │   ├── constants/        # content.ts (all copy), config.ts, design-tokens.ts, design-system.ts, og.ts, models.ts …
│   │   ├── stores/           # scroll, theme
│   │   ├── types/            # shared TypeScript types
│   │   ├── utils/            # pure utilities (tested)
│   │   ├── db.svelte.ts      # Cost-Guard PGlite + ElectricSQL sync
│   │   ├── hud.svelte.ts     # Architect HUD telemetry state
│   │   └── simulator.svelte.ts  # cost what-if simulator state
│   ├── routes/
│   │   ├── (main)/           # landing page, /blog, /blog/[slug], /work/[slug], /models
│   │   ├── (standalone)/     # /ai-manifesto (own layout)
│   │   ├── infra/            # Cost-Guard dashboard (ssr = false)
│   │   ├── design-system/    # one preview page per registered card
│   │   ├── og/               # OG card pages + cards.json, rendered by `pnpm og`
│   │   ├── rss.xml/          # prerendered feed endpoint
│   │   └── sitemap.xml/      # prerendered sitemap endpoint
│   ├── app.html
│   └── app.css
└── static/                   # robots.txt, llms.txt, _headers, _redirects, og/ cards, og-image.png, tokens.css (generated)
```

## Routes

- `/` — landing page, in order: hero (thesis, then a quiet identity line), notes, models, code standards, selected work, about + career timeline, receipts (sourced numbers), contact
- `/blog` — engineering notes index; individual notes at `/blog/{slug}`
- `/models` — mental models, each with receipts from two domains
- `/work/{slug}` — long-form case studies (decision records)
- `/ai-manifesto` — working thesis on AI-augmented engineering
- `/design-system/{card}` — component and token previews rendered from the real components
- `/infra` — Cost-Guard, a local-first infra cost dashboard (PGlite + ElectricSQL; noindex)
- `/sitemap.xml`, `/rss.xml`, `/robots.txt`, `/llms.txt` — crawler, feed and AI-agent surfaces

## Architecture Notes

- **Static + SPA**: every route is prerendered; `404.html` is the SPA fallback.
  There is no runtime server: the `+server.ts` endpoints (`sitemap.xml`,
  `rss.xml`, `og/cards.json`) are generated at build time.
- **Content lives in `src/lib/constants/content.ts`** — projects, notes, career
  history, and copy are typed data consumed by the components.
- **Cost-Guard** boots an in-browser Postgres (PGlite/WASM) and syncs cost
  snapshots from an ElectricSQL endpoint on Cloud Run (managed outside this repo).
- **Security**: CSP is generated in `svelte.config.js` (hash mode); other
  headers ship via `static/_headers`.

## Deployment

GitHub Actions deploys to Cloudflare Pages: pull requests get a preview
deployment (`.github/workflows/ci.yml`), and pushes to `main` deploy
production after type-check, lint, test, and build gates
(`.github/workflows/cloudflare-pages.yml`).

## Conventions

See [`CLAUDE.md`](../CLAUDE.md) for coding conventions, testing rules, and
design principles that apply to this codebase, and
[`.interface-design/system.md`](../.interface-design/system.md) for the design
system (tokens, typography roles, layout rules).

## License

See the main project LICENSE file.
