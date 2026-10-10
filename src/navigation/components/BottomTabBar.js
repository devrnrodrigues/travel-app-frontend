import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  DeviceEventEmitter,
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
  const isTranslucentTab = !isMinimalist && (isHome || isExplore);

  const exploreRoute = state.routes.find((r) => r.name === "Explore");
  const [isExploreSearchVisible, setIsExploreSearchVisible] = useState(
    exploreRoute?.params?.isSearchBarVisible !== false
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      "exploreSearchBarVisible",
      (visible) => {
        setIsExploreSearchVisible(visible);
      }
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isExplore) {
      const currentParam = state.routes[state.index]?.params?.isSearchBarVisible;
      if (typeof currentParam === "boolean") {
        setIsExploreSearchVisible(currentParam);
      }
    }
  }, [isExplore, state.index]);

  const exploreAnim = useRef(
    new Animated.Value(exploreRoute?.params?.isSearchBarVisible !== false ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(exploreAnim, {
      toValue: isExploreSearchVisible ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isExploreSearchVisible]);



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
    : [
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0.02)",
        "rgba(0, 0, 0, 0.06)",
        "rgba(0, 0, 0, 0.02)",
        "rgba(0, 0, 0, 0)",
      ];

  return (
    <View
      style={[
        styles.bottomTab,
        {
          backgroundColor: isMinimalist
            ? isDarkMode
              ? "#141414"
              : "#F5F5F7"
            : isTranslucentTab
            ? "transparent"
            : isDarkMode
            ? "#000000"
            : isFavorites
            ? "rgba(100, 100, 100, 1)"
            : "#FFFFFF",
          height: TAB_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
          borderTopColor: "transparent",
        },
      ]}
    >
      {isTranslucentTab && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {Platform.OS !== "android" && !isDarkMode && isExplore && (
            <BlurView
              intensity={20}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          )}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDarkMode
                  ? "rgba(0, 0, 0, 0.82)"
                  : "rgba(100, 100, 100, 0.80)",
              },
            ]}
          />
        </View>
      )}
      {!isMinimalist && isExplore && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkMode ? "#000000" : "rgba(100, 100, 100, 1)",
              opacity: exploreAnim,
            },
          ]}
        />
      )}
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
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
              styles.tabItem,
              isFocused && [
                styles.activeTab,
                {
                  borderWidth: 0,
                  borderColor: "transparent",
                  backgroundColor: activeAccent,
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
                size={24}
                color={
                  isFocused
                    ? "#FFFFFF"
                    : isDarkMode
                    ? "#FFFFFF"
                    : isMinimalist
                    ? "#000000"
                    : isHome || isFavorites || isExplore
                    ? "#FFFFFF"
                    : "#000000"
                }
              />
            </Animated.View>
          </TouchableOpacity>
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
