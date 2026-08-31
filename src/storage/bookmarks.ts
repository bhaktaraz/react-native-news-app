import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article, Author } from "../api/types";

const KEY = "@dk/bookmarks";

/** Only the fields a saved-article card renders are kept, to bound storage growth. */
export interface Bookmark {
  id: number;
  title: string;
  image: string;
  intro: string;
  url: string;
  author?: Author | string;
  date_np?: string;
  created_on: string;
  savedAt: number;
}

export const toBookmark = (article: Article): Bookmark => ({
  id: article.id,
  title: article.title,
  image: article.image,
  intro: article.intro,
  url: article.url,
  author: article.author,
  date_np: article.date_np,
  created_on: article.created_on,
  savedAt: Date.now(),
});

export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persist(bookmarks: Bookmark[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(bookmarks));
  } catch {
    // Best-effort: the in-memory list stays correct for this session.
  }
}

export async function isBookmarked(id: number): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some((bookmark) => bookmark.id === id);
}

/** Adds or removes the article and returns the saved state after the change. */
export async function toggleBookmark(article: Article): Promise<boolean> {
  const bookmarks = await getBookmarks();
  const existing = bookmarks.findIndex((bookmark) => bookmark.id === article.id);

  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    await persist(bookmarks);
    return false;
  }

  bookmarks.unshift(toBookmark(article));
  await persist(bookmarks);
  return true;
}

export async function removeBookmark(id: number): Promise<Bookmark[]> {
  const bookmarks = await getBookmarks();
  const next = bookmarks.filter((bookmark) => bookmark.id !== id);
  await persist(next);
  return next;
}
