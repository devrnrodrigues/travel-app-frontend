import { useRef, useEffect, useCallback } from "react";
import { Animated, BackHandler, Easing, Dimensions } from "react-native";

const SCREEN_WIDTH = Math.max(Dimensions.get("screen").width, Dimensions.get("window").width) + 80;

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
  const screenSlideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const resultsSlideAnim = useRef(new Animated.Value(0)).current;
  const directAnim = useRef(new Animated.Value(0)).current;
  const isExitingRef = useRef(false);
  const isReturningFromResultsRef = useRef(false);

  useEffect(() => {
    Animated.timing(screenSlideAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screenSlideAnim]);

  useEffect(() => {
    if (searchSubmitted) {
      resultsSlideAnim.setValue(0);
    }
  }, [searchSubmitted, resultsSlideAnim]);

  useEffect(() => {
    Animated.timing(directAnim, {
      toValue: onlyDirect ? 1 : 0,
      duration: 100,
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
    Animated.timing(screenSlideAnim, {
      toValue: SCREEN_WIDTH,
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

  const handleBackFromResults = useCallback(() => {
    if (isReturningFromResultsRef.current) return;
    isReturningFromResultsRef.current = true;
    Animated.timing(resultsSlideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSearchSubmitted(false);
      isReturningFromResultsRef.current = false;
    });
  }, [resultsSlideAnim, setSearchSubmitted]);

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
        handleBackFromResults();
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
    handleBackFromResults,
    handleGoBack,
  ]);

  return {
    screenSlideAnim,
    resultsSlideAnim,
    switchTrackBg,
    switchThumbTranslate,
    switchThumbBg,
    handleGoBack,
    handleBackFromResults,
  };
}
