import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES_BY_CAT } from "./categoryThemes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeCat, setActiveCat] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    async function loadThemeMode() {
      try {
        const saved = await AsyncStorage.getItem("@app_theme_mode");
        if (saved !== null) {
          setIsDarkMode(JSON.parse(saved));
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

  const currentTheme = THEMES_BY_CAT[activeCat] || THEMES_BY_CAT[0];

  return (
    <ThemeContext.Provider
      value={{
        activeCat,
        setActiveCat,
        currentTheme,
        themesByCat: THEMES_BY_CAT,
        isDarkMode,
        setIsDarkMode,
        toggleThemeMode,
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
      activeCat: 0,
      setActiveCat: () => {},
      currentTheme: THEMES_BY_CAT[0],
      themesByCat: THEMES_BY_CAT,
      isDarkMode: true,
      setIsDarkMode: () => {},
      toggleThemeMode: () => {},
    };
  }
  return context;
}

export { THEMES_BY_CAT };
