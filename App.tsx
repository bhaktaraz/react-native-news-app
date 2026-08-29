import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme as NavTheme,
} from "@react-navigation/native";
import DrawerNavigator from "./src/navigators/drawer-navigator";
import { ThemeProvider, useTheme } from "./src/theme";

/** Bridges the app's tokens into React Navigation so screen transitions and
 *  card backgrounds match the active theme instead of flashing white. */
const Root: React.FC = () => {
  const theme = useTheme();

  const navigationTheme: NavTheme = {
    ...(theme.dark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.dark ? DarkTheme : DefaultTheme).colors,
      primary: theme.colors.brand,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <NavigationContainer theme={navigationTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
};

const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
