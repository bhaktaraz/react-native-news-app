import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  CategoryNavigator,
  HomeNavigator,
  SavedNavigator,
  SearchNavigator,
  TagNavigator,
} from "./screen-stack-navigators";
import { useTheme } from "../theme";

export type BottomTabParamList = {
  HomeTab: undefined;
  CategoryTab: undefined;
  SearchTab: undefined;
  TagTab: undefined;
  SavedTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ICONS: Record<keyof BottomTabParamList, [string, string]> = {
  HomeTab: ["home", "home-outline"],
  CategoryTab: ["grid", "grid-outline"],
  SearchTab: ["search", "search-outline"],
  TagTab: ["flame", "flame-outline"],
  SavedTab: ["bookmark", "bookmark-outline"],
};

/** First screen of each tab's stack. */
const TAB_ROOTS: Record<keyof BottomTabParamList, string> = {
  HomeTab: "Home",
  CategoryTab: "Category",
  SearchTab: "Search",
  TagTab: "Tag",
  SavedTab: "Saved",
};

const BottomTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenListeners={({ navigation, route }) => ({
        tabPress: (event) => {
          if (!navigation.isFocused()) {
            return;
          }

          // Pressing the tab you are already on is a no-op in bottom-tabs v6,
          // which strands the reader on an article when they tap "गृहपृष्ठ" to
          // get back to the feed. Re-navigating to the stack's root pops the
          // article (or category listing) off instead.
          event.preventDefault();
          navigation.navigate(route.name as never, {
            screen: TAB_ROOTS[route.name as keyof BottomTabParamList],
          } as never);
        },
      })}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICONS[route.name as keyof BottomTabParamList];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ tabBarLabel: "गृहपृष्ठ" }} />
      <Tab.Screen
        name="CategoryTab"
        component={CategoryNavigator}
        options={{ tabBarLabel: "वर्ग" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchNavigator}
        options={{ tabBarLabel: "खोज" }}
      />
      <Tab.Screen name="TagTab" component={TagNavigator} options={{ tabBarLabel: "ट्रेन्डिङ" }} />
      <Tab.Screen name="SavedTab" component={SavedNavigator} options={{ tabBarLabel: "सेभ" }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
