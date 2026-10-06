import { useState, useRef, useCallback } from "react";
import { Animated, Platform } from "react-native";
import { CARD_GAP } from "../favorites.styles";

export function useFavoriteCardAnimation({
  scrollY,
  index,
  totalItems,
  cardDimensions,
  cardHeight,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [imgAnim]);

  const visibleRows = cardDimensions?.targetRows || 3;
  const totalRows = Math.ceil((totalItems || 0) / 2);
  const rowIndex = Math.floor(index / 2);
  const rowSlot = (cardHeight || 0) + CARD_GAP;
  const itemOffset = rowIndex * rowSlot;

  const canFoldTop = totalRows > visibleRows && rowIndex < totalRows - visibleRows;
  const canFoldBottom = totalRows > visibleRows && rowIndex >= visibleRows;

  let rotateX = "0deg";
  let translateY = 0;
  let opacity = 1;

  if (scrollY && canFoldTop && canFoldBottom) {
    const inputRange = [
      Math.round(itemOffset - (visibleRows - 0.05) * rowSlot),
      Math.round(itemOffset - (visibleRows - 0.55) * rowSlot),
      Math.round(itemOffset - (visibleRows - 1) * rowSlot),
      Math.round(itemOffset),
      Math.round(itemOffset + 0.45 * rowSlot),
      Math.round(itemOffset + 0.95 * rowSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["60deg", "28deg", "0deg", "0deg", "-28deg", "-60deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [20, 8, 0, 0, 0, 0],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0.9, 1, 1, 0.9, 0],
      extrapolate: "clamp",
    });
  } else if (scrollY && canFoldTop) {
    const inputRange = [
      Math.round(itemOffset),
      Math.round(itemOffset + 0.45 * rowSlot),
      Math.round(itemOffset + 0.95 * rowSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["0deg", "-28deg", "-60deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0, 0],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp",
    });
  } else if (scrollY && canFoldBottom) {
    const inputRange = [
      Math.round(itemOffset - (visibleRows - 0.05) * rowSlot),
      Math.round(itemOffset - (visibleRows - 0.55) * rowSlot),
      Math.round(itemOffset - (visibleRows - 1) * rowSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["60deg", "28deg", "0deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [20, 8, 0],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0.9, 1],
      extrapolate: "clamp",
    });
  }

  return {
    imageLoaded,
    imgAnim,
    handleImageLoad,
    rotateX,
    translateY,
    opacity,
  };
}

export default useFavoriteCardAnimation;
