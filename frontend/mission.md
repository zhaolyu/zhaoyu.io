MISSION.md: zhaoyu.io (Svelte 5 - Local-First Consumer)
🎯 High-Level Objective
Integrate the Cost-Guard Sync Stream into the zhaoyu.io Svelte portfolio. This mission builds the /infra route as a high-performance, local-first dashboard using PGlite, ElectricSQL, and Svelte Runes.

🛠 Tech Stack Directives
Framework: SvelteKit (Svelte 5 / Runes).

Local DB: @electric-sql/pglite with persistent IndexedDB.

Sync Client: @electric-sql/pglite-sync.

State Management: Svelte $state and $derived runes for reactive SQL results.

Visualization: LayerChart (D3-based for Svelte) or Pancake.

🏗 Architectural Requirements
1. Persistent PGlite Store
The agent must create a Svelte module (e.g., src/lib/db.svelte.ts) that initializes PGlite with the electricSync extension. Use the idb:// prefix to ensure data survives page refreshes.

2. Reactive SQL Subscription
Instead of React hooks, implement a Svelte Rune-based subscription. When the local PGlite table changes (via the sync engine), the Svelte $state should update automatically.

3. The "/infra" Route (SvelteKit)
Create src/routes/infra/+page.svelte. This page must be CSR (Client-Side Rendered) only for the DB portion, as PGlite/IndexedDB do not exist on the server.

Pulse Metric: Use a $derived rune to calculate total spend from the local cost_snapshots table.

Interactive Filtering: Create a sidebar that filters the local dataset. Since it's local SQL, UI updates should be sub-1ms.

Visual Feedback: Use Svelte transitions (fade, fly) to animate new cost items as they "stream" into the local DB.

📜 Coding Standards (Claude Code)
Runes Only: No legacy Svelte 4 writable stores. Use $state and $effect.

Lib Partitioning: Keep the sync logic in $lib/sync.svelte.ts and the UI in the routes.

Fail-Soft: Implement a "Sync Status" indicator. If navigator.onLine is false, explicitly show "Offline Mode - Using Local Data."

🚀 Execution Commands
npm install @electric-sql/pglite @electric-sql/pglite-sync

claude -> /plan Create a Svelte 5 reactive wrapper for PGlite and sync it to the Cost-Guard provider.