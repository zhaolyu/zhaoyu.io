import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite-sync';
import { browser } from '$app/environment';
import { ELECTRIC_SYNC_URL, PGLITE_DATA_DIR } from '$lib/constants/config';

export class CostDB {
  #db = $state<PGlite | null>(null);
  #isSynced = $state(false);
  #error = $state<string | null>(null);
  #retried = false;
  #started = false;

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
    try {
      const pg = await PGlite.create({
        dataDir: PGLITE_DATA_DIR,
        extensions: {
          electric: electricSync(),
        },
      });

      // TODO(security): resource_name and metadata may contain sensitive infra
      // identifiers (bucket names, instance IDs, region config). The harvester
      // (Cloud Run, outside this repo) should strip or redact these fields
      // before they reach Electric. Until then, raw values are synced into the
      // browser's IndexedDB and are visible via DevTools.
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
					resource_name TEXT NOT NULL,
					monthly_cost NUMERIC NOT NULL DEFAULT 0,
					change_type TEXT NOT NULL,
					metadata JSONB
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
              params: { table: 'cost_items' },
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
        indexedDB.deleteDatabase(db.name);
      }
    }
    return this.init();
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
