import React, { Component } from "react";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RadioScreen from "../screens/RadioScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import CategoryScreen from "../screens/CategoryScreen";
import TagScreen from "../screens/TagScreen";
import ArticleListByTagScreen from "../screens/ArticleListByTagScreen";
import ArticleListByCategoryScreen from "../screens/ArticleListByCategoryScreen";

//Add navigators with screens in this file
export const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  ArticleDetail: { screen: ArticleDetailScreen, navigationOptions: { title: 'समाचार विस्तारमा'} },
  ArticleListByTag: { screen: ArticleListByTagScreen, navigationOptions: { title: 'समाचार'} },
  ArticleListByCategory: { screen: ArticleListByCategoryScreen, navigationOptions: { title: 'समाचार'} }
});

export const SettingsNavigator = createStackNavigator({
  Settings: { screen: SettingsScreen }
});

export const RadioNavigator = createStackNavigator({
  Radio: { screen: RadioScreen }
});

// export const ProfileNavigator = createStackNavigator({
//   Profile: { screen: ProfileScreen }
// });

// export const SearchNavigator = createStackNavigator({
//   Search: { screen: SearchScreen }
// });

export const ArticleDetailNavigator = createStackNavigator({
  ArticleDetail: { screen: ArticleDetailScreen }
});

export const CategoryNavigator = createStackNavigator({
  Category: { screen: CategoryScreen }
});

export const TagNavigator = createStackNavigator({
  Tag: { screen: TagScreen }
});

export const ArticleListByTagNavigator = createStackNavigator({
  ArticleListByTag: { screen: ArticleListByTagScreen }
});

export const ArticleListByCategoryNavigator = createStackNavigator({
  ArticleListByCategory: { screen: ArticleListByCategoryScreen }
});