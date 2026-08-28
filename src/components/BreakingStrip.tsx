import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Article } from "../api/types";
import { useTheme, radius, spacing, typography } from "../theme";
import { relativeTime } from "../utils/time";

interface BreakingStripProps {
  articles: Article[];
  navigation: NavigationProp<any>;
}

/**
 * The red band across the top of the home screen. Horizontal rather than a
 * single rotating headline so a reader can scan every breaking item without
 * waiting for an animation.
 */
const BreakingStrip: React.FC<BreakingStripProps> = ({ articles, navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!articles.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.liveDot} />
        <Text style={styles.headerText}>ब्रेकिङ न्युज</Text>
        <Ionicons name="flash" size={14} color={theme.colors.onBrand} />
      </View>

      <FlatList
        horizontal
        data={articles}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `breaking-${item.id}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.item}
            onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}
          >
            <Text style={styles.itemTitle} numberOfLines={3}>
              {item.title}
            </Text>
            <Text style={styles.itemTime}>{relativeTime(item.created_on)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.brand,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.onBrand,
      marginRight: spacing.sm,
    },
    headerText: {
      ...typography.label,
      color: theme.colors.onBrand,
      letterSpacing: 0.5,
      marginRight: spacing.xs,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
    },
    item: {
      width: 250,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderRadius: radius.md,
      padding: spacing.md,
      marginRight: spacing.md,
      justifyContent: "space-between",
    },
    itemTitle: {
      ...typography.titleSmall,
      color: theme.colors.onBrand,
      marginBottom: spacing.sm,
    },
    itemTime: {
      ...typography.meta,
      color: "rgba(255,255,255,0.8)",
    },
  });

export default BreakingStrip;
