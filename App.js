/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ArticleDetail from './src/screens/ArticleDetail';
import BreakingNews from "./src/screens/BreakingNews";
import LatestNews from "./src/screens/LatestNews";
import FeaturedNews from "./src/screens/FeaturedNews";
import Categories from "./src/screens/Categories";
import TrendingTags from "./src/screens/TrendingTags";
import blue from './src/styles/blue'

const HomeNavigator = createMaterialTopTabNavigator(
  {
      LatestNews: { screen: LatestNews },
      BreakingNews: { screen: BreakingNews },
      FeaturedNews: { screen: FeaturedNews },
      // Categories: { screen: Categories },
      // TrendingTags: { screen: TrendingTags },
  },
  {
      tabBarOptions: {
          style: { backgroundColor: "#fff" },
          activeTintColor: blue[500],
          inactiveTintColor: "#000",
          indicatorStyle: {
              backgroundColor: blue[500]
          }
      }
  }
);

const AppNavigator = createStackNavigator({
      HomeScreen: { screen: HomeNavigator },
      BreakingNewsScreen: { screen: BreakingNews },
      LatestNewsScreen: { screen: LatestNews },
      FeaturedNewsScreen: { screen: FeaturedNews },
      CategoriesScreen: { screen: Categories },
      TrendingTagsScreen: { screen: TrendingTags },
      ArticleDetailScreen: { screen: ArticleDetail }
  }
);

const App = createAppContainer(AppNavigator);

export default App;

