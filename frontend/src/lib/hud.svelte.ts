import { browser } from '$app/environment';
import { costDB } from '$lib/db.svelte';

const POLL_INTERVAL_MS = 5000;

export class SystemHUD {
  status = $state<'initializing' | 'live' | 'offline'>('initializing');
  lastSyncAt = $state<Date | null>(null);
  dbSize = $state('0 KB');
  latency = $state(0);

  constructor() {
    if (browser) {
      this.#poll();
    }
  }

  async #poll() {
    await this.#update();
    setInterval(() => this.#update(), POLL_INTERVAL_MS);
  }

  async #update() {
    if (!navigator.onLine) {
      this.status = 'offline';
      return;
    }

    if (costDB.status === 'Error') {
      this.status = 'offline';
      return;
    }

    if (costDB.status !== 'Live') {
      this.status = 'initializing';
      return;
    }

    this.status = 'live';

    const db = costDB.instance;
    if (!db) return;

    // Measure local PGlite query latency — proves data is local, not network-bound
    const start = performance.now();
    await db.query('SELECT 1');
    this.latency = Math.round(performance.now() - start);

    // Use latest created_at as last sync timestamp
    try {
      const res = await db.query<{ latest: string }>(
        'SELECT MAX(created_at) as latest FROM cost_snapshots',
      );
      if (res.rows[0]?.latest) {
        this.lastSyncAt = new Date(res.rows[0].latest);
      }
    } catch {
      // Table may not exist yet
    }

    // Measure actual IDB storage usage
    try {
      const estimate = await navigator.storage.estimate();
      this.dbSize = SystemHUD.#formatBytes(estimate.usage ?? 0);
    } catch {
      // Storage API not available
    }
  }

  static #formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export const hud = new SystemHUD();
