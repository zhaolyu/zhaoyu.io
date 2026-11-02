# zhaoyu.io

**Engineering Portfolio & R&D Playground.**

This repository hosts the personal site of Zhao Yu, Senior Manager, Engineering at Versant (CNBC Core). The site leads with the writing:

- **Notes:** engineering notes on agents, verification and reliability, each naming the incident or source it came from, and the mental models that held up across them.
- **Selected work:** decision records for the systems behind the notes, with every employer figure tied to a public source.
- **R&D sandbox (retired):** `/infra` was a production implementation of serverless ingestion feeding local-first state. It was retired in October 2026, when its GCP backend was deleted, and the route is removed.

---

## 🏗 System Architecture

> **Retired October 2026.** The Cost-Guard stack below (Cloud Run ingestion, Cloud SQL, ElectricSQL, the `/infra` client) was shut down on 2026-10-25 and removed from this repo. The site is now fully static; this section is kept as a record of how the dashboard worked.

Until then this was not just a static site. It was a **Hybrid Edge Application** that bridged the gap between global CDN performance and local-first interactivity.

### The Data Flow

1. **Ingestion (The Harvester):** Infrastructure changes trigger a GitHub Action that sends Terraform plans to a GCP Cloud Run service.
2. **Normalization:** Data is cleaned, cost-mapped, and stored in Cloud SQL (Postgres 16) with `REPLICA IDENTITY FULL`.
3. **Sync Engine:** ElectricSQL streams the Write-Ahead Log (WAL) to authenticated clients via a persistent shape subscription.
4. **Local-First Client:** The `/infra` route initializes PGlite (WASM Postgres) in the browser, hydrating a persistent IndexedDB store.
5. **Reactive UI:** Svelte 5 Runes drive the dashboard, enabling 60fps filtering and cost projections without network latency.

---

## 🛠 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | SvelteKit 2 (Svelte 5) | Runes provide fine-grained reactivity for high-frequency data updates. |
| Edge Hosting | Cloudflare Pages | Zero-cold-start delivery for static portfolio pages via global CDN. |
| Local Database (retired 2026-10) | PGlite (WASM) | Ran a full Postgres instance in the browser for zero-latency queries. |
| Sync Protocol (retired 2026-10) | ElectricSQL | WAL-based replication that handled offline state and shape subscriptions. |
| Backend (retired 2026-10) | GCP Cloud Run | Scalable, containerized ingestion of infrastructure metrics (us-central1). |
| CI/CD | GitHub Actions | Type-check, lint, test and build gates; deploys to Cloudflare Pages. Until 2026-10 it also sent an HMAC-signed push to the ingestion API. |

---

## ⚡ Key Features

### Zero-Latency Infrastructure HUD (`/infra`, retired October 2026)

A public-facing dashboard that tracked the real-time cost of this architecture, until its GCP backend was deleted on 2026-10-25.

- **Offline-Ready:** Worked without a network connection thanks to IndexedDB persistence across sessions.
- **Live Sync:** A "Pulse" indicator visualized WAL events arriving from ElectricSQL in real-time.
- **Local SQL Engine:** All filtering and aggregation ran as SQL directly against PGlite in the browser—no round-trips.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24+ (see `frontend/.nvmrc`)
- pnpm 10+

### Local Development

```bash
# 1. Install dependencies
cd frontend && pnpm install

# 2. Run the development server
pnpm dev
```

### Deployment

The frontend deploys to Cloudflare Pages on push to `main`. The GCP backend (ingestion + sync) that fed `/infra` was deleted on 2026-10-25.

---

## 📚 Documentation

- **[Frontend README](frontend/README.md)**: structure, routes, scripts, deployment
- **[CLAUDE.md](CLAUDE.md)**: coding conventions, testing rules, disclosure and scope rules
- **[PUBLISHING.md](PUBLISHING.md)**: the reviewer's checklist for content and visual changes
- **[Visual brief](.interface-design/brief.md)** and **[design system](.interface-design/system.md)**: how the site should look and where each rule lives
- **[Writer skill](.claude/skills/writer/SKILL.md)** and **[writer-judge](.claude/skills/writer-judge/SKILL.md)**: how prose is written and independently reviewed before it ships

---

## 📜 License

MIT © 2026 Zhao Yu.

Data visualization components and cost-ingestion pipeline logic are open-source. Please attribute if used in production.
