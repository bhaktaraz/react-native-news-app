import React from "react";
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomTabNavigator from "./bottom-tab-navigator";
import DrawerContent from "./drawer-content";
import ContactScreen from "../screens/ContactScreen";
import { useTheme, spacing } from "../theme";

export type DrawerParamList = {
  MainHome: undefined;
  Contact: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const ContactHeaderLeft = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ paddingLeft: spacing.lg, paddingRight: spacing.sm }}
    >
      <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: 296 },
    }}
  >
    <Drawer.Screen name="MainHome" component={BottomTabNavigator} />
    <Drawer.Screen
      name="Contact"
      component={ContactScreen}
      options={({ navigation }) => ({
        headerShown: true,
        title: "सम्पर्क",
        headerLeft: () => <ContactHeaderLeft onPress={() => navigation.goBack()} />,
      })}
    />
  </Drawer.Navigator>
);

export default DrawerNavigator;
