import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi, loginWithGoogleApi, logoutApi } from "../api/authService";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
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

          const userSeen = await AsyncStorage.getItem(`hasSeenWelcome_${parsedUser.id}`);
          const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
          setHasSeenWelcome(userSeen === "true" || globalSeen === "true");
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

  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password);
    const userData = data.user;

    await AsyncStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
    }
    await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

    setUser(userData);
    setSession({ user: userData, accessToken: data.accessToken, refreshToken: data.refreshToken });

    const userSeen = await AsyncStorage.getItem(`hasSeenWelcome_${userData.id}`);
    const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
    setHasSeenWelcome(userSeen === "true" || globalSeen === "true");

    return data;
  }, []);

  const register = useCallback(async ({ fullName, email, password }) => {
    const data = await registerApi({ fullName, email, password });
    const userData = data.user;

    await AsyncStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
    }
    await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

    setUser(userData);
    setSession({ user: userData, accessToken: data.accessToken, refreshToken: data.refreshToken });

    const userSeen = await AsyncStorage.getItem(`hasSeenWelcome_${userData.id}`);
    const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
    setHasSeenWelcome(userSeen === "true" || globalSeen === "true");

    return data;
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    const data = await loginWithGoogleApi(idToken);
    const userData = data.user;

    await AsyncStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
    }
    await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

    setUser(userData);
    setSession({ user: userData, accessToken: data.accessToken, refreshToken: data.refreshToken });

    const userSeen = await AsyncStorage.getItem(`hasSeenWelcome_${userData.id}`);
    const globalSeen = await AsyncStorage.getItem("hasSeenWelcome");
    setHasSeenWelcome(userSeen === "true" || globalSeen === "true");

    return data;
  }, []);

  const logout = useCallback(async () => {
    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
    await logoutApi(storedRefreshToken);

    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "currentUser"]);

    setUser(null);
    setSession(null);
    setHasSeenWelcome(false);
  }, []);

  const updateUser = useCallback(async (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      AsyncStorage.setItem("currentUser", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markWelcomeSeen = useCallback(async () => {
    setHasSeenWelcome(true);
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    if (user?.id) {
      await AsyncStorage.setItem(`hasSeenWelcome_${user.id}`, "true");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
