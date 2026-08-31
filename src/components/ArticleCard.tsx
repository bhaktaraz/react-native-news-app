import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Article, authorName } from "../api/types";
import { useTheme, radius, spacing, typography } from "../theme";
import { relativeTime } from "../utils/time";

export type ArticleCardVariant = "hero" | "standard" | "compact";

interface ArticleCardProps {
  article: Article;
  navigation: NavigationProp<any>;
  variant?: ArticleCardVariant;
  showCategory?: boolean;
}

export const DEFAULT_ARTICLE_IMAGE =
  "https://www.dhangadhikhabar.com/uploads/configuration/DHANGADHI-KHABAR-HD-FINAL-LOGO.jpeg";

/** A bare scheme+host is what the API returns for an article with no image. */
const imageSource = (image?: string) => {
  const usable = image && !/^https?:\/\/[^/]+\/?$/.test(image) ? image : DEFAULT_ARTICLE_IMAGE;
  return { uri: usable };
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  navigation,
  variant = "standard",
  showCategory = true,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const category = article.categories?.[0];
  const time = relativeTime(article.created_on);

  const open = () => navigation.navigate("ArticleDetail", { id: article.id });

  if (variant === "compact") {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.compactRow} onPress={open}>
        <View style={styles.compactText}>
          {showCategory && category ? (
            <Text style={styles.compactCategory} numberOfLines={1}>
              {category.name}
            </Text>
          ) : null}
          <Text style={styles.compactTitle} numberOfLines={3}>
            {article.title}
          </Text>
          <Text style={styles.metaText}>
            {authorName(article.author)} · {time}
          </Text>
        </View>
        <Image source={imageSource(article.image)} style={styles.compactImage} />
      </TouchableOpacity>
    );
  }

  if (variant === "hero") {
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.heroCard} onPress={open}>
        <Image source={imageSource(article.image)} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroBody}>
          {showCategory && category ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{category.name}</Text>
            </View>
          ) : null}
          <Text style={styles.heroTitle} numberOfLines={3}>
            {article.title}
          </Text>
          {article.intro ? (
            <Text style={styles.heroIntro} numberOfLines={2}>
              {article.intro}
            </Text>
          ) : null}
          <Text style={styles.metaText}>
            {authorName(article.author)} · {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={open}>
      <Image source={imageSource(article.image)} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        {showCategory && category ? (
          <Text style={styles.cardCategory} numberOfLines={1}>
            {category.name}
          </Text>
        ) : null}
        <Text style={styles.cardTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.metaText}>
          {authorName(article.author)} · {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: radius.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    cardImage: {
      width: "100%",
      height: 200,
      backgroundColor: theme.colors.skeleton,
    },
    cardBody: {
      padding: spacing.lg,
    },
    cardCategory: {
      ...typography.meta,
      color: theme.colors.brand,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: spacing.xs,
    },
    cardTitle: {
      ...typography.title,
      color: theme.colors.text,
      marginBottom: spacing.sm,
    },
    heroCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: radius.lg,
      marginHorizontal: spacing.lg,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    heroImage: {
      width: "100%",
      height: 230,
      backgroundColor: theme.colors.skeleton,
    },
    heroBody: {
      padding: spacing.lg,
    },
    categoryPill: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.brandSoft,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
    },
    categoryPillText: {
      ...typography.meta,
      color: theme.colors.brand,
      fontWeight: "700",
    },
    heroTitle: {
      ...typography.hero,
      color: theme.colors.text,
      marginBottom: spacing.sm,
    },
    heroIntro: {
      fontSize: 14,
      lineHeight: 24,
      color: theme.colors.textSecondary,
      marginBottom: spacing.sm,
    },
    compactRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    compactText: {
      flex: 1,
      paddingRight: spacing.md,
    },
    compactCategory: {
      ...typography.meta,
      color: theme.colors.brand,
      marginBottom: 2,
    },
    compactTitle: {
      ...typography.titleSmall,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    compactImage: {
      width: 96,
      height: 72,
      borderRadius: radius.md,
      backgroundColor: theme.colors.skeleton,
    },
    metaText: {
      ...typography.meta,
      color: theme.colors.textMuted,
    },
  });

export default ArticleCard;
