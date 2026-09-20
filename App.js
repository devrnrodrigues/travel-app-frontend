import React from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { AuthProvider, useAuth } from "./src/features/auth/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { styles } from "./src/navigation/styles/bottomTab.styles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { session, hasSeenWelcome, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#249689" />
      </View>
    );
  }

  return <RootNavigator session={session} hasSeenWelcome={hasSeenWelcome} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Caveat-SemiBold": require("./assets/fonts/Caveat-SemiBold.ttf"),
    "Caveat-Bold": require("./assets/fonts/Caveat-Bold.ttf"),
    "Caveat": require("./assets/fonts/Caveat-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#249689" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
