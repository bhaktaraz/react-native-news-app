import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme, spacing } from "../../theme";

export const Logo: React.FC = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../../assets/dk-logo.jpeg")}
      resizeMode="contain"
      style={styles.logoImage}
    />
  </View>
);

interface HeaderButtonProps {
  onPress: () => void;
}

export const MenuButton: React.FC<HeaderButtonProps> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.leftButton}>
      <Ionicons name="menu" size={26} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export const SearchButton: React.FC<HeaderButtonProps> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.rightButton}>
      <Ionicons name="search" size={22} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 116,
    height: 36,
  },
  leftButton: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    paddingRight: spacing.lg,
    paddingLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
