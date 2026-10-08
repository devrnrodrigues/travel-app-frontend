import { useState, useRef, useCallback } from "react";
import { Animated, Platform } from "react-native";

export default function useImageFadeIn(initialLoaded = false, duration = 240) {
  const [imageLoaded, setImageLoaded] = useState(initialLoaded);
  const imgAnim = useRef(new Animated.Value(initialLoaded ? 1 : 0)).current;

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [imgAnim, duration]);

  return {
    imageLoaded,
    imgAnim,
    handleImageLoad,
  };
}
