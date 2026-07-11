# zhaoyu.io

**Engineering Portfolio & R&D Playground.**

This repository hosts the personal site of Zhao Yu — Senior Manager, Core Web at CNBC — a player-coach engineering leader specializing in high-scale media architecture, AI-augmented engineering, and local-first systems. It serves two purposes:

- **Portfolio:** A high-performance, Edge-rendered showcase of my work.
- **R&D Sandbox:** A production implementation of the "Synthesis Strategy"—combining serverless ingestion with local-first state management.

---

## 🏗 System Architecture

This is not just a static site. It is a **Hybrid Edge Application** that bridges the gap between global CDN performance and local-first interactivity.

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
| Local Database | PGlite (WASM) | Runs a full Postgres instance in the browser for zero-latency queries. |
| Sync Protocol | ElectricSQL | WAL-based replication that handles offline state and shape subscriptions. |
| Backend | GCP Cloud Run | Scalable, containerized ingestion of infrastructure metrics (us-central1). |
| CI/CD | GitHub Actions | HMAC-signed push to ingestion API on every qualifying commit. |

---

## ⚡ Key Features

### Zero-Latency Infrastructure HUD (`/infra`)

A public-facing dashboard that tracks the real-time cost of this architecture.

- **Offline-Ready:** Works without a network connection thanks to IndexedDB persistence across sessions.
- **Live Sync:** A "Pulse" indicator visualizes WAL events arriving from ElectricSQL in real-time.
- **Local SQL Engine:** All filtering and aggregation runs as SQL directly against PGlite in the browser—no round-trips.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24+ (see `frontend/.nvmrc`)
- pnpm 10+

### Local Development

```bash
# 1. Install dependencies (including WASM binaries)
cd frontend && pnpm install

# 2. Run the development server
pnpm dev
```

The `/infra` dashboard reads from a public sync endpoint configured in [`frontend/src/lib/constants/config.ts`](frontend/src/lib/constants/config.ts) (`ELECTRIC_SYNC_URL`). The HMAC signing secret lives only in GitHub Actions secrets on the ingestion side — nothing secret ships to the client.

### Deployment

The frontend deploys to Cloudflare Pages on push to `main`. The GCP backend (ingestion + sync) runs on Cloud Run and is managed separately.

---

## 📚 Documentation

- **[Deployment Guide](docs/DEPLOYMENT_RECOMMENDATION.md)** — Cloudflare Pages setup
- **[GitHub Authentication](docs/GITHUB_AUTHENTICATION.md)** — Multi-account setup and troubleshooting
- **[Project Summary](docs/PROJECT_SUMMARY.md)** — High-level overview

For frontend-specific documentation, see [`frontend/docs/`](frontend/docs/).

---

## 📜 License

MIT © 2026 Zhao Yu.

Data visualization components and cost-ingestion pipeline logic are open-source. Please attribute if used in production.
