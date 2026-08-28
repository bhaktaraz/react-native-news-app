import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getTrendingTags } from "../api/client";
import { Tag } from "../api/types";
import ArticleCard from "../components/ArticleCard";
import { ArticleListSkeleton, EmptyState, ErrorState } from "../components/StateViews";
import { usePagedNews } from "../hooks/usePagedNews";
import { useTheme, radius, spacing, typography } from "../theme";

interface SearchScreenProps {
  navigation: NavigationProp<any>;
}

const MIN_TERM_LENGTH = 2;
const DEBOUNCE_MS = 450;

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [term, setTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  // Debounced so typing a word does not fire a request per keystroke against
  // a LIKE query over a 86k-row table.
  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < MIN_TERM_LENGTH) {
      setSubmittedTerm("");
      return;
    }

    const timer = setTimeout(() => setSubmittedTerm(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    getTrendingTags()
      .then((tags) => setSuggestions(tags.slice(0, 12)))
      .catch(() => {
        // Suggestions are a convenience; search still works without them.
      });
  }, []);

  const query = useMemo(() => ({ q: submittedTerm }), [submittedTerm]);
  const { articles, loading, refreshing, loadingMore, error, refresh, loadMore, retry } =
    usePagedNews(query, submittedTerm.length >= MIN_TERM_LENGTH);

  const clear = useCallback(() => {
    setTerm("");
    setSubmittedTerm("");
  }, []);

  const renderBody = () => {
    if (submittedTerm.length < MIN_TERM_LENGTH) {
      return (
        <View style={styles.suggestionsWrapper}>
          <Text style={styles.suggestionsTitle}>ट्रेन्डिङ खोजी</Text>
          <View style={styles.suggestionsRow}>
            {suggestions.map((tag) => (
              <TouchableOpacity
                key={tag.tag_id}
                activeOpacity={0.8}
                style={styles.suggestionChip}
                onPress={() => setTerm(tag.name)}
              >
                <Text style={styles.suggestionText}>#{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (loading) {
      return <ArticleListSkeleton count={3} />;
    }

    if (error && articles.length === 0) {
      return <ErrorState error={error} onRetry={retry} />;
    }

    return (
      <FlatList
        data={articles}
        keyExtractor={(item) => `search-${item.id}`}
        renderItem={({ item }) => (
          <ArticleCard article={item} navigation={navigation} variant="compact" />
        )}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            title="कुनै नतिजा भेटिएन"
            message={`"${submittedTerm}" सँग मिल्ने समाचार भेटिएन ।`}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={theme.colors.brand} />
            </View>
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          value={term}
          onChangeText={setTerm}
          placeholder="समाचार खोज्नुहोस्..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          onSubmitEditing={() => setSubmittedTerm(term.trim())}
        />
        {term.length > 0 ? (
          <TouchableOpacity onPress={clear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {renderBody()}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderStrong,
      marginHorizontal: spacing.lg,
      marginVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      height: 46,
    },
    input: {
      flex: 1,
      marginLeft: spacing.sm,
      fontSize: 15,
      color: theme.colors.text,
      padding: 0,
    },
    suggestionsWrapper: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    suggestionsTitle: {
      ...typography.label,
      color: theme.colors.textSecondary,
      marginBottom: spacing.md,
    },
    suggestionsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    suggestionChip: {
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderStrong,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    suggestionText: {
      ...typography.meta,
      color: theme.colors.textSecondary,
    },
    footer: {
      paddingVertical: spacing.xl,
      alignItems: "center",
    },
    footerSpacer: {
      height: spacing.xl,
    },
  });

export default SearchScreen;
