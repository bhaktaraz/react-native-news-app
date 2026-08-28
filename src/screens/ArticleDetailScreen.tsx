import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { getNewsDetail } from "../api/client";
import { ApiError, Article } from "../api/types";
import ArticleDetailView from "../components/ArticleDetail";
import { ErrorState, SkeletonBlock } from "../components/StateViews";
import { useTheme, spacing } from "../theme";

interface ArticleDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

const DetailSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.skeletonBody}>
      <SkeletonBlock width="30%" height={20} />
      <SkeletonBlock height={26} style={styles.line} />
      <SkeletonBlock height={26} style={styles.line} />
      <SkeletonBlock width="60%" height={26} style={styles.line} />
      <SkeletonBlock height={200} style={styles.image} />
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonBlock
          key={index}
          width={index % 3 === 2 ? "70%" : "100%"}
          height={14}
          style={styles.line}
        />
      ))}
    </ScrollView>
  );
};

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { id } = (route.params ?? {}) as { id?: number | string };

  const [news, setNews] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    if (id === undefined || id === null) {
      setLoading(false);
      setError(new ApiError("Missing article id", false));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setNews(await getNewsDetail(id));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError("Unexpected error", false));
      setNews(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !news) {
    return (
      <View style={styles.container}>
        <ErrorState error={error} onRetry={load} />
      </View>
    );
  }

  return <ArticleDetailView news={news} navigation={navigation} />;
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    skeletonBody: {
      padding: spacing.lg,
      backgroundColor: theme.colors.surface,
      flexGrow: 1,
    },
    line: {
      marginTop: spacing.md,
    },
    image: {
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
  });

export default ArticleDetailScreen;
