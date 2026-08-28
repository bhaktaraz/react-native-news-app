import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ApiError } from "../api/types";
import { useTheme, radius, spacing, typography } from "../theme";

/** A single shimmering placeholder block. */
export const SkeletonBlock: React.FC<{
  width?: number | string;
  height?: number;
  style?: any;
}> = ({ width = "100%", height = 14, style }) => {
  const theme = useTheme();
  const shimmer = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius.sm,
          backgroundColor: theme.colors.skeleton,
          opacity: shimmer,
        },
        style,
      ]}
    />
  );
};

/** Placeholder shaped like the standard article card, shown on first load. */
export const ArticleListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.skeletonWrapper}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <SkeletonBlock height={190} style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <SkeletonBlock width="35%" height={10} />
            <SkeletonBlock height={18} style={styles.skeletonLine} />
            <SkeletonBlock width="70%" height={18} style={styles.skeletonLine} />
            <SkeletonBlock width="45%" height={10} style={styles.skeletonLine} />
          </View>
        </View>
      ))}
    </View>
  );
};

interface MessageStateProps {
  icon: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const MessageState: React.FC<MessageStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.stateContainer}>
      <View style={styles.stateIcon}>
        <Ionicons name={icon} size={30} color={theme.colors.brand} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateMessage}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.stateButton} onPress={onAction} activeOpacity={0.85}>
          <Text style={styles.stateButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export const ErrorState: React.FC<{ error: ApiError | null; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <MessageState
    icon={error?.offline ? "cloud-offline-outline" : "alert-circle-outline"}
    title={error?.offline ? "इन्टरनेट जडान भएन" : "समाचार ल्याउन सकिएन"}
    message={
      error?.offline
        ? "जडान जाँच गरी फेरि प्रयास गर्नुहोस् ।"
        : "केही समयपछि फेरि प्रयास गर्नुहोस् ।"
    }
    actionLabel="फेरि प्रयास गर्नुहोस्"
    onAction={onRetry}
  />
);

export const EmptyState: React.FC<{ title: string; message?: string }> = ({ title, message }) => (
  <MessageState icon="newspaper-outline" title={title} message={message} />
);

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    skeletonWrapper: {
      paddingTop: spacing.md,
    },
    skeletonCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: radius.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    skeletonImage: {
      borderRadius: 0,
    },
    skeletonBody: {
      padding: spacing.lg,
    },
    skeletonLine: {
      marginTop: spacing.sm,
    },
    stateContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl * 2,
    },
    stateIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.brandSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    stateTitle: {
      ...typography.sectionTitle,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    stateMessage: {
      fontSize: 14,
      lineHeight: 24,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    stateButton: {
      marginTop: spacing.xl,
      backgroundColor: theme.colors.brand,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    stateButtonText: {
      ...typography.label,
      color: theme.colors.onBrand,
    },
  });
