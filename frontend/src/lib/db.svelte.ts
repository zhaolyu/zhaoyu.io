import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite-sync';
import { browser } from '$app/environment';
import { ELECTRIC_API_SECRET, ELECTRIC_SYNC_URL, PGLITE_DATA_DIR } from '$lib/constants/config';

export class CostDB {
  #db = $state<PGlite | null>(null);
  #isSynced = $state(false);
  #error = $state<string | null>(null);
  #retried = false;

  constructor() {
    if (browser) {
      this.init();
    }
  }

  async init(): Promise<void> {
    try {
      const pg = await PGlite.create({
        dataDir: PGLITE_DATA_DIR,
        extensions: {
          electric: electricSync(),
        },
      });

      await pg.exec(`
				CREATE TABLE IF NOT EXISTS cost_snapshots (
					id TEXT PRIMARY KEY,
					org_id TEXT NOT NULL,
					project_id TEXT NOT NULL,
					commit_hash TEXT,
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

      const shapeUrl = `${ELECTRIC_SYNC_URL}/v1/shape`;

      // Set db immediately so components can render loading state
      this.#db = pg;

      await pg.electric.syncShapesToTables({
        key: 'cost-guard',
        shapes: {
          cost_snapshots: {
            shape: {
              url: shapeUrl,
              params: { table: 'cost_snapshots', secret: ELECTRIC_API_SECRET },
            },
            table: 'cost_snapshots',
            primaryKey: ['id'],
          },
          cost_items: {
            shape: {
              url: shapeUrl,
              params: { table: 'cost_items', secret: ELECTRIC_API_SECRET },
            },
            table: 'cost_items',
            primaryKey: ['id'],
          },
        },
        onInitialSync: () => {
          this.#isSynced = true;
        },
        onError: (err) => {
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
        const dbs = await indexedDB.databases();
        for (const db of dbs) {
          if (db.name?.startsWith('zhaoyu-cost-guard')) {
            indexedDB.deleteDatabase(db.name);
          }
        }
        return this.init();
      }

      this.#error = msg;
    }
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
