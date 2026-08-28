import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCategories } from "../api/client";
import { ApiError, Category } from "../api/types";
import { EmptyState, ErrorState, SkeletonBlock } from "../components/StateViews";
import { useTheme, spacing } from "../theme";

interface CategoryScreenProps {
  navigation: NavigationProp<any>;
}

const iconFor = (name: string): string => {
  if (name.includes("राजनीति")) return "people-outline";
  if (name.includes("खेलकुद")) return "football-outline";
  if (name.includes("मनोरञ्जन") || name.includes("मनोरंजन")) return "film-outline";
  if (name.includes("समाज")) return "earth-outline";
  if (name.includes("अर्थ") || name.includes("विजनेश")) return "cash-outline";
  if (name.includes("स्वास्थ्य")) return "fitness-outline";
  if (name.includes("विश्व")) return "globe-outline";
  if (name.includes("प्रविधि")) return "hardware-chip-outline";
  if (name.includes("भिडियो")) return "videocam-outline";
  if (name.includes("फोटो")) return "images-outline";
  if (name.includes("अपराध")) return "shield-outline";
  if (name.includes("कला") || name.includes("साहित्य")) return "color-palette-outline";
  return "newspaper-outline";
};

const CategoryScreen: React.FC<CategoryScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [categories, setCategories] = useState<Category[]>([]);
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
      setCategories(await getCategories());
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError("Unexpected error", false));
      setCategories([]);
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
      <View style={styles.container}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={index} style={styles.row}>
            <SkeletonBlock width={40} height={40} style={styles.skeletonIcon} />
            <SkeletonBlock width="55%" height={16} />
          </View>
        ))}
      </View>
    );
  }

  if (error && categories.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorState error={error} onRetry={() => load()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => `category-${item.id}`}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        ListEmptyComponent={<EmptyState title="कुनै वर्ग भेटिएन" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.row}
            onPress={() =>
              navigation.navigate("ArticleListByCategory", { id: item.id, name: item.name })
            }
          >
            <View style={styles.iconCircle}>
              <Ionicons name={iconFor(item.name)} size={20} color={theme.colors.brand} />
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brandSoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    skeletonIcon: {
      borderRadius: 20,
      marginRight: spacing.md,
    },
    name: {
      flex: 1,
      fontSize: 15,
      lineHeight: 24,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });

export default CategoryScreen;
