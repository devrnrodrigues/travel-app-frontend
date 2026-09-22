import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { AuthProvider, useAuth } from "./src/features/auth/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import AppSplashScreen from "./src/shared/components/AppSplashScreen";
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

function AppContent({ fontsLoaded }) {
  const { session, hasSeenWelcome, isLoading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  const isReady = Boolean(fontsLoaded && !isLoading);

  if (!splashFinished) {
    return (
      <AppSplashScreen
        isReady={isReady}
        onAnimationEnd={() => setSplashFinished(true)}
      />
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

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent fontsLoaded={fontsLoaded} />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
