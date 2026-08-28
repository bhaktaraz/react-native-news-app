import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./bottom-tab-navigator";
import DrawerContent from "./drawer-content";

export type DrawerParamList = {
  MainHome: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: 296 },
    }}
  >
    <Drawer.Screen name="MainHome" component={BottomTabNavigator} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
