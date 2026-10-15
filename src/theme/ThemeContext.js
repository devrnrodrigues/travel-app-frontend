import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES_BY_CAT, resolveCategoryTheme } from "./categoryThemes";
import { useCategories } from "../features/categories/hooks/useCategories";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [activeCat, setActiveCat] = useState(0);
  const [themePreference, setThemePreference] = useState("dark");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aestheticMode, setAestheticMode] = useState("minimalista");
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useCategories();

  useEffect(() => {
    async function loadThemeMode() {
      try {
        const savedPref = await AsyncStorage.getItem("@app_theme_preference");
        const savedMode = await AsyncStorage.getItem("@app_theme_mode");
        const savedAesthetic = await AsyncStorage.getItem("@profile_aesthetic_mode");

        let pref = "dark";
        if (savedPref !== null) {
          pref = savedPref;
        } else if (savedMode !== null) {
          pref = JSON.parse(savedMode) ? "dark" : "light";
        }

        setThemePreference(pref);
        if (pref === "auto") {
          setIsDarkMode(systemColorScheme === "dark");
        } else {
          setIsDarkMode(pref === "dark");
        }

        if (savedAesthetic) {
          setAestheticMode(savedAesthetic);
        }
      } catch (e) {
        console.log("Erro ao carregar tema:", e);
      }
    }
    loadThemeMode();
  }, []);

  useEffect(() => {
    if (themePreference === "auto") {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, themePreference]);

  const updateThemePreference = useCallback(
    async (pref) => {
      try {
        setThemePreference(pref);
        const resolvedIsDark = pref === "auto" ? systemColorScheme === "dark" : pref === "dark";
        setIsDarkMode(resolvedIsDark);
        await AsyncStorage.setItem("@app_theme_preference", pref);
        await AsyncStorage.setItem("@app_theme_mode", JSON.stringify(resolvedIsDark));
      } catch (e) {
        console.log("Erro ao salvar tema:", e);
      }
    },
    [systemColorScheme]
  );

  const toggleThemeMode = useCallback(async () => {
    const nextPref = isDarkMode ? "light" : "dark";
    await updateThemePreference(nextPref);
  }, [isDarkMode, updateThemePreference]);

  const updateAestheticMode = async (mode) => {
    try {
      setAestheticMode(mode);
      await AsyncStorage.setItem("@profile_aesthetic_mode", mode);
    } catch (e) {
      console.log("Erro ao salvar modo estetico:", e);
    }
  };

  const activeCategory = categories[activeCat] || categories[0] || null;

  const currentTheme = useMemo(() => {
    const baseTheme = resolveCategoryTheme(activeCategory, activeCat);
    if (aestheticMode === "minimalista") {
      const minimalistAccent = isDarkMode ? "#FFFFFF" : "#111111";
      return {
        ...baseTheme,
        accent: minimalistAccent,
      };
    }
    return baseTheme;
  }, [activeCategory, activeCat, aestheticMode, isDarkMode]);

  const themesByCat = useMemo(() => {
    const map = { ...THEMES_BY_CAT };
    const minimalistAccent = isDarkMode ? "#FFFFFF" : "#111111";
    categories.forEach((cat, index) => {
      const baseTheme = resolveCategoryTheme(cat, index);
      if (aestheticMode === "minimalista") {
        map[index] = {
          ...baseTheme,
          accent: minimalistAccent,
        };
      } else {
        map[index] = baseTheme;
      }
    });
    return map;
  }, [categories, aestheticMode, isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        categories,
        activeCategory,
        activeCat,
        setActiveCat,
        currentTheme,
        themesByCat,
        themePreference,
        setThemePreference: updateThemePreference,
        isDarkMode,
        setIsDarkMode,
        toggleThemeMode,
        aestheticMode,
        setAestheticMode: updateAestheticMode,
        isLoadingCategories,
        isCategoriesError,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      categories: [],
      activeCategory: null,
      activeCat: 0,
      setActiveCat: () => {},
      currentTheme: THEMES_BY_CAT[0],
      themesByCat: THEMES_BY_CAT,
      themePreference: "dark",
      setThemePreference: () => {},
      isDarkMode: true,
      setIsDarkMode: () => {},
      toggleThemeMode: () => {},
      aestheticMode: "minimalista",
      setAestheticMode: () => {},
      isLoadingCategories: false,
      isCategoriesError: false,
    };
  }
  return context;
}

export { THEMES_BY_CAT, resolveCategoryTheme };
