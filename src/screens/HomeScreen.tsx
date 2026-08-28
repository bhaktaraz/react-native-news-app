import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { getHome, getNewsPage, getStories, DEFAULT_PER_PAGE } from "../api/client";
import { ApiError, Article, HomePayload, Story } from "../api/types";
import ArticleCard from "../components/ArticleCard";
import BreakingStrip from "../components/BreakingStrip";
import CategoryChips from "../components/CategoryChips";
import SectionHeader from "../components/SectionHeader";
import StoryRail from "../components/StoryRail";
import StoryViewer from "../components/StoryViewer";
import { markStorySeen, pruneSeenStories, readSeenStories } from "../storage/seenStories";
import { ArticleListSkeleton, EmptyState, ErrorState } from "../components/StateViews";
import { useTheme, spacing, typography } from "../theme";

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const EMPTY_HOME: HomePayload = {
  breaking: [],
  featured: [],
  latest: [],
  categories: [],
  sections: [],
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [home, setHome] = useState<HomePayload>(EMPTY_HOME);
  const [stories, setStories] = useState<Story[]>([]);
  const [seenStories, setSeenStories] = useState<Set<number>>(() => new Set());
  const [openStoryIndex, setOpenStoryIndex] = useState<number | null>(null);
  const [feed, setFeed] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // The home payload's `latest` block is page 1 of the same feed the infinite
  // scroll continues, so paging starts from 2.
  const pageRef = useRef(1);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // The rail is decoration; a failing /stories must not cost the reader
      // the whole home screen, so it degrades to no rail.
      const [payload, storyList] = await Promise.all([
        getHome(),
        getStories().catch(() => [] as Story[]),
      ]);
      setHome(payload);
      setStories(storyList);
      setFeed(payload.latest);
      pageRef.current = 1;
      setHasMore(payload.latest.length > 0);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError("Unexpected error", false));
      setHome(EMPTY_HOME);
      setStories([]);
      setFeed([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    readSeenStories().then(setSeenStories).catch(() => {});
    pruneSeenStories();
  }, []);

  // These three are handed to the viewer, whose progress timer restarts on any
  // prop change, so they must keep a stable identity across renders.
  const handleCloseStory = useCallback(() => setOpenStoryIndex(null), []);

  const handleStorySeen = useCallback((newsId: number) => {
    markStorySeen(newsId);
    setSeenStories((previous) => {
      if (previous.has(newsId)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(newsId);
      return next;
    });
  }, []);

  const handleStoryReadMore = useCallback(
    (newsId: number) => {
      setOpenStoryIndex(null);
      navigation.navigate("ArticleDetail", { id: newsId });
    },
    [navigation]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || refreshing || !hasMore) {
      return;
    }

    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const result = await getNewsPage({ page: nextPage, perPage: DEFAULT_PER_PAGE });
      pageRef.current = nextPage;
      setHasMore(result.hasMore && result.items.length > 0);
      setFeed((previous) => {
        const seen = new Set(previous.map((article) => article.id));
        return [...previous, ...result.items.filter((article) => !seen.has(article.id))];
      });
    } catch {
      // A failed page-append leaves the existing feed intact; the user can
      // scroll again to retry.
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, refreshing, hasMore]);

  const header = useMemo(
    () => (
      <View>
        <StoryRail stories={stories} seen={seenStories} onOpen={setOpenStoryIndex} />

        <BreakingStrip articles={home.breaking} navigation={navigation} />

        <CategoryChips categories={home.categories} navigation={navigation} />

        {home.featured.length > 0 ? (
          <>
            <SectionHeader title="विशेष समाचार" />
            <ArticleCard
              article={home.featured[0]}
              navigation={navigation}
              variant="hero"
            />
            <View style={styles.featuredRest}>
              {home.featured.slice(1).map((article) => (
                <ArticleCard
                  key={`featured-${article.id}`}
                  article={article}
                  navigation={navigation}
                  variant="compact"
                />
              ))}
            </View>
          </>
        ) : null}

        <SectionHeader title="पछिल्लो समाचार" />
      </View>
    ),
    [home, stories, seenStories, navigation, styles]
  );

  const footer = useMemo(() => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={theme.colors.brand} />
        </View>
      );
    }
    if (!hasMore && feed.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>सबै समाचार हेरिसक्नुभयो</Text>
        </View>
      );
    }
    return <View style={styles.footerSpacer} />;
  }, [loadingMore, hasMore, feed.length, styles, theme]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ArticleListSkeleton />
      </View>
    );
  }

  if (error && feed.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorState error={error} onRetry={() => load()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(item) => `feed-${item.id}`}
        renderItem={({ item }) => <ArticleCard article={item} navigation={navigation} />}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={<EmptyState title="कुनै समाचार भेटिएन" />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <StoryViewer
        stories={stories}
        startIndex={openStoryIndex}
        onClose={handleCloseStory}
        onSeen={handleStorySeen}
        onReadMore={handleStoryReadMore}
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    featuredRest: {
      marginTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    footer: {
      paddingVertical: spacing.xl,
      alignItems: "center",
    },
    footerSpacer: {
      height: spacing.xl,
    },
    footerText: {
      ...typography.meta,
      color: theme.colors.textMuted,
    },
  });

export default HomeScreen;
