import { useState, useRef, useEffect, useCallback } from "react";
import { Animated, Easing, BackHandler, Keyboard } from "react-native";

const DEFAULT_LOGIN_HEIGHT = 485;
const DEFAULT_REGISTER_HEIGHT = 785;

export function useAuthFlip(initialMode = "login", onFaceChange) {
  const [activeFace, setActiveFace] = useState(initialMode === "register" ? "register" : "login");
  const isFlipping = useRef(false);

  const measuredLogin = useRef(false);
  const measuredRegister = useRef(false);

  const loginHeight = useRef(DEFAULT_LOGIN_HEIGHT);
  const registerHeight = useRef(DEFAULT_REGISTER_HEIGHT);

  const heightAnim = useRef(
    new Animated.Value(
      initialMode === "register" ? DEFAULT_REGISTER_HEIGHT : DEFAULT_LOGIN_HEIGHT
    )
  ).current;

  const flipAnim = useRef(new Animated.Value(0)).current;
  const [hasEntered, setHasEntered] = useState(false);

  const entranceFade = useRef(new Animated.Value(1)).current;
  const entranceTranslateY = useRef(new Animated.Value(35)).current;
  const entranceScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceFade, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(entranceTranslateY, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(entranceScale, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setHasEntered(true);
    });
  }, [entranceFade, entranceTranslateY, entranceScale]);

  const onLoginLayout = useCallback((e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 100) {
      loginHeight.current = h + 44;
      measuredLogin.current = true;
      if (activeFace === "login" && !isFlipping.current) {
        Animated.timing(heightAnim, {
          toValue: loginHeight.current,
          duration: 180,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [activeFace, heightAnim]);

  const onRegisterLayout = useCallback((e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 100) {
      registerHeight.current = h + 44;
      measuredRegister.current = true;
      if (activeFace === "register" && !isFlipping.current) {
        Animated.timing(heightAnim, {
          toValue: registerHeight.current,
          duration: 180,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [activeFace, heightAnim]);

  const flipTo = useCallback((target) => {
    if (isFlipping.current || target === activeFace) return;
    isFlipping.current = true;
    Keyboard.dismiss();

    if (onFaceChange) {
      onFaceChange();
    }

    flipAnim.setValue(0);

    const targetHeight =
      target === "register"
        ? (measuredRegister.current
          ? registerHeight.current
          : Math.max(registerHeight.current, DEFAULT_REGISTER_HEIGHT))
        : (measuredLogin.current
          ? loginHeight.current
          : Math.max(loginHeight.current, DEFAULT_LOGIN_HEIGHT));

    let faceSwapped = false;
    const listenerId = flipAnim.addListener(({ value }) => {
      if (!faceSwapped && value >= 0.5) {
        faceSwapped = true;
        setActiveFace(target);
      }
    });

    Animated.parallel([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 560,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: targetHeight,
        duration: 560,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      flipAnim.removeListener(listenerId);
      if (!faceSwapped) {
        setActiveFace(target);
      }
      isFlipping.current = false;
      heightAnim.setValue(targetHeight);
      flipAnim.setValue(0);
    });
  }, [activeFace, flipAnim, heightAnim, onFaceChange]);

  useEffect(() => {
    const onBackPress = () => {
      if (activeFace === "register") {
        flipTo("login");
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [activeFace, flipTo]);

  const rotateY = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: ["0deg", "90deg", "-90deg", "0deg"],
    })
  ).current;

  const cardScale = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.91, 1],
    })
  ).current;

  const cardOpacity = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.46, 0.5, 0.54, 1],
      outputRange: [1, 0.85, 0, 0.85, 1],
    })
  ).current;

  return {
    activeFace,
    isFlipping,
    heightAnim,
    flipAnim,
    rotateY,
    cardScale,
    cardOpacity,
    entranceFade,
    entranceTranslateY,
    entranceScale,
    hasEntered,
    flipTo,
    onLoginLayout,
    onRegisterLayout,
  };
}

export default useAuthFlip;
