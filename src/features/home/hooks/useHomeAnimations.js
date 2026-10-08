import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export default function useHomeAnimations(activeCat) {
  const bgDimAnim = useRef(new Animated.Value(0)).current;
  const isFirstCatRender = useRef(true);

  useEffect(() => {
    if (isFirstCatRender.current) {
      isFirstCatRender.current = false;
      return;
    }
    bgDimAnim.setValue(0);
    Animated.sequence([
      Animated.timing(bgDimAnim, {
        toValue: 0.5,
        duration: 130,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(bgDimAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeCat, bgDimAnim]);

  return {
    bgDimAnim,
  };
}
