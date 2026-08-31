import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme, radius, spacing, typography } from "../theme";

const CONTACT = {
  address: "Dhangadhi-3, Bishalnagar, Kailali",
  phone1: "977-91417611",
  phone2: "977-9851168362",
  email: "dhnkhabar@gmail.com",
  website: "https://www.dhangadhikhabar.com/contact",
};

const ContactScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rows = [
    {
      icon: "location-outline" as const,
      label: "ठेगाना",
      value: CONTACT.address,
    },
    {
      icon: "call-outline" as const,
      label: "फोन",
      value: `${CONTACT.phone1} / ${CONTACT.phone2}`,
      onPress: () => Linking.openURL(`tel:${CONTACT.phone1.replace(/[^+\d]/g, "")}`),
    },
    {
      icon: "mail-outline" as const,
      label: "इमेल",
      value: CONTACT.email,
      onPress: () => Linking.openURL(`mailto:${CONTACT.email}`),
    },
    {
      icon: "globe-outline" as const,
      label: "वेबसाइट",
      value: CONTACT.website.replace("https://", ""),
      onPress: () => Linking.openURL(CONTACT.website),
    },
  ];

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
