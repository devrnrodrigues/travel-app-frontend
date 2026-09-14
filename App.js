import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

import HomeScreen from "./src/features/home/screens/HomeScreen";
import DetailsScreen from "./src/features/destinations/screens/DetailsScreen";
import FlightSearchScreen from "./src/features/flights/screens/FlightSearchScreen";
import ExploreScreen from "./src/features/explore/screens/ExploreScreen";
import FavoritesScreen from "./src/features/favorites/screens/FavoritesScreen";
import GetStartedScreen from "./src/features/onboarding/screens/GetStartedScreen";
import WelcomeScreen from "./src/features/onboarding/screens/WelcomeScreen";
import LoginScreen from "./src/features/auth/screens/LoginScreen";
import RegisterScreen from "./src/features/auth/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

function NavigationStack() {
  const { isDarkMode } = useTheme();
  const themeBg = isDarkMode ? "#000000" : "#FFFFFF";

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: themeBg,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: themeBg },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            animationDuration: 180,
          }}
        />
        <Stack.Screen
          name="DetailsTicket"
          component={FlightSearchScreen}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            animationDuration: 180,
          }}
        />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
