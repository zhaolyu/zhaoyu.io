import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

// Mutable stand-in for the CostDB singleton — hud only reads status/instance.
// vi.hoisted so the vi.mock factory (hoisted above imports) can reference it.
const { mockCostDB } = vi.hoisted(() => ({
  mockCostDB: { status: 'Syncing', instance: null as unknown },
}));
vi.mock('$lib/db.svelte', () => ({ costDB: mockCostDB }));

import { SystemHUD } from '$lib/hud.svelte';

function fakePg(latestCreatedAt: string | null) {
  return {
    query: vi.fn<(...args: any[]) => any>().mockImplementation(async (sql: string) => {
      if (sql.includes('MAX(created_at)')) return { rows: [{ latest: latestCreatedAt }] };
      return { rows: [] };
    }),
  };
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { value, configurable: true });
}

function setStorageEstimate(usage: number | undefined) {
  Object.defineProperty(navigator, 'storage', {
    value: { estimate: async () => ({ usage }) },
    configurable: true,
  });
}

let hud: SystemHUD;

beforeEach(() => {
  vi.useFakeTimers();
  setOnline(true);
  setStorageEstimate(2048);
  mockCostDB.status = 'Syncing';
  mockCostDB.instance = null;
  hud = new SystemHUD();
});

afterEach(() => {
  hud.stop();
  vi.useRealTimers();
});

describe('status resolution', () => {
  it('reports offline when the browser has no network', async () => {
    setOnline(false);
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(hud.status).toBe('offline');
  });

  it('reports offline when the sync engine is in an error state', async () => {
    mockCostDB.status = 'Error';
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(hud.status).toBe('offline');
  });

  it('reports initializing while the sync engine is still syncing', async () => {
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(hud.status).toBe('initializing');
  });

  it('reports live once the sync engine is live', async () => {
    mockCostDB.status = 'Live';
    mockCostDB.instance = fakePg('2026-07-01T00:00:00Z');
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(hud.status).toBe('live');
  });
});

describe('live telemetry', () => {
  beforeEach(() => {
    mockCostDB.status = 'Live';
  });

  it('records last sync time from the newest snapshot and measures local latency', async () => {
    const pg = fakePg('2026-07-01T12:34:56Z');
    mockCostDB.instance = pg;
    hud.start();
    await vi.advanceTimersByTimeAsync(0);

    expect(pg.query).toHaveBeenCalledWith('SELECT 1');
    expect(hud.lastSyncAt?.toISOString()).toBe('2026-07-01T12:34:56.000Z');
    expect(hud.latency).toBeGreaterThanOrEqual(0);
  });

  it.each([
    [512, '512 B'],
    [2048, '2.0 KB'],
    [5 * 1024 * 1024, '5.0 MB'],
  ])('formats %i bytes of storage as %s', async (usage, expected) => {
    setStorageEstimate(usage);
    mockCostDB.instance = fakePg(null);
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(hud.dbSize).toBe(expected);
  });
});

describe('polling lifecycle', () => {
  it('polls on an interval after start', async () => {
    mockCostDB.status = 'Live';
    const pg = fakePg(null);
    mockCostDB.instance = pg;

    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    const initialCalls = pg.query.mock.calls.length;

    await vi.advanceTimersByTimeAsync(10_000); // two 5s poll cycles
    expect(pg.query.mock.calls.length).toBeGreaterThan(initialCalls);
  });

  it('is idempotent: double start does not double the polling rate', async () => {
    mockCostDB.status = 'Live';
    const pg = fakePg(null);
    mockCostDB.instance = pg;

    hud.start();
    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    pg.query.mockClear();

    await vi.advanceTimersByTimeAsync(5_000);
    // one cycle = latency probe + last-sync query
    expect(pg.query.mock.calls.length).toBe(2);
  });

  it('stop halts polling entirely', async () => {
    mockCostDB.status = 'Live';
    const pg = fakePg(null);
    mockCostDB.instance = pg;

    hud.start();
    await vi.advanceTimersByTimeAsync(0);
    hud.stop();
    pg.query.mockClear();

    await vi.advanceTimersByTimeAsync(30_000);
    expect(pg.query).not.toHaveBeenCalled();
  });
});
