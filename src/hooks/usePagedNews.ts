import { useCallback, useEffect, useRef, useState } from "react";
import { getNewsPage } from "../api/client";
import { ApiError, Article, NewsQuery } from "../api/types";

export interface PagedNews {
  articles: Article[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: ApiError | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  retry: () => void;
}

/**
 * Feed pagination shared by the home, category, tag and search screens.
 *
 * `enabled` lets the search screen mount the hook before a term exists, and
 * the request counter makes sure a slow page-1 response cannot overwrite the
 * results of a newer query.
 */
export function usePagedNews(query: NewsQuery, enabled = true): PagedNews {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const pageRef = useRef(1);
  const requestIdRef = useRef(0);
  const key = JSON.stringify(query);

  const load = useCallback(
    async (page: number, mode: "initial" | "refresh" | "more") => {
      if (!enabled) {
        return;
      }

      const requestId = ++requestIdRef.current;

      if (mode === "refresh") {
        setRefreshing(true);
      } else if (mode === "more") {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await getNewsPage({ ...query, page });

        if (requestId !== requestIdRef.current) {
          return;
        }

        pageRef.current = result.page;
        setHasMore(result.hasMore);
        setArticles((previous) => {
          if (mode !== "more") {
            return result.items;
          }
          // The feed is ordered by descending id and pages can shift while the
          // user reads, so drop anything already on screen.
          const seen = new Set(previous.map((article) => article.id));
          return [...previous, ...result.items.filter((article) => !seen.has(article.id))];
        });
      } catch (caught) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setError(
          caught instanceof ApiError ? caught : new ApiError("Something went wrong", false)
        );
        if (mode !== "more") {
          setArticles([]);
          setHasMore(false);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    // `query` is compared by value through `key` so callers can pass an object
    // literal without re-triggering on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, enabled]
  );

  useEffect(() => {
    if (!enabled) {
      setArticles([]);
      setLoading(false);
      return;
    }
    pageRef.current = 1;
    load(1, "initial");
  }, [load, enabled]);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    load(1, "refresh");
  }, [load]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || refreshing || !hasMore) {
      return;
    }
    load(pageRef.current + 1, "more");
  }, [load, loadingMore, loading, refreshing, hasMore]);

  const retry = useCallback(() => {
    pageRef.current = 1;
    load(1, "initial");
  }, [load]);

  return {
    articles,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    retry,
  };
}
