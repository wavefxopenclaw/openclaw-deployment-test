import { getOpenClawSnapshot } from './openclaw.js';

const TTL_MS = Number(process.env.DASHBOARD_CACHE_TTL_MS || 15000);

let cache = {
  data: null,
  loadedAt: 0,
  pending: null,
  lastError: null,
};

async function refreshSnapshot() {
  if (cache.pending) return cache.pending;

  cache.pending = (async () => {
    try {
      const data = await getOpenClawSnapshot();
      cache = {
        data,
        loadedAt: Date.now(),
        pending: null,
        lastError: null,
      };
      return data;
    } catch (error) {
      cache = {
        ...cache,
        pending: null,
        lastError: error,
      };
      throw error;
    }
  })();

  return cache.pending;
}

export async function getCachedSnapshot({ allowStale = true } = {}) {
  const fresh = cache.data && Date.now() - cache.loadedAt < TTL_MS;
  if (fresh) return cache.data;

  if (cache.data && allowStale) {
    refreshSnapshot().catch(() => {});
    return {
      ...cache.data,
      stale: true,
      staleAgeMs: Date.now() - cache.loadedAt,
    };
  }

  return refreshSnapshot();
}

export async function warmSnapshot() {
  try {
    await refreshSnapshot();
  } catch {
    // ignore startup warm failure
  }
}

export function getCacheState() {
  return {
    loadedAt: cache.loadedAt,
    hasData: Boolean(cache.data),
    pending: Boolean(cache.pending),
    lastError: cache.lastError ? cache.lastError.message : null,
  };
}
