import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import YoutubePlayer from "react-native-youtube-iframe";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Article, authorName } from "../api/types";
import { isBookmarked, toggleBookmark } from "../storage/bookmarks";
import { DEFAULT_ARTICLE_IMAGE } from "./ArticleCard";
import SectionHeader from "./SectionHeader";
import { useTheme, radius, spacing, typography } from "../theme";
import { relativeTime } from "../utils/time";

interface ArticleDetailProps {
  news: Article;
  navigation: NavigationProp<any>;
}

const ArticleDetailView: React.FC<ArticleDetailProps> = ({ news, navigation }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isBookmarked(news.id).then(setSaved);
  }, [news.id]);

  const onToggleSave = useCallback(async () => {
    setSaved(await toggleBookmark(news));
  }, [news]);

  const onShare = useCallback(() => {
    Share.share(
      {
        title: news.title,
        message: `${news.title}\n${news.url}`,
        url: news.url,
      },
      { dialogTitle: news.title }
    ).catch(() => {
      // The user dismissing the sheet rejects the promise; nothing to report.
    });
  }, [news]);

  const onOpenWeb = useCallback(() => {
    if (news.url) {
      Linking.openURL(news.url).catch(() => {});
    }
  }, [news.url]);

  // RenderHtml caches by identity, so the tag styles must not be rebuilt on
  // every render or the article body re-lays-out while scrolling.
  const tagsStyles = useMemo(
    () => ({
      body: { color: theme.colors.text },
      p: {
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
        color: theme.colors.text,
        marginTop: 0,
        marginBottom: spacing.lg,
      },
      a: { color: theme.colors.accent, textDecorationLine: "none" as const },
      strong: { fontWeight: "700" as const, color: theme.colors.text },
      h2: {
        fontSize: 19,
        lineHeight: 30,
        fontWeight: "700" as const,
        color: theme.colors.text,
      },
      h3: {
        fontSize: 17,
        lineHeight: 28,
        fontWeight: "700" as const,
        color: theme.colors.text,
      },
      li: {
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
        color: theme.colors.text,
      },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.brand,
        paddingLeft: spacing.md,
        marginLeft: 0,
        color: theme.colors.textSecondary,
      },
      img: { marginVertical: spacing.md, borderRadius: radius.md },
    }),
    [theme]
  );

  const source = useMemo(() => ({ html: news.content || `<p>${news.intro ?? ""}</p>` }), [
    news.content,
    news.intro,
  ]);

  const category = news.categories?.[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        {category ? (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{category.name}</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{news.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="person-circle-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.metaText}>{authorName(news.author)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>
            {news.date_np || relativeTime(news.created_on)}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={onToggleSave} activeOpacity={0.7}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={19}
              color={saved ? theme.colors.brand : theme.colors.textSecondary}
            />
            <Text style={[styles.actionText, saved && styles.actionTextActive]}>
              {saved ? "सेभ भयो" : "सेभ"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onShare} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={19} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>सेयर</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onOpenWeb} activeOpacity={0.7}>
            <Ionicons name="globe-outline" size={19} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>वेबसाइट</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: news.image || DEFAULT_ARTICLE_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {news.image_caption ? (
          <Text style={styles.caption}>{news.image_caption}</Text>
        ) : null}

        <RenderHtml
          contentWidth={width - spacing.lg * 2}
          source={source}
          tagsStyles={tagsStyles}
          enableExperimentalMarginCollapsing
        />

        {news.youtube_video_id ? (
          <View style={styles.videoWrapper}>
            <YoutubePlayer height={210} videoId={news.youtube_video_id} />
          </View>
        ) : null}

        {news.tags && news.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {news.tags.map((tag) => (
              <TouchableOpacity
                key={tag.tag_id}
                style={styles.tagChip}
                activeOpacity={0.8}
                onPress={() =>
                  (navigation as any).push("ArticleListByTag", {
                    id: tag.tag_id,
                    name: tag.name,
                  })
                }
              >
                <Text style={styles.tagChipText}>#{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {news.related_news && news.related_news.length > 0 ? (
        <View style={styles.relatedBlock}>
          <SectionHeader title="सम्बन्धित समाचार" />
          {news.related_news.map((item) => (
            <TouchableOpacity
              key={`related-${item.id}`}
              activeOpacity={0.85}
              style={styles.relatedRow}
              onPress={() => (navigation as any).push("ArticleDetail", { id: item.id })}
            >
              <View style={styles.relatedText}>
                <Text style={styles.relatedTitle} numberOfLines={3}>
                  {item.title}
                </Text>
              </View>
              <Image
                source={{ uri: item.image || DEFAULT_ARTICLE_IMAGE }}
                style={styles.relatedThumb}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingBottom: spacing.xxl,
    },
    body: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    categoryPill: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.brandSoft,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      marginBottom: spacing.md,
    },
    categoryPillText: {
      ...typography.meta,
      color: theme.colors.brand,
      fontWeight: "700",
    },
    title: {
      fontSize: 25,
      lineHeight: 38,
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      flexWrap: "wrap",
    },
    metaText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
      marginLeft: spacing.xs,
    },
    metaDot: {
      ...typography.meta,
      color: theme.colors.textMuted,
      marginHorizontal: spacing.xs,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: spacing.xl,
    },
    actionText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
      marginLeft: spacing.xs,
    },
    actionTextActive: {
      color: theme.colors.brand,
    },
    heroImage: {
      width: "100%",
      height: 220,
      borderRadius: radius.md,
      backgroundColor: theme.colors.skeleton,
      marginBottom: spacing.sm,
    },
    caption: {
      ...typography.meta,
      color: theme.colors.textMuted,
      marginBottom: spacing.lg,
      fontStyle: "italic",
    },
    videoWrapper: {
      marginTop: spacing.lg,
      borderRadius: radius.md,
      overflow: "hidden",
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    tagChip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    tagChipText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
    },
    relatedBlock: {
      backgroundColor: theme.colors.surface,
      marginTop: spacing.md,
      paddingBottom: spacing.md,
    },
    relatedRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    relatedText: {
      flex: 1,
      paddingRight: spacing.md,
    },
    relatedTitle: {
      ...typography.titleSmall,
      color: theme.colors.text,
    },
    relatedThumb: {
      width: 88,
      height: 66,
      borderRadius: radius.md,
      backgroundColor: theme.colors.skeleton,
    },
  });

export default ArticleDetailView;
