import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../../theme/ThemeContext";
import {
  styles,
  TAB_WIDTH,
  TAB_HEIGHT,
  SWEEP_WIDTH,
} from "../styles/bottomTab.styles";

export default function BottomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { currentTheme, isDarkMode, aestheticMode } = useTheme();
  const activeAccent = currentTheme.accent;

  const currentRouteName = state.routes[state.index]?.name;
  const isHome = currentRouteName === "Home";
  const isExplore = currentRouteName === "Explore";
  const isFavorites = currentRouteName === "Favorites";
  const isMinimalist = aestheticMode === "minimalista";
  const prevIndexRef = useRef(state.index);
  const sweepOpacity = useRef(new Animated.Value(0)).current;
  const verticalOpacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-TAB_WIDTH - 200)).current;

  const translateY = useRef(new Animated.Value(TAB_HEIGHT + 200)).current;
  const activeIconTranslateY = useRef(new Animated.Value(0)).current;

  const triggerSweep = (toRight = true) => {
    const fromVal = toRight ? -SWEEP_WIDTH - 50 : TAB_WIDTH + 50;
    const toVal = toRight ? TAB_WIDTH + 50 : -SWEEP_WIDTH - 50;

    translateX.setValue(fromVal);
    sweepOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: toVal,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.sequence([
        Animated.delay(420),
        Animated.timing(sweepOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ]).start(({ finished }) => {
      if (finished) {
        sweepOpacity.setValue(0);
        translateX.setValue(-TAB_WIDTH - 200);
      }
    });
  };

  const triggerVerticalSweep = () => {
    translateY.setValue(TAB_HEIGHT + 30);
    verticalOpacity.setValue(1);
    activeIconTranslateY.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -TAB_HEIGHT - 30,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.sequence([
        Animated.delay(340),
        Animated.timing(verticalOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.sequence([
        Animated.timing(activeIconTranslateY, {
          toValue: -6,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.spring(activeIconTranslateY, {
          toValue: 0,
          friction: 4,
          tension: 120,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ]).start(({ finished }) => {
      if (finished) {
        verticalOpacity.setValue(0);
        translateY.setValue(TAB_HEIGHT + 200);
      }
    });
  };

  useEffect(() => {
    if (prevIndexRef.current !== state.index) {
      const isMovingRight = state.index >= prevIndexRef.current;
      prevIndexRef.current = state.index;
      triggerSweep(isMovingRight);
    }
  }, [state.index]);

  const sweepColors = isDarkMode
    ? [
        "rgba(255, 255, 255, 0)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0.09)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0)",
      ]
    : isMinimalist
    ? [
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0.02)",
        "rgba(0, 0, 0, 0.06)",
        "rgba(0, 0, 0, 0.02)",
        "rgba(0, 0, 0, 0)",
      ]
    : [
        "rgba(255, 255, 255, 0)",
        "rgba(255, 255, 255, 0.04)",
        "rgba(255, 255, 255, 0.16)",
        "rgba(255, 255, 255, 0.04)",
        "rgba(255, 255, 255, 0)",
      ];

  return (
    <View
      style={[
        styles.bottomTab,
        !isMinimalist && styles.bottomTabFloating,
        {
          backgroundColor: isMinimalist
            ? isDarkMode
              ? "#161616"
              : "#F5F5F7"
            : isDarkMode
            ? "rgba(12, 12, 12, 0.82)"
            : isExplore
            ? "rgba(100, 100, 100, 0.82)"
            : "rgba(100, 100, 100, 0.40)",
          height: isMinimalist ? TAB_HEIGHT + insets.bottom : 72,
          paddingBottom: isMinimalist ? insets.bottom : 0,
          borderTopWidth: 0,
          borderTopColor: "transparent",
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const isMovingRight = index >= state.index;
          if (state.index === index) {
            triggerVerticalSweep();
          } else {
            prevIndexRef.current = index;
            triggerSweep(isMovingRight);
          }
          navigation.navigate(route.name);
        };

        let iconName = "home";

        if (route.name === "Explore") {
          iconName = "compass";
        } else if (route.name === "Favorites") {
          iconName = "heart";
        } else if (route.name === "Profile") {
          iconName = "user";
        }

        return (
          <View key={route.key}>
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                !isMinimalist && styles.tabItemFloating,
                isFocused && [
                  styles.activeTab,
                  !isMinimalist && styles.activeTabFloating,
                  isMinimalist
                    ? {
                        borderWidth: 0,
                        borderColor: "transparent",
                        backgroundColor: activeAccent,
                      }
                    : {
                        borderWidth: 1.5,
                        borderColor: activeAccent,
                        backgroundColor: "transparent",
                      },
                ],
              ]}
            >
              <Animated.View
                style={
                  isFocused
                    ? { transform: [{ translateY: activeIconTranslateY }] }
                    : undefined
                }
              >
                <Feather
                  name={iconName}
                  size={!isMinimalist ? 22 : 24}
                  color={
                    !isMinimalist
                      ? isFocused
                        ? activeAccent
                        : "#FFFFFF"
                      : isFocused
                      ? isDarkMode
                        ? "#000000"
                        : "#FFFFFF"
                      : isDarkMode
                      ? "rgba(255, 255, 255, 0.90)"
                      : "rgba(0, 0, 0, 0.85)"
                  }
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        );
      })}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.horizontalSweepContainer,
          {
            opacity: sweepOpacity,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={sweepColors}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.horizontalSweepGradient}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.verticalSweepContainer,
          {
            opacity: verticalOpacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <LinearGradient
          colors={sweepColors}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.verticalSweepGradient}
        />
      </Animated.View>
    </View>
  );
}
