import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Bookmark, getBookmarks, removeBookmark } from "../storage/bookmarks";
import { DEFAULT_ARTICLE_IMAGE } from "../components/ArticleCard";
import { EmptyState } from "../components/StateViews";
import { useTheme, radius, spacing, typography } from "../theme";
import { relativeTime } from "../utils/time";

interface SavedScreenProps {
  navigation: NavigationProp<any>;
}

const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Re-read on focus so an article saved from the detail screen shows up here
  // as soon as the user navigates back.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getBookmarks().then((stored) => {
        if (active) {
          setBookmarks(stored);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const remove = async (id: number) => {
    const next = await removeBookmark(id);
    setBookmarks(next);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => `saved-${item.id}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="कुनै समाचार सेभ गरिएको छैन"
            message="समाचार पढ्दा बुकमार्क थिचेर यहाँ सुरक्षित गर्नुहोस् ।"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.row}
            onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}
          >
            <Image
              source={{ uri: item.image || DEFAULT_ARTICLE_IMAGE }}
              style={styles.thumbnail}
            />
            <View style={styles.rowBody}>
              <Text style={styles.title} numberOfLines={3}>
                {item.title}
              </Text>
              <Text style={styles.meta}>{relativeTime(item.created_on)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => remove(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
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
      paddingVertical: spacing.sm,
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
    thumbnail: {
      width: 84,
      height: 64,
      borderRadius: radius.md,
      backgroundColor: theme.colors.skeleton,
    },
    rowBody: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    title: {
      ...typography.titleSmall,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    meta: {
      ...typography.meta,
      color: theme.colors.textMuted,
    },
    removeButton: {
      padding: spacing.xs,
    },
  });

export default SavedScreen;
