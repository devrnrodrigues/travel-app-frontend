import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing, BackHandler } from "react-native";

export function useDestinationThemeAnimations(isDarkMode, navigation, isModalOpen, onCloseModal) {
  const themeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const iconRotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const isExitingRef = useRef(false);

  useEffect(() => {
    Animated.timing(screenFadeAnim, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [screenFadeAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(themeAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 380,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(iconRotateAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode, themeAnim, iconRotateAnim]);

  const handleGoBack = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Main");
      }
    });
  }, [navigation, screenFadeAnim]);

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
    screenFadeAnim,
    infoSectionBg,
    statCardBg,
    footerPriceBg,
    handleGoBack,
  };
}

export default useDestinationThemeAnimations;
