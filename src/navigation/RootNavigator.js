import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import GetStartedScreen from "../features/onboarding/screens/GetStartedScreen";
import WelcomeScreen from "../features/onboarding/screens/WelcomeScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";
import DetailsScreen from "../features/destinations/DetailsScreen";
import FlightSearchScreen from "../features/flights/screens/FlightSearchScreen";
import CollectionGalleryScreen from "../features/profile/screens/CollectionGalleryScreen";
import { useTheme } from "../theme/ThemeContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator({ session, hasSeenWelcome }) {
  const { isDarkMode } = useTheme();
  const themeBg = isDarkMode ? "#000000" : "#FFFFFF";

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: themeBg,
    },
  };

  return (
    <NavigationContainer
      key={session ? "authenticated" : "unauthenticated"}
      theme={navigationTheme}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: themeBg },
        }}
      >
        {session ? (
          <>
            {hasSeenWelcome ? (
              <>
                <Stack.Screen name="Main" component={AppNavigator} />
                <Stack.Screen
                  name="Welcome"
                  component={WelcomeScreen}
                  options={{
                    animation: "fade",
                    animationDuration: 200,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={WelcomeScreen}
                  options={{
                    animation: "fade",
                    animationDuration: 200,
                  }}
                />
                <Stack.Screen name="Main" component={AppNavigator} />
              </>
            )}
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
            <Stack.Screen
              name="CollectionGallery"
              component={CollectionGalleryScreen}
              options={{
                animation: "fade",
                animationDuration: 200,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animation: "fade",
                animationDuration: 180,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                animation: "fade",
                animationDuration: 180,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
