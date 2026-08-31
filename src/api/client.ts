import { readCache, writeCache } from "../storage/cache";
import {
  ApiError,
  Article,
  Category,
  ContactInfo,
  Edition,
  HomePayload,
  NewsQuery,
  Page,
  Story,
  Tag,
} from "./types";

export * from "./types";

const API_BASE_URL = "https://www.dhangadhikhabar.com/api/";
const REQUEST_TIMEOUT_MS = 15000;

export const DEFAULT_PER_PAGE = 15;

const buildUrl = (path: string, params: Record<string, string | number | undefined> = {}) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return API_BASE_URL + path + (query ? `?${query}` : "");
};

async function request<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new ApiError(
        `Request failed with status ${response.status}`,
        false,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // fetch rejects for both a dropped connection and our abort; both mean the
    // device could not reach the server, which screens present as "offline".
    throw new ApiError((error as Error)?.message ?? "Network request failed", true);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Serves the cached copy when the network fails, so a cold start on a bad
 * connection still shows the last known content instead of an error screen.
 */
async function requestWithCache<T>(url: string, cacheKey: string): Promise<T> {
  try {
    const fresh = await request<T>(url);
    writeCache(cacheKey, fresh);
    return fresh;
  } catch (error) {
    const cached = await readCache<T>(cacheKey, Number.MAX_SAFE_INTEGER);
    if (cached) {
      return cached.value;
    }
    throw error;
  }
}

interface ListResponse {
  data: Article[];
  page?: number;
  has_more?: boolean;
  total_pages?: number;
  total_results?: number;
}

const toPage = (response: ListResponse, requestedPage: number): Page<Article> => {
  const totalPages = response.total_pages ?? 0;
  return {
    items: response.data ?? [],
    page: response.page ?? requestedPage,
    // Older API builds predate has_more; fall back to comparing against total_pages.
    hasMore: response.has_more ?? requestedPage < totalPages,
    totalResults: response.total_results ?? (response.data?.length ?? 0),
  };
};

export async function getNewsPage(query: NewsQuery = {}): Promise<Page<Article>> {
  const page = query.page ?? 1;
  const url = buildUrl("news", {
    page,
    per_page: query.perPage ?? DEFAULT_PER_PAGE,
    category: query.category,
    tag: query.tag,
    author: query.author,
    q: query.q,
    breaking: query.breaking ? 1 : undefined,
    featured: query.featured ? 1 : undefined,
  });

  // Only the first page of an unfiltered feed is worth caching for offline use.
  const cacheable = page === 1 && !query.q;
  const response = cacheable
    ? await requestWithCache<ListResponse>(url, `news:${url}`)
    : await request<ListResponse>(url);

  return toPage(response, page);
}

export async function getHome(sectionIds: number[] = []): Promise<HomePayload> {
  const url = buildUrl("home", {
    sections: sectionIds.length ? sectionIds.join(",") : undefined,
  });

  try {
    const response = await requestWithCache<{ data: HomePayload }>(url, "home");
    const data = response.data;

    return {
      breaking: data?.breaking ?? [],
      featured: data?.featured ?? [],
      latest: data?.latest ?? [],
      categories: data?.categories ?? [],
      sections: data?.sections ?? [],
    };
  } catch (error) {
    // /api/home ships with a later API release than the app may be talking to.
    // Against an older deployment, compose the same payload from the endpoints
    // that have always existed rather than failing the whole screen.
    if (error instanceof ApiError && error.status === 404) {
      return composeHomeFromLegacyEndpoints();
    }
    throw error;
  }
}

async function composeHomeFromLegacyEndpoints(): Promise<HomePayload> {
  const [breaking, featured, latest, categories] = await Promise.all([
    getNewsPage({ breaking: true, perPage: 8 }),
    getNewsPage({ featured: true, perPage: 5 }),
    getNewsPage({ perPage: DEFAULT_PER_PAGE }),
    getCategories(),
  ]);

  const payload: HomePayload = {
    breaking: breaking.items,
    featured: featured.items,
    latest: latest.items,
    categories,
    sections: [],
  };

  writeCache("home", { data: payload });

  return payload;
}

export async function getNewsDetail(id: number | string): Promise<Article> {
  const response = await requestWithCache<{ data: Article }>(
    buildUrl(`news/${id}`),
    `article:${id}`
  );
  return response.data;
}

/**
 * Defaults to the Nepali edition. Pass an edition id for the English set, or
 * "all" for the legacy mixed listing.
 */
export async function getCategories(edition?: number | "all"): Promise<Category[]> {
  const url = buildUrl("categories", { per_page: 100, edition });
  const response = await requestWithCache<{ data: Category[] }>(
    url,
    `categories:${edition ?? "default"}`
  );
  return response.data ?? [];
}

export async function getEditions(): Promise<Edition[]> {
  try {
    const response = await requestWithCache<{ data: Edition[] }>(
      buildUrl("editions"),
      "editions"
    );
    return response.data ?? [];
  } catch (error) {
    // Older API deployments have no /editions; the app then shows only the
    // default edition's categories rather than failing the drawer.
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

/**
 * The curated story rail: today's most-viewed set followed by the "on this
 * day" throwbacks, already in display order.
 *
 * Returns an empty list rather than throwing when there is nothing to show --
 * the sets are rebuilt by a scheduled job, so a day it has not run for yet is
 * an ordinary state, and the rail simply hides itself.
 */
export async function getStories(edition?: number): Promise<Story[]> {
  try {
    const response = await requestWithCache<{ data: Story[] }>(
      buildUrl("stories", { edition }),
      `stories:${edition ?? "default"}`
    );
    return response.data ?? [];
  } catch (error) {
    // Older API deployments have no /stories; the app then renders the home
    // screen without a rail rather than failing the whole screen.
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function getTrendingTags(): Promise<Tag[]> {
  const response = await requestWithCache<{ data: Tag[] }>(buildUrl("tags"), "tags");
  return response.data ?? [];
}

export async function searchNews(term: string, page = 1): Promise<Page<Article>> {
  return getNewsPage({ q: term, page });
}

/** Office contact details published in Play Store / site declarations, kept
 *  live from the site config rather than duplicated as a static copy in the app. */
export async function getContactInfo(): Promise<ContactInfo> {
  const response = await requestWithCache<{ data: { key: string; value: string }[] }>(
    buildUrl("configs"),
    "configs"
  );
  const configs = response.data ?? [];
  const get = (key: string) => configs.find((entry) => entry.key === key)?.value || undefined;

  return {
    address: get("office_address"),
    email: get("office_email"),
    phone1: get("office_phone1"),
    phone2: get("office_phone2"),
    website: "https://www.dhangadhikhabar.com/contact",
  };
}
