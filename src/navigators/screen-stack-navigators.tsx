import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SavedScreen from "../screens/SavedScreen";
import CategoryScreen from "../screens/CategoryScreen";
import TagScreen from "../screens/TagScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import ArticleListByTagScreen from "../screens/ArticleListByTagScreen";
import ArticleListByCategoryScreen from "../screens/ArticleListByCategoryScreen";
import { Logo, MenuButton, SearchButton } from "../components/header/header";
import { useTheme, typography } from "../theme";

export type NewsStackParamList = {
  Home: undefined;
  Search: undefined;
  Saved: undefined;
  Category: undefined;
  Tag: undefined;
  ArticleDetail: { id: number | string };
  ArticleListByTag: { id: number | string; name?: string };
  ArticleListByCategory: { id: number | string; name?: string };
};

const Stack = createStackNavigator<NewsStackParamList>();

/** Screens every stack shares, so a category opened from the drawer, the chips
 *  row or a tag all land on the same detail screen inside the current tab. */
const sharedScreens = (
  <>
    <Stack.Screen
      name="ArticleDetail"
      component={ArticleDetailScreen}
      options={{ title: "समाचार" }}
    />
    <Stack.Screen
      name="ArticleListByCategory"
      component={ArticleListByCategoryScreen}
      options={{ title: "समाचार" }}
    />
    <Stack.Screen
      name="ArticleListByTag"
      component={ArticleListByTagScreen}
      options={{ title: "समाचार" }}
    />
  </>
);

const useStackScreenOptions = () => {
  const theme = useTheme();

  return ({ navigation }: any) => ({
    headerLeft: () => <MenuButton onPress={() => navigation.getParent()?.openDrawer()} />,
    headerTitle: () => <Logo />,
    headerTitleAlign: "center" as const,
    headerStyle: {
      backgroundColor: theme.colors.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      ...typography.title,
      color: theme.colors.text,
    },
    cardStyle: { backgroundColor: theme.colors.background },
  });
};

export const HomeNavigator = () => {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <SearchButton onPress={() => navigation.navigate("Search" as never)} />
          ),
        })}
      />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: "खोज्नुहोस्" }} />
      {sharedScreens}
    </Stack.Navigator>
  );
};

export const SearchNavigator = () => {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Search" component={SearchScreen} />
      {sharedScreens}
    </Stack.Navigator>
  );
};

export const CategoryNavigator = () => {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Category" component={CategoryScreen} />
      {sharedScreens}
    </Stack.Navigator>
  );
};

export const TagNavigator = () => {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Tag" component={TagScreen} />
      {sharedScreens}
    </Stack.Navigator>
  );
};

export const SavedNavigator = () => {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Saved" component={SavedScreen} />
      {sharedScreens}
    </Stack.Navigator>
  );
};
