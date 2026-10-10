import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES_BY_CAT, resolveCategoryTheme } from "./categoryThemes";
import { useCategories } from "../features/categories/hooks/useCategories";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeCat, setActiveCat] = useState(0);
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
        const saved = await AsyncStorage.getItem("@app_theme_mode");
        if (saved !== null) {
          setIsDarkMode(JSON.parse(saved));
        }
        const savedAesthetic = await AsyncStorage.getItem("@profile_aesthetic_mode");
        if (savedAesthetic) {
          setAestheticMode(savedAesthetic);
        }
      } catch (e) {
        console.log("Erro ao carregar tema:", e);
      }
    }
    loadThemeMode();
  }, []);

  const toggleThemeMode = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem("@app_theme_mode", JSON.stringify(nextMode));
    } catch (e) {
      console.log("Erro ao salvar tema:", e);
    }
  };

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
    return resolveCategoryTheme(activeCategory, activeCat);
  }, [activeCategory, activeCat]);

  const themesByCat = useMemo(() => {
    const map = { ...THEMES_BY_CAT };
    categories.forEach((cat, index) => {
      map[index] = resolveCategoryTheme(cat, index);
    });
    return map;
  }, [categories]);

  return (
    <ThemeContext.Provider
      value={{
        categories,
        activeCategory,
        activeCat,
        setActiveCat,
        currentTheme,
        themesByCat,
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
