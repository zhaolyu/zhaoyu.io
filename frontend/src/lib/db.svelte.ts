import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite-sync';
import { browser } from '$app/environment';
import { ELECTRIC_SYNC_URL, PGLITE_DATA_DIR } from '$lib/constants/config';

export class CostDB {
	#db = $state<PGlite | null>(null);
	#isSynced = $state(false);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	async init() {
		const pg = await PGlite.create({
			dataDir: PGLITE_DATA_DIR,
			extensions: {
				electric: electricSync()
			}
		});

		const shapeUrl = `${ELECTRIC_SYNC_URL}/v1/shape`;

		await Promise.all([
			pg.electric.syncShapeToTable({
				shape: { url: shapeUrl, params: { table: 'cost_snapshots' } },
				table: 'cost_snapshots',
				primaryKey: ['id'],
				shapeKey: 'cost_snapshots'
			}),
			pg.electric.syncShapeToTable({
				shape: { url: shapeUrl, params: { table: 'cost_items' } },
				table: 'cost_items',
				primaryKey: ['id'],
				shapeKey: 'cost_items'
			})
		]);

		this.#isSynced = true;
		this.#db = pg;
	}

	get instance() {
		return this.#db;
	}

	get status() {
		return this.#isSynced ? 'Live' : 'Syncing';
	}
}

export const costDB = new CostDB();
