import { Article } from './types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export function getCachedData<T>(key: string, maxAgeMs: number = 5 * 60 * 1000): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > maxAgeMs) {
    return null; // Stale
  }

  return entry.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now()
  });
}
