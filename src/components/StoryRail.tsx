import React, { useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Story } from "../api/types";
import { useTheme, radius, spacing, typography } from "../theme";

interface StoryRailProps {
  stories: Story[];
  seen: Set<number>;
  onOpen: (index: number) => void;
}

const BUBBLE_SIZE = 64;
const RING_WIDTH = 3;

/**
 * The row of circular story bubbles above the feed. Mirrors the web rail:
 * today's most-read set first, then the "on this day" throwbacks, with an
 * already-opened bubble dimmed rather than hidden.
 */
const StoryRail: React.FC<StoryRailProps> = ({ stories, seen, onOpen }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!stories.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={stories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `story-${item.news.id}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const isSeen = seen.has(item.news.id);

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.bubble}
              onPress={() => onOpen(index)}
            >
              <View style={[styles.ring, isSeen && styles.ringSeen]}>
                <View style={styles.thumbFrame}>
                  {item.news.image ? (
                    <Image source={{ uri: item.news.image }} style={styles.thumb} />
                  ) : (
                    <View style={[styles.thumb, styles.thumbFallback]} />
                  )}
                </View>

                {item.type === "on_this_day" && item.news.year_np ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.news.year_np}</Text>
                  </View>
                ) : null}
              </View>

              <Text style={[styles.label, isSeen && styles.labelSeen]} numberOfLines={2}>
                {item.news.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
    },
    bubble: {
      width: 76,
      marginRight: spacing.md,
      alignItems: "center",
    },
    ring: {
      width: BUBBLE_SIZE + RING_WIDTH * 2,
      height: BUBBLE_SIZE + RING_WIDTH * 2,
      borderRadius: (BUBBLE_SIZE + RING_WIDTH * 2) / 2,
      padding: RING_WIDTH,
      // A flat ring stands in for the web's gradient, which would otherwise
      // pull in a gradient dependency for one decoration.
      backgroundColor: theme.colors.brand,
    },
    ringSeen: {
      backgroundColor: theme.colors.borderStrong,
    },
    thumbFrame: {
      flex: 1,
      borderRadius: BUBBLE_SIZE / 2,
      borderWidth: 2,
      borderColor: theme.colors.surface,
      overflow: "hidden",
    },
    thumb: {
      width: "100%",
      height: "100%",
    },
    thumbFallback: {
      backgroundColor: theme.colors.brand,
    },
    badge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: theme.colors.surface,
      backgroundColor: theme.colors.accent,
    },
    badgeText: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: "700",
      color: theme.colors.onBrand,
    },
    label: {
      ...typography.meta,
      fontSize: 11,
      lineHeight: 15,
      marginTop: spacing.xs + 2,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    labelSeen: {
      color: theme.colors.textMuted,
    },
  });

export default StoryRail;
