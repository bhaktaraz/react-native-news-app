import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ApiError, ContactInfo, getContactInfo } from "../api/client";
import { ErrorState, SkeletonBlock } from "../components/StateViews";
import { useTheme, radius, spacing, typography } from "../theme";

const ContactScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getContactInfo()
      .then((data) => {
        if (active) {
          setContact(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof ApiError ? err : new ApiError("Unknown error", false));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  if (loading && !contact) {
    return (
      <View style={[styles.container, styles.content]}>
        <SkeletonBlock height={28} width="60%" style={{ marginBottom: spacing.sm }} />
        <SkeletonBlock height={18} width="90%" style={{ marginBottom: spacing.xl }} />
        <SkeletonBlock height={220} />
      </View>
    );
  }

  if (error && !contact) {
    return (
      <View style={styles.container}>
        <ErrorState error={error} onRetry={load} />
      </View>
    );
  }

  const rows = [
    contact?.address && {
      icon: "location-outline" as const,
      label: "ठेगाना",
      value: contact.address,
    },
    (contact?.phone1 || contact?.phone2) && {
      icon: "call-outline" as const,
      label: "फोन",
      value: [contact?.phone1, contact?.phone2].filter(Boolean).join(" / "),
      onPress: () => Linking.openURL(`tel:${(contact?.phone1 ?? contact?.phone2)!.replace(/[^+\d]/g, "")}`),
    },
    contact?.email && {
      icon: "mail-outline" as const,
      label: "इमेल",
      value: contact.email,
      onPress: () => Linking.openURL(`mailto:${contact.email}`),
    },
    contact?.website && {
      icon: "globe-outline" as const,
      label: "वेबसाइट",
      value: contact.website.replace("https://", ""),
      onPress: () => Linking.openURL(contact.website!),
    },
  ].filter(Boolean) as {
    icon: "location-outline" | "call-outline" | "mail-outline" | "globe-outline";
    label: string;
    value: string;
    onPress?: () => void;
  }[];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>सम्पर्क सूचना</Text>
      <Text style={styles.subheading}>
        धनगढी खबरसँग सम्पर्क गर्न तलका माध्यमहरू प्रयोग गर्नुहोस् ।
      </Text>

      <View style={styles.card}>
        {rows.map((row) => {
          const RowWrapper = row.onPress ? TouchableOpacity : View;
          return (
            <RowWrapper
              key={row.label}
              activeOpacity={0.75}
              style={styles.row}
              onPress={row.onPress}
            >
              <View style={styles.iconBadge}>
                <Ionicons name={row.icon} size={18} color={theme.colors.brand} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            </RowWrapper>
          );
        })}
      </View>
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
      padding: spacing.lg,
    },
    heading: {
      ...typography.hero,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    subheading: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginBottom: spacing.xl,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: theme.colors.brandSoft,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    rowBody: {
      flex: 1,
    },
    rowLabel: {
      ...typography.meta,
      color: theme.colors.textMuted,
      marginBottom: 2,
    },
    rowValue: {
      ...typography.body,
      color: theme.colors.text,
    },
  });

export default ContactScreen;
