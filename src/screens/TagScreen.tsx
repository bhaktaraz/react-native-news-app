import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { getTrendingTags } from "../api/client";
import { ApiError, Tag } from "../api/types";
import { EmptyState, ErrorState, SkeletonBlock } from "../components/StateViews";
import { useTheme, radius, spacing, typography } from "../theme";

interface TagScreenProps {
  navigation: NavigationProp<any>;
}

const TagScreen: React.FC<TagScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setTags(await getTrendingTags());
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError("Unexpected error", false));
      setTags([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.skeletonWrapper}>
        {Array.from({ length: 14 }).map((_, index) => (
          <SkeletonBlock key={index} width={90 + (index % 4) * 26} height={34} style={styles.skeletonChip} />
        ))}
      </View>
    );
  }

  if (error && tags.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorState error={error} onRetry={() => load()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        keyExtractor={(item) => `tag-${item.tag_id}`}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        ListEmptyComponent={<EmptyState title="कुनै ट्याग भेटिएन" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.chip}
            onPress={() =>
              navigation.navigate("ArticleListByTag", { id: item.tag_id, name: item.name })
            }
          >
            <Text style={styles.chipText} numberOfLines={1}>
              #{item.name}
            </Text>
            {item.total_count ? (
              <Text style={styles.chipCount}>{item.total_count}</Text>
            ) : null}
          </TouchableOpacity>
        )}
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
      padding: spacing.md,
    },
    column: {
      justifyContent: "space-between",
    },
    chip: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      margin: spacing.xs,
    },
    chipText: {
      ...typography.label,
      color: theme.colors.text,
      flexShrink: 1,
    },
    chipCount: {
      ...typography.meta,
      color: theme.colors.textMuted,
      marginLeft: spacing.sm,
    },
    skeletonWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: spacing.lg,
    },
    skeletonChip: {
      borderRadius: radius.md,
      margin: spacing.xs,
    },
  });

export default TagScreen;
