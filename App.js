import React from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { AuthProvider, useAuth } from "./src/features/auth/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { styles } from "./src/navigation/styles/bottomTab.styles";

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
  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
