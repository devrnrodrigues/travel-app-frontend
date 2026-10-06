import { useRef, useEffect, useCallback } from "react";
import { Animated, BackHandler, Easing } from "react-native";

export function useFlightSearchAnimation({
  onlyDirect,
  isDarkMode,
  currentTheme,
  navigation,
  searchSubmitted,
  setSearchSubmitted,
  destinationModalVisible,
  setDestinationModalVisible,
  classModalVisible,
  setClassModalVisible,
  currencyModalVisible,
  setCurrencyModalVisible,
  calendarModalVisible,
  setCalendarModalVisible,
  sortModalVisible,
  setSortModalVisible,
  childAgeModalVisible,
  setChildAgeModalVisible,
}) {
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const directAnim = useRef(new Animated.Value(0)).current;
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
    Animated.timing(directAnim, {
      toValue: onlyDirect ? 1 : 0,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [onlyDirect, directAnim]);

  const switchTrackBg = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      !isDarkMode ? "#E5E7EB" : "#27272A",
      currentTheme.accent,
    ],
  });

  const switchThumbTranslate = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const switchThumbBg = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      !isDarkMode ? "#FFFFFF" : "#A1A1AA",
      "#000000",
    ],
  });

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
      if (destinationModalVisible) {
        setDestinationModalVisible(false);
        return true;
      }
      if (classModalVisible) {
        setClassModalVisible(false);
        return true;
      }
      if (currencyModalVisible) {
        setCurrencyModalVisible(false);
        return true;
      }
      if (calendarModalVisible) {
        setCalendarModalVisible(false);
        return true;
      }
      if (sortModalVisible) {
        setSortModalVisible(false);
        return true;
      }
      if (childAgeModalVisible) {
        setChildAgeModalVisible(false);
        return true;
      }
      if (searchSubmitted) {
        setSearchSubmitted(false);
        return true;
      }
      handleGoBack();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [
    searchSubmitted,
    destinationModalVisible,
    classModalVisible,
    currencyModalVisible,
    calendarModalVisible,
    sortModalVisible,
    childAgeModalVisible,
    setSearchSubmitted,
    setDestinationModalVisible,
    setClassModalVisible,
    setCurrencyModalVisible,
    setCalendarModalVisible,
    setSortModalVisible,
    setChildAgeModalVisible,
    handleGoBack,
  ]);

  return {
    screenFadeAnim,
    switchTrackBg,
    switchThumbTranslate,
    switchThumbBg,
    handleGoBack,
  };
}
