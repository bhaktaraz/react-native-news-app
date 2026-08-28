import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Category } from "../api/types";
import { useTheme, radius, spacing, typography } from "../theme";

interface CategoryChipsProps {
  categories: Category[];
  navigation: NavigationProp<any>;
  activeId?: number;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({ categories, navigation, activeId }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!categories.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.8}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() =>
              navigation.navigate("ArticleListByCategory", {
                id: category.id,
                name: category.name,
              })
            }
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderStrong,
      marginRight: spacing.sm,
    },
    chipActive: {
      backgroundColor: theme.colors.brand,
      borderColor: theme.colors.brand,
    },
    chipText: {
      ...typography.label,
      color: theme.colors.textSecondary,
    },
    chipTextActive: {
      color: theme.colors.onBrand,
    },
  });

export default CategoryChips;
