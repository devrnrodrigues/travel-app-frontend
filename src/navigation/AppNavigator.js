import React from "react";
import { Dimensions, Easing } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomTabBar from "./components/BottomTabBar";
import HomeScreen from "../features/home/HomeScreen";
import ExploreScreen from "../features/explore/ExploreScreen";
import FavoritesScreen from "../features/favorites/FavoritesScreen";
import ProfileScreen from "../features/profile/ProfileScreen";
import { useTheme } from "../theme/ThemeContext";
import { styles } from "./styles/bottomTab.styles";

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { isDarkMode } = useTheme();
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      detachInactiveScreens={false}
      sceneContainerStyle={
        isDarkMode ? styles.sceneContainerDark : styles.sceneContainerLight
      }
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyleHidden,
        animation: "shift",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 260,
            easing: Easing.out(Easing.cubic),
          },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-width, 0, width],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        }),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
