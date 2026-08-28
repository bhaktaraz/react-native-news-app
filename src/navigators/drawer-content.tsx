import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCategories, getEditions } from "../api/client";
import { Category, Edition } from "../api/types";
import { useTheme, useThemePreference, radius, spacing, typography } from "../theme";
import { SkeletonBlock } from "../components/StateViews";

/**
 * `root` is the first screen of each tab's stack. Focusing a tab alone leaves
 * its stack wherever the user left it, so a drawer link has to name the root
 * explicitly -- otherwise "गृहपृष्ठ" lands back on the article the reader was
 * last on, since drawer categories and article taps both push onto HomeTab.
 */
const PRIMARY_LINKS = [
  { label: "गृहपृष्ठ", icon: "home-outline", screen: "HomeTab", root: "Home" },
  { label: "खोज्नुहोस्", icon: "search-outline", screen: "SearchTab", root: "Search" },
  { label: "सेभ गरिएका", icon: "bookmark-outline", screen: "SavedTab", root: "Saved" },
  { label: "ट्रेन्डिङ ट्याग", icon: "flame-outline", screen: "TagTab", root: "Tag" },
];

const THEME_OPTIONS: { label: string; value: "system" | "light" | "dark"; icon: string }[] = [
  { label: "स्वतः", value: "system", icon: "phone-portrait-outline" },
  { label: "उज्यालो", value: "light", icon: "sunny-outline" },
  { label: "अँध्यारो", value: "dark", icon: "moon-outline" },
];

const DrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editions, setEditions] = useState<Edition[]>([]);
  // undefined = the default (Nepali) edition; a number selects another edition.
  const [activeEdition, setActiveEdition] = useState<number | undefined>(undefined);

  useEffect(() => {
    let active = true;

    getEditions()
      .then((data) => {
        if (active) {
          setEditions(data);
        }
      })
      .catch(() => {
        // Without editions the drawer simply offers no switcher.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingCategories(true);

    getCategories(activeEdition)
      .then((data) => {
        if (active) {
          setCategories(data);
        }
      })
      .catch(() => {
        // The drawer stays usable without categories -- primary links still work.
        if (active) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingCategories(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activeEdition]);

  const activeTab = useMemo(() => {
    const mainRoute = state.routes[state.index];
    const nested = mainRoute?.state as any;
    if (!nested?.routes?.length) {
      return "HomeTab";
    }
    return nested.routes[nested.index ?? 0]?.name ?? "HomeTab";
  }, [state]);

  const goToTab = (screen: string, root: string) => {
    // Navigating to a route already in the stack pops back to it, so this both
    // focuses the tab and unwinds any article/category screens above its root.
    navigation.navigate("MainHome", { screen, params: { screen: root } });
    navigation.closeDrawer();
  };

  const goToCategory = (category: Category) => {
    navigation.navigate("MainHome", {
      screen: "HomeTab",
      params: {
        screen: "ArticleListByCategory",
        params: { id: category.id, name: category.name },
      },
    });
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.brandRow}>
        <Image
          source={require("../assets/dk-logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {PRIMARY_LINKS.map((link) => {
          const active = activeTab === link.screen;
          return (
            <TouchableOpacity
              key={link.screen}
              activeOpacity={0.75}
              style={[styles.linkRow, active && styles.linkRowActive]}
              onPress={() => goToTab(link.screen, link.root)}
            >
              <Ionicons
                name={link.icon}
                size={20}
                color={active ? theme.colors.brand : theme.colors.textSecondary}
              />
              <Text style={[styles.linkLabel, active && styles.linkLabelActive]}>
                {link.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.sectionLabel}>समाचार वर्ग</Text>

        {editions.length > 0 ? (
          <View style={styles.editionRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.editionChip, activeEdition === undefined && styles.editionChipActive]}
              onPress={() => setActiveEdition(undefined)}
            >
              <Text
                style={[
                  styles.editionChipText,
                  activeEdition === undefined && styles.editionChipTextActive,
                ]}
              >
                नेपाली
              </Text>
            </TouchableOpacity>

            {editions.map((edition) => {
              const active = activeEdition === edition.id;
              return (
                <TouchableOpacity
                  key={edition.id}
                  activeOpacity={0.8}
                  style={[styles.editionChip, active && styles.editionChipActive]}
                  onPress={() => setActiveEdition(edition.id)}
                >
                  <Text style={[styles.editionChipText, active && styles.editionChipTextActive]}>
                    {edition.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {loadingCategories ? (
          <View style={styles.skeletonGroup}>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonBlock key={index} height={16} style={styles.skeletonRow} />
            ))}
          </View>
        ) : (
          categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.75}
              style={styles.categoryRow}
              onPress={() => goToCategory(category)}
            >
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {category.name}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionLabel}>थिम</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((option) => {
            const active = preference === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.8}
                style={[styles.themeChip, active && styles.themeChipActive]}
                onPress={() => setPreference(option.value)}
              >
                <Ionicons
                  name={option.icon}
                  size={16}
                  color={active ? theme.colors.onBrand : theme.colors.textSecondary}
                />
                <Text style={[styles.themeChipText, active && styles.themeChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.footerText}>धनगढी खबर</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    brandRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    logo: {
      width: 140,
      height: 40,
    },
    scroll: {
      paddingBottom: spacing.xl,
    },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    linkRowActive: {
      backgroundColor: theme.colors.brandSoft,
    },
    linkLabel: {
      ...typography.label,
      color: theme.colors.textSecondary,
      marginLeft: spacing.md,
    },
    linkLabelActive: {
      color: theme.colors.brand,
    },
    sectionLabel: {
      ...typography.meta,
      color: theme.colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.sm,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    categoryLabel: {
      fontSize: 15,
      lineHeight: 24,
      color: theme.colors.text,
      flex: 1,
      paddingRight: spacing.sm,
    },
    editionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    editionChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderStrong,
      marginRight: spacing.sm,
      marginBottom: spacing.xs,
    },
    editionChipActive: {
      backgroundColor: theme.colors.brand,
      borderColor: theme.colors.brand,
    },
    editionChipText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
    },
    editionChipTextActive: {
      color: theme.colors.onBrand,
    },
    skeletonGroup: {
      paddingHorizontal: spacing.lg,
    },
    skeletonRow: {
      marginBottom: spacing.md,
    },
    themeRow: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
    },
    themeChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderStrong,
      marginRight: spacing.sm,
    },
    themeChipActive: {
      backgroundColor: theme.colors.brand,
      borderColor: theme.colors.brand,
    },
    themeChipText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
      marginLeft: spacing.xs,
    },
    themeChipTextActive: {
      color: theme.colors.onBrand,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    footerText: {
      ...typography.meta,
      color: theme.colors.textMuted,
    },
  });

export default DrawerContent;
