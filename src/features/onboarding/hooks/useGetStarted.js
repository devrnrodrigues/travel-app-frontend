import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useGetStarted(navigation) {
  const bgScale = useRef(new Animated.Value(1.16)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(28)).current;
  const titleScale = useRef(new Animated.Value(0.92)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(18)).current;

  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgScale, {
        toValue: 1.06,
        duration: 1300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.delay(140),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 750,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 750,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.sequence([
        Animated.delay(260),
        Animated.parallel([
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(buttonsTranslateY, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [
    bgScale,
    titleOpacity,
    titleTranslateY,
    titleScale,
    taglineOpacity,
    taglineTranslateY,
    buttonsOpacity,
    buttonsTranslateY,
  ]);

  const handleRegister = useCallback(async () => {
    await AsyncStorage.setItem("hasSeenGetStarted", "true");
    navigation.navigate("Register");
  }, [navigation]);

  const handleLogin = useCallback(async () => {
    await AsyncStorage.setItem("hasSeenGetStarted", "true");
    navigation.navigate("Login");
  }, [navigation]);

  return {
    bgScale,
    titleOpacity,
    titleTranslateY,
    titleScale,
    taglineOpacity,
    taglineTranslateY,
    buttonsOpacity,
    buttonsTranslateY,
    handleRegister,
    handleLogin,
  };
}
