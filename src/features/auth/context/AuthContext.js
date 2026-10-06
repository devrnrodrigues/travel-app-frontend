import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  loginApi,
  registerApi,
  loginWithGoogleApi,
  logoutApi,
} from "../api/authService";

const AuthContext = createContext({});

async function checkWelcomeStatus(userId) {
  const userSeen = await AsyncStorage.getItem(`hasSeenWelcome_${userId}`);
  const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
  return userSeen === "true" || globalSeen === "true";
}

async function persistAuthTokensAndUser(data) {
  const userData = data.user;
  await AsyncStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
  }
  await AsyncStorage.setItem("currentUser", JSON.stringify(userData));
  return userData;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        const storedUserJson = await AsyncStorage.getItem("currentUser");

        if (storedToken && storedUserJson) {
          const parsedUser = JSON.parse(storedUserJson);
          setUser(parsedUser);
          setSession({ user: parsedUser, accessToken: storedToken });

          const seen = await checkWelcomeStatus(parsedUser.id);
          setHasSeenWelcome(seen);
        } else {
          setUser(null);
          setSession(null);
          setHasSeenWelcome(false);
        }
      } catch {
        setUser(null);
        setSession(null);
        setHasSeenWelcome(false);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(
    async (email, password) => {
      queryClient.clear();
      const data = await loginApi(email, password);
      const userData = await persistAuthTokensAndUser(data);

      setUser(userData);
      setSession({
        user: userData,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      const seen = await checkWelcomeStatus(userData.id);
      setHasSeenWelcome(seen);

      return data;
    },
    [queryClient]
  );

  const register = useCallback(
    async ({ fullName, email, password }) => {
      queryClient.clear();
      const data = await registerApi({ fullName, email, password });
      const userData = await persistAuthTokensAndUser(data);

      setUser(userData);
      setSession({
        user: userData,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      const seen = await checkWelcomeStatus(userData.id);
      setHasSeenWelcome(seen);

      return data;
    },
    [queryClient]
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      queryClient.clear();
      const data = await loginWithGoogleApi(idToken);
      const userData = await persistAuthTokensAndUser(data);

      setUser(userData);
      setSession({
        user: userData,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      const seen = await checkWelcomeStatus(userData.id);
      setHasSeenWelcome(seen);

      return data;
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch {}

    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
    await logoutApi(storedRefreshToken);

    await AsyncStorage.multiRemove([
      "accessToken",
      "refreshToken",
      "currentUser",
      "@profile_gallery_count",
    ]);

    queryClient.clear();

    setUser(null);
    setSession(null);
    setHasSeenWelcome(false);
  }, [queryClient]);

  const updateUser = useCallback(async (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      AsyncStorage.setItem("currentUser", JSON.stringify(updated));
      return updated;
    });
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        user: { ...prev.user, ...newUserData },
      };
    });
  }, []);

  const markWelcomeSeen = useCallback(async () => {
    setHasSeenWelcome(true);
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    if (user?.id) {
      await AsyncStorage.setItem(`hasSeenWelcome_${user.id}`, "true");
    }
  }, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      session,
      isLoading,
      hasSeenWelcome,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUser,
      markWelcomeSeen,
    }),
    [
      user,
      session,
      isLoading,
      hasSeenWelcome,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUser,
      markWelcomeSeen,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
