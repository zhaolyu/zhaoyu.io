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

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/       # features/ · layout/ · ui/
│   │   ├── constants/        # config.ts, content.ts, routes.ts
│   │   ├── stores/           # scroll, theme
│   │   ├── types/            # shared TypeScript types
│   │   ├── utils/            # pure utilities (tested)
│   │   ├── db.svelte.ts      # Cost-Guard PGlite + ElectricSQL sync
│   │   ├── hud.svelte.ts     # Architect HUD telemetry state
│   │   └── simulator.svelte.ts  # cost what-if simulator state
│   ├── routes/
│   │   ├── (main)/           # landing page + /blog and /blog/[slug]
│   │   ├── (standalone)/     # /ai-manifesto (own layout)
│   │   ├── infra/            # Cost-Guard dashboard (ssr = false)
│   │   └── sitemap.xml/      # prerendered sitemap endpoint
│   ├── app.html
│   └── app.css
└── static/                   # robots.txt, llms.txt, _headers, og-image
```

## Routes

- `/` — landing page (hero, metrics, career, selected work, philosophy, notes, contact)
- `/blog` — engineering notes index; individual notes at `/blog/{slug}`
- `/ai-manifesto` — working thesis on AI-augmented engineering
- `/infra` — Cost-Guard, a local-first infra cost dashboard (PGlite + ElectricSQL; noindex)
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — crawler and AI-agent surfaces

## Architecture Notes

- **Static + SPA**: every route is prerendered; `404.html` is the SPA fallback.
  There is no runtime server — the only "endpoint" (`sitemap.xml`) is generated
  at build time.
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
design principles that apply to this codebase.

## License

See the main project LICENSE file.
