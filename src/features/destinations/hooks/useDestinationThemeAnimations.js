import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing, BackHandler, Dimensions } from "react-native";

const SCREEN_HEIGHT = Math.max(Dimensions.get("screen").height, Dimensions.get("window").height) + 100;

export function useDestinationThemeAnimations(isDarkMode, navigation, isModalOpen, onCloseModal) {
  const themeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const iconRotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const screenSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const isExitingRef = useRef(false);

  useEffect(() => {
    Animated.timing(screenSlideAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screenSlideAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(themeAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 180,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(iconRotateAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode, themeAnim, iconRotateAnim]);

  const handleGoBack = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    Animated.timing(screenSlideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Main");
      }
    });
  }, [navigation, screenSlideAnim]);

  useEffect(() => {
    const onBackPress = () => {
      if (isModalOpen) {
        if (onCloseModal) {
          onCloseModal();
        }
        return true;
      }
      handleGoBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [isModalOpen, onCloseModal, handleGoBack]);

  const infoSectionBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#080808"],
  });

  const statCardBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F8F9FA", "#161616"],
  });

  const footerPriceBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#0A0A0A"],
  });

  return {
    screenSlideAnim,
    infoSectionBg,
    statCardBg,
    footerPriceBg,
    handleGoBack,
  };
}

export default useDestinationThemeAnimations;
