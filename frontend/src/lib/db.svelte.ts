import type { PGlite } from '@electric-sql/pglite';
import { browser } from '$app/environment';
import { ELECTRIC_SYNC_URL, PGLITE_DATA_DIR } from '$lib/constants/config';

export class CostDB {
  #db = $state<PGlite | null>(null);
  #isSynced = $state(false);
  #error = $state<string | null>(null);
  #retried = false;
  #started = false;
  #cleanedStale = false;

  /**
   * Kick off PGlite initialization. Safe to call multiple times — only the
   * first call has any effect. Callers should invoke this from onMount / $effect
   * so the page skeleton renders before the ~3 MB WASM blob downloads.
   */
  start(): void {
    if (this.#started || !browser) return;
    this.#started = true;
    this.init();
  }

  async init(): Promise<void> {
    await this.#dropStaleLocalDbs();
    try {
      // Loaded on demand: the ~16 MB WASM runtime must not be part of the
      // route's static import graph, so /infra can prerender its <head>
      // (title, description, noindex) and the shell paints before the
      // database downloads. Only the type is imported statically.
      const [{ PGlite }, { electricSync }] = await Promise.all([
        import('@electric-sql/pglite'),
        import('@electric-sql/pglite-sync'),
      ]);
      const pg = await PGlite.create({
        dataDir: PGLITE_DATA_DIR,
        extensions: {
          electric: electricSync(),
        },
      });

      // Security: resource_name and metadata may contain sensitive infra
      // identifiers (bucket names, instance IDs, region config), so the
      // cost_items shape below requests only the columns the UI consumes and
      // those fields never reach the browser. Server-side redaction in the
      // harvester (Cloud Run, outside this repo) is still worthwhile as
      // defense in depth.
      await pg.exec(`
				CREATE TABLE IF NOT EXISTS cost_snapshots (
					id TEXT PRIMARY KEY,
					org_id TEXT NOT NULL,
					project_id TEXT NOT NULL,
					commit_hash TEXT,
					source TEXT,
					total_monthly_estimate NUMERIC NOT NULL DEFAULT 0,
					created_at TEXT NOT NULL
				);
				CREATE TABLE IF NOT EXISTS cost_items (
					id TEXT PRIMARY KEY,
					snapshot_id TEXT NOT NULL,
					resource_type TEXT NOT NULL,
					monthly_cost NUMERIC NOT NULL DEFAULT 0,
					change_type TEXT NOT NULL
				);
			`);

      const shapeUrl = `${ELECTRIC_SYNC_URL}/electric/v1/shape`;

      // Set db immediately so components can render loading state
      this.#db = pg;

      await pg.electric.syncShapesToTables({
        key: 'cost-guard',
        shapes: {
          cost_snapshots: {
            shape: {
              url: shapeUrl,
              params: { table: 'cost_snapshots' },
            },
            table: 'cost_snapshots',
            primaryKey: ['id'],
          },
          cost_items: {
            shape: {
              url: shapeUrl,
              params: {
                table: 'cost_items',
                // Only the columns the UI consumes — keeps sensitive resource
                // identifiers out of the browser entirely.
                columns: ['id', 'snapshot_id', 'resource_type', 'monthly_cost', 'change_type'],
              },
            },
            table: 'cost_items',
            primaryKey: ['id'],
          },
        },
        onInitialSync: () => {
          this.#isSynced = true;
        },
        onError: (err) => {
          // Stale shape handle (409) — wipe IDB and retry once
          if (err.message.includes('409') && !this.#retried) {
            this.#retried = true;
            pg.close().then(() => this.#wipeAndRetry());
            return;
          }
          this.#error = err.message;
        },
      });

      // If onInitialSync already fired, we're done. Otherwise check for
      // data persisted in IDB from a prior session (onInitialSync won't
      // fire again for cached data).
      if (!this.#isSynced) {
        const check = await pg.query<{ cnt: string }>('SELECT count(*) as cnt FROM cost_snapshots');
        if (Number(check.rows[0].cnt) > 0) {
          this.#isSynced = true;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      // Corrupted IDB — wipe and retry once
      if (msg.includes('Invalid FS bundle size') && !this.#retried) {
        this.#retried = true;
        return this.#wipeAndRetry();
      }

      this.#error = msg;
    }
  }

  async #wipeAndRetry(): Promise<void> {
    this.#db = null;
    this.#isSynced = false;
    this.#error = null;
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name?.startsWith('zhaoyu-cost-guard')) {
        await this.#deleteIdb(db.name);
      }
    }
    return this.init();
  }

  /**
   * One-time, best-effort purge of local databases from older schema versions
   * (identified by a cost-guard name that doesn't match the current data dir),
   * so columns synced before the shape was narrowed don't linger in the
   * visitor's IndexedDB. Must never block init.
   */
  async #dropStaleLocalDbs(): Promise<void> {
    if (this.#cleanedStale) return;
    this.#cleanedStale = true;
    try {
      if (typeof indexedDB === 'undefined' || typeof indexedDB.databases !== 'function') return;
      const current = PGLITE_DATA_DIR.replace('idb://', '');
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name && db.name.includes('zhaoyu-cost-guard') && !db.name.includes(current)) {
          await this.#deleteIdb(db.name);
        }
      }
    } catch {
      // Cleanup is opportunistic — a failure here must not surface as an error.
    }
  }

  /** Delete one IndexedDB database, awaiting completion — firing deleteDatabase
   * without waiting can leave the deletion blocked against the connection
   * init() opens next. */
  #deleteIdb(name: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  }

  get instance() {
    return this.#db;
  }

  get status(): 'Live' | 'Syncing' | 'Error' {
    if (this.#error) return 'Error';
    return this.#isSynced ? 'Live' : 'Syncing';
  }

  get error() {
    return this.#error;
  }
}

export const costDB = new CostDB();
