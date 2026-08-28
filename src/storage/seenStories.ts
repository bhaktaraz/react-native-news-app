import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Which stories the reader has already opened, so the rail can dim their ring
 * the way the web rail does.
 *
 * The key carries the date because a story set only lives for one day: a new
 * day's rail should start entirely unseen, and yesterday's entry becomes dead
 * weight we can drop on sight rather than having to prune on a schedule.
 */
const keyFor = (date: Date) => `@dk/seen-stories/${date.toISOString().slice(0, 10)}`;

export async function readSeenStories(): Promise<Set<number>> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(new Date()));
    if (!raw) {
      return new Set();
    }

    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? new Set(ids.filter((id) => typeof id === "number")) : new Set();
  } catch {
    // An unreadable set only costs the reader a dimmed ring, so treat it as empty.
    return new Set();
  }
}

export async function markStorySeen(newsId: number): Promise<void> {
  try {
    const key = keyFor(new Date());
    const seen = await readSeenStories();
    if (seen.has(newsId)) {
      return;
    }

    seen.add(newsId);
    await AsyncStorage.setItem(key, JSON.stringify([...seen]));
  } catch {
    // Best-effort: failing to record a view must never block opening a story.
  }
}

/** Drops every seen-set except today's, which the key scheme makes cheap. */
export async function pruneSeenStories(): Promise<void> {
  try {
    const today = keyFor(new Date());
    const keys = await AsyncStorage.getAllKeys();
    const stale = keys.filter((key) => key.startsWith("@dk/seen-stories/") && key !== today);
    if (stale.length) {
      await AsyncStorage.multiRemove(stale);
    }
  } catch {
    // Nothing actionable -- pruning is housekeeping, not correctness.
  }
}
