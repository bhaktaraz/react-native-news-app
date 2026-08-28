import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { NewsQuery } from "../api/types";
import ArticleCard, { ArticleCardVariant } from "./ArticleCard";
import { ArticleListSkeleton, EmptyState, ErrorState } from "./StateViews";
import { usePagedNews } from "../hooks/usePagedNews";
import { useTheme, spacing, typography } from "../theme";

interface NewsFeedProps {
  query: NewsQuery;
  navigation: NavigationProp<any>;
  variant?: ArticleCardVariant;
  showCategory?: boolean;
  emptyTitle?: string;
  header?: React.ReactElement | null;
}

/** The paginated list shared by the category, tag and author screens. */
const NewsFeed: React.FC<NewsFeedProps> = ({
  query,
  navigation,
  variant = "standard",
  showCategory = true,
  emptyTitle = "कुनै समाचार भेटिएन",
  header = null,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { articles, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore, retry } =
    usePagedNews(query);

  if (loading) {
    return (
      <View style={styles.container}>
        {header}
        <ArticleListSkeleton count={3} />
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        <ErrorState error={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => `feed-${item.id}`}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            navigation={navigation}
            variant={variant}
            showCategory={showCategory}
          />
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={<EmptyState title={emptyTitle} />}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={theme.colors.brand} />
            </View>
          ) : !hasMore && articles.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>सबै समाचार हेरिसक्नुभयो</Text>
            </View>
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
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
    listContent: {
      paddingTop: spacing.md,
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

export default NewsFeed;
