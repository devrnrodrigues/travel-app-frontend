import React, { memo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/profile.styles";

const HIT_SLOP_8 = { top: 8, bottom: 8, left: 8, right: 8 };

const THEME_OPTIONS = [
  { key: "auto", label: "Automático", icon: "hardware-chip-outline" },
  { key: "light", label: "Claro", icon: "sunny-outline" },
  { key: "dark", label: "Escuro", icon: "moon-outline" },
];

const AESTHETIC_OPTIONS = [
  {
    key: "minimalista",
    label: "Minimalista",
    icon: "shapes-outline",
  },
  {
    key: "decorativa",
    label: "Decorativa",
    icon: "color-palette-outline",
  },
];

const ThemeModal = memo(function ThemeModal({
  visible,
  onClose,
  isDarkMode,
  currentTheme,
  themePreference = "dark",
  onThemePreferenceChange,
  aestheticMode = "minimalista",
  onAestheticModeChange,
}) {
  const [loadingKey, setLoadingKey] = useState(null);
  const [optimisticTheme, setOptimisticTheme] = useState(themePreference);
  const [optimisticAesthetic, setOptimisticAesthetic] = useState(aestheticMode);

  useEffect(() => {
    setOptimisticTheme(themePreference);
  }, [themePreference]);

  useEffect(() => {
    setOptimisticAesthetic(aestheticMode);
  }, [aestheticMode]);

  const handleSelectTheme = useCallback(
    (key) => {
      if (optimisticTheme === key || loadingKey) return;
      setOptimisticTheme(key);
      setLoadingKey(`theme-${key}`);

      requestAnimationFrame(() => {
        setTimeout(async () => {
          try {
            if (onThemePreferenceChange) {
              await onThemePreferenceChange(key);
            }
          } finally {
            setTimeout(() => {
              setLoadingKey(null);
            }, 350);
          }
        }, 16);
      });
    },
    [optimisticTheme, loadingKey, onThemePreferenceChange]
  );

  const handleSelectAesthetic = useCallback(
    (key) => {
      if (optimisticAesthetic === key || loadingKey) return;
      setOptimisticAesthetic(key);
      setLoadingKey(`aesthetic-${key}`);

      requestAnimationFrame(() => {
        setTimeout(async () => {
          try {
            if (onAestheticModeChange) {
              await onAestheticModeChange(key);
            }
          } finally {
            setTimeout(() => {
              setLoadingKey(null);
            }, 350);
          }
        }, 16);
      });
    },
    [optimisticAesthetic, loadingKey, onAestheticModeChange]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.themeModalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.themeModalCard,
            !isDarkMode && styles.themeModalCardLight,
          ]}
        >
          <View style={styles.themeModalHeader}>
            <Text
              style={[
                styles.themeModalTitle,
                !isDarkMode && styles.themeModalTitleLight,
              ]}
            >
              Tema e aparência
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={HIT_SLOP_8}
              style={styles.themeModalCloseBtn}
            >
              <Ionicons
                name="close"
                size={20}
                color={!isDarkMode ? "#000000" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.themeModalSectionTitle,
              !isDarkMode && styles.themeModalSectionTitleLight,
            ]}
          >
            Escolha um tema
          </Text>

          <View style={styles.themeAestheticList}>
            {THEME_OPTIONS.map((opt) => {
              const isSelected = (optimisticTheme || themePreference) === opt.key;
              const isLoading = loadingKey === `theme-${opt.key}`;
              return (
                <TouchableOpacity
                  key={opt.key}
                  disabled={loadingKey !== null}
                  style={[
                    styles.aestheticOptionRow,
                    !isDarkMode && styles.aestheticOptionRowLight,
                    isSelected && {
                      borderColor: currentTheme.accent,
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    isLoading && {
                      borderColor: currentTheme.accent,
                      opacity: 0.85,
                    },
                  ]}
                  activeOpacity={0.7}
                  delayPressIn={0}
                  onPress={() => handleSelectTheme(opt.key)}
                >
                  <View style={styles.aestheticOptionRowLeft}>
                    <View style={styles.aestheticOptionRowIconBox}>
                      <Ionicons
                        name={opt.icon}
                        size={17}
                        color={
                          isSelected || isLoading
                            ? currentTheme.accent
                            : !isDarkMode
                            ? "#333333"
                            : "#CCCCCC"
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.aestheticOptionRowLabel,
                        !isDarkMode && styles.aestheticOptionRowLabelLight,
                        (isSelected || isLoading) && {
                          color: currentTheme.accent,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={currentTheme.accent}
                    />
                  ) : isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={currentTheme.accent}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text
            style={[
              styles.themeModalSectionTitle,
              !isDarkMode && styles.themeModalSectionTitleLight,
              styles.themeModalSectionTitleMarginTop,
            ]}
          >
            Estética visual
          </Text>

          <View style={styles.themeAestheticList}>
            {AESTHETIC_OPTIONS.map((opt) => {
              const isSelected = (optimisticAesthetic || aestheticMode) === opt.key;
              const isLoading = loadingKey === `aesthetic-${opt.key}`;
              return (
                <TouchableOpacity
                  key={opt.key}
                  disabled={loadingKey !== null}
                  style={[
                    styles.aestheticOptionRow,
                    !isDarkMode && styles.aestheticOptionRowLight,
                    isSelected && {
                      borderColor: currentTheme.accent,
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.06)",
                    },
                    isLoading && {
                      borderColor: currentTheme.accent,
                      opacity: 0.85,
                    },
                  ]}
                  activeOpacity={0.7}
                  delayPressIn={0}
                  onPress={() => handleSelectAesthetic(opt.key)}
                >
                  <View style={styles.aestheticOptionRowLeft}>
                    <View style={styles.aestheticOptionRowIconBox}>
                      <Ionicons
                        name={opt.icon}
                        size={17}
                        color={
                          isSelected || isLoading
                            ? currentTheme.accent
                            : !isDarkMode
                            ? "#333333"
                            : "#CCCCCC"
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.aestheticOptionRowLabel,
                        !isDarkMode && styles.aestheticOptionRowLabelLight,
                        (isSelected || isLoading) && {
                          color: currentTheme.accent,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={currentTheme.accent}
                    />
                  ) : isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={currentTheme.accent}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default ThemeModal;
