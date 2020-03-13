import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from 'react-navigation';
import BottomTabNavigator from "./bottom-tab-navigator";
import { SettingsNavigator, RadioNavigator } from "./screen-stack-navigators";

const DrawerNavigator = createDrawerNavigator({
  /*To have a header on the drawer screens, 
        there must be a navigator that includes the screen you want to add to the drawer navigator.
        See 'screen-stack-navigator' file*/
  Home: BottomTabNavigator,
  Radio: RadioNavigator,
  // Settings: SettingsNavigator,
});

const Drawer = createAppContainer(DrawerNavigator);

export default Drawer;
