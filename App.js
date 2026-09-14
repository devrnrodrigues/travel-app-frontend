import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/config/supabase";
import { ThemeProvider } from "./src/theme/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { styles } from "./src/navigation/styles/bottomTab.styles";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthState() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Auth getSession error, cleaning stale session:", error.message);
          await supabase.auth.signOut().catch(() => {});
          if (isMounted) {
            setSession(null);
            setHasSeenWelcome(false);
          }
        } else if (isMounted && data?.session) {
          setSession(data.session);
          setHasSeenWelcome(true);
        }
      } catch (err) {
        console.warn("Auth check finished with fallback:", err.message || err);
        if (isMounted) {
          setSession(null);
          setHasSeenWelcome(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        if (event === "SIGNED_OUT" || !currentSession) {
          setHasSeenWelcome(false);
        } else if (currentSession?.user?.id) {
          const userSeen = await AsyncStorage.getItem(
            `hasSeenWelcome_${currentSession.user.id}`
          );
          const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
          if (userSeen === "true" || globalSeen === "true") {
            setHasSeenWelcome(true);
          } else {
            setHasSeenWelcome(false);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#249689" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator session={session} hasSeenWelcome={hasSeenWelcome} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
