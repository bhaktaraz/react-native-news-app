import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme, spacing, typography } from "../theme";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.action} onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.brand} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    accent: {
      width: 4,
      height: 20,
      borderRadius: 2,
      backgroundColor: theme.colors.brand,
      marginRight: spacing.sm,
    },
    title: {
      ...typography.sectionTitle,
      color: theme.colors.text,
      flexShrink: 1,
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      ...typography.label,
      color: theme.colors.brand,
      marginRight: 2,
    },
  });

export default SectionHeader;
