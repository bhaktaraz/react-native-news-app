import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@dk/cache/";

interface CacheEnvelope<T> {
  savedAt: number;
  value: T;
}

export interface CachedRead<T> {
  value: T;
  savedAt: number;
  stale: boolean;
}

/** Cached responses older than this are still served, but flagged as stale. */
const DEFAULT_MAX_AGE_MS = 15 * 60 * 1000;

export async function writeCache<T>(key: string, value: T): Promise<void> {
  const envelope: CacheEnvelope<T> = { savedAt: Date.now(), value };
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(envelope));
  } catch {
    // A full or unavailable store must never break a screen that already has data.
  }
}

export async function readCache<T>(
  key: string,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS
): Promise<CachedRead<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) {
      return null;
    }

    const envelope = JSON.parse(raw) as CacheEnvelope<T>;
    if (!envelope || typeof envelope.savedAt !== "number") {
      return null;
    }

    return {
      value: envelope.value,
      savedAt: envelope.savedAt,
      stale: Date.now() - envelope.savedAt > maxAgeMs,
    };
  } catch {
    return null;
  }
}

export async function clearCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((key) => key.startsWith(PREFIX));
    if (ours.length) {
      await AsyncStorage.multiRemove(ours);
    }
  } catch {
    // Nothing actionable -- clearing the cache is always best-effort.
  }
}
