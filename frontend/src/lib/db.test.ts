import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn<(...args: any[]) => any>(),
}));

vi.mock('@electric-sql/pglite', () => ({ PGlite: { create: createMock } }));
vi.mock('@electric-sql/pglite-sync', () => ({ electricSync: vi.fn(() => ({})) }));

import { CostDB } from '$lib/db.svelte';

interface SyncOptions {
  onInitialSync?: () => void;
  onError?: (err: Error) => void;
}

/** Fake PGlite instance whose sync call captures the options for the test to drive. */
function fakePg(opts: { countRows?: number } = {}) {
  const captured: { sync?: SyncOptions } = {};
  const pg = {
    exec: vi.fn<(...args: any[]) => any>().mockResolvedValue(undefined),
    close: vi.fn<(...args: any[]) => any>().mockResolvedValue(undefined),
    query: vi
      .fn<(...args: any[]) => any>()
      .mockResolvedValue({ rows: [{ cnt: String(opts.countRows ?? 0) }] }),
    electric: {
      syncShapesToTables: vi.fn<(...args: any[]) => any>().mockImplementation(async (options) => {
        captured.sync = options;
      }),
    },
  };
  return { pg, captured };
}

function stubIndexedDB(deleted: string[]) {
  vi.stubGlobal('indexedDB', {
    databases: async () => [{ name: 'zhaoyu-cost-guard' }, { name: 'unrelated-db' }],
    deleteDatabase: (name: string) => {
      deleted.push(name);
      const req: { onsuccess?: () => void; onerror?: () => void; onblocked?: () => void } = {};
      queueMicrotask(() => req.onsuccess?.());
      return req;
    },
  });
}

async function settle() {
  // flush the promise chains inside init/wipeAndRetry
  for (let i = 0; i < 10; i++) await Promise.resolve();
}

beforeEach(() => {
  createMock.mockReset();
  vi.unstubAllGlobals();
});

describe('start', () => {
  it('initializes once — repeated calls are no-ops', async () => {
    const { pg } = fakePg();
    createMock.mockResolvedValue(pg);

    const db = new CostDB();
    db.start();
    db.start();
    await settle();

    expect(createMock).toHaveBeenCalledTimes(1);
    // $state wraps the instance in a reactive proxy, so compare structurally
    expect(db.instance).toEqual(pg);
  });
});

describe('sync status', () => {
  it('reports Syncing until the initial sync completes, then Live', async () => {
    const { pg, captured } = fakePg();
    createMock.mockResolvedValue(pg);

    const db = new CostDB();
    db.start();
    await settle();

    expect(db.status).toBe('Syncing');
    captured.sync?.onInitialSync?.();
    expect(db.status).toBe('Live');
  });

  it('goes Live from cached IDB data when onInitialSync will not re-fire', async () => {
    const { pg } = fakePg({ countRows: 3 });
    createMock.mockResolvedValue(pg);

    const db = new CostDB();
    db.start();
    await settle();

    expect(db.status).toBe('Live');
  });

  it('reports Error with the message when sync fails with a non-retryable error', async () => {
    const { pg, captured } = fakePg();
    createMock.mockResolvedValue(pg);

    const db = new CostDB();
    db.start();
    await settle();

    captured.sync?.onError?.(new Error('shape fetch failed: 500'));
    expect(db.status).toBe('Error');
    expect(db.error).toContain('500');
  });
});

describe('recovery paths', () => {
  it('wipes only cost-guard IDB databases and re-initializes on a stale-shape 409', async () => {
    const deleted: string[] = [];
    stubIndexedDB(deleted);

    const first = fakePg();
    const second = fakePg({ countRows: 1 });
    createMock.mockResolvedValueOnce(first.pg).mockResolvedValueOnce(second.pg);

    const db = new CostDB();
    db.start();
    await settle();

    first.captured.sync?.onError?.(new Error('snapshot returned 409 conflict'));
    await vi.waitFor(() => expect(createMock).toHaveBeenCalledTimes(2));
    await settle();

    expect(first.pg.close).toHaveBeenCalled();
    expect(deleted).toEqual(['zhaoyu-cost-guard']); // unrelated-db untouched
    expect(db.status).toBe('Live'); // recovered via the second instance
  });

  it('retries the 409 wipe only once — a second 409 becomes a hard error', async () => {
    const deleted: string[] = [];
    stubIndexedDB(deleted);

    const first = fakePg();
    const second = fakePg();
    createMock.mockResolvedValueOnce(first.pg).mockResolvedValueOnce(second.pg);

    const db = new CostDB();
    db.start();
    await settle();

    first.captured.sync?.onError?.(new Error('409'));
    await vi.waitFor(() => expect(createMock).toHaveBeenCalledTimes(2));
    await settle();

    second.captured.sync?.onError?.(new Error('409'));
    expect(db.status).toBe('Error');
  });

  it('wipes and retries once when the IDB bundle is corrupted', async () => {
    const deleted: string[] = [];
    stubIndexedDB(deleted);

    const second = fakePg({ countRows: 2 });
    createMock
      .mockRejectedValueOnce(new Error('Invalid FS bundle size: 12 !== 34'))
      .mockResolvedValueOnce(second.pg);

    const db = new CostDB();
    db.start();
    await vi.waitFor(() => expect(createMock).toHaveBeenCalledTimes(2));
    await settle();

    expect(deleted).toEqual(['zhaoyu-cost-guard']);
    expect(db.status).toBe('Live');
  });

  it('surfaces unrecognized init failures as errors without retrying', async () => {
    createMock.mockRejectedValueOnce(new Error('WASM instantiation failed'));

    const db = new CostDB();
    db.start();
    await settle();

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(db.status).toBe('Error');
    expect(db.error).toContain('WASM');
  });
});
