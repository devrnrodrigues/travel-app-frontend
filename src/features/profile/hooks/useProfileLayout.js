import { useState, useRef, useCallback, useMemo } from "react";
import { useWindowDimensions, Animated, Dimensions } from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const BASE_HEIGHT = 680;

export default function useProfileLayout(insets) {
  const { height: windowHeight } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;

  const scale = Math.min(1, Math.max(0.65, windowHeight / BASE_HEIGHT));

  const bannerHeight = Math.round(230 * scale);
  const bodyOverlap = Math.round(24 * scale);

  const avatarSize = Math.round(102 * scale);
  const avatarMarginTop = -Math.round(52 * scale);
  const avatarMarginBottom = Math.round(12 * scale);
  const avatarBorderWidth = Math.round(4 * scale);
  const avatarIconSize = Math.round(42 * scale);

  const userNameFontSize = Math.round(21 * scale);
  const userNameLineHeight = Math.round(27 * scale);
  const nationalityFontSize = Math.round(13.5 * scale);
  const nationalityLineHeight = Math.round(18 * scale);
  const nationalityMarginTop = Math.round(4 * scale);
  const nationalityMarginBottom = Math.round(8 * scale);

  const bioFontSize = Math.round(13 * scale);
  const bioLineHeight = Math.round(19 * scale);
  const bioMarginBottom = Math.round(20 * scale);

  const statsPaddingVertical = Math.round(18 * scale);
  const statsMarginBottom = Math.round(24 * scale);
  const statValueFontSize = Math.round(22 * scale);
  const statValueLineHeight = Math.round(27 * scale);
  const statLabelFontSize = Math.round(11 * scale);
  const statLabelLineHeight = Math.round(14 * scale);
  const statDividerHeight = Math.round(32 * scale);

  const collectionsSectionMarginTop = Math.round(8 * scale);
  const collectionsHeaderMarginBottom = Math.round(12 * scale);
  const collectionsHeadingFontSize = Math.round(17 * scale);
  const collectionsHeadingLineHeight = Math.round(22 * scale);

  const cardWidth = Math.round(180 * scale);
  const cardHeight = Math.round(260 * scale);
  const cardBorderRadius = Math.round(22 * scale);

  const addCircleSize = Math.round(58 * scale);
  const addIconSize = Math.round(28 * scale);
  const addTextFontSize = Math.round(15 * scale);
  const addTextLineHeight = Math.round(20 * scale);

  const cardTitleFontSize = Math.round(15 * scale);
  const cardSubFontSize = Math.round(12 * scale);
  const cardGradientHeight = Math.round(95 * scale);
  const cardGradientPadding = Math.round(14 * scale);

  const [screenHeight, setScreenHeight] = useState(WINDOW_HEIGHT);
  const [bodyY, setBodyY] = useState(206);
  const [lastElementBottom, setLastElementBottom] = useState(570);
  const totalElementsBottom = bodyY + lastElementBottom;

  const handleRootLayout = useCallback((e) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && Math.abs(h - screenHeight) > 1) {
      setScreenHeight(h);
    }
  }, [screenHeight]);

  const handleBodyLayout = useCallback((e) => {
    const y = e.nativeEvent.layout.y;
    if (y > 0 && Math.abs(y - bodyY) > 1) {
      setBodyY(y);
    }
  }, [bodyY]);

  const handleLastElementLayout = useCallback((e) => {
    const y = e.nativeEvent.layout.y;
    if (y > 0 && Math.abs(y - lastElementBottom) > 1) {
      setLastElementBottom(y);
    }
  }, [lastElementBottom]);

  const navBarHeight = 54 + insets.bottom;
  const isBehindNavbar = totalElementsBottom > screenHeight - navBarHeight;
  const canScroll = isBehindNavbar;

  const bottomNavBgOpacity = useMemo(() => {
    const threshold = totalElementsBottom - (screenHeight - 155);
    if (threshold <= 0) {
      return 1;
    }
    const fadeDistance = 40;
    const fadeStart = Math.max(0, threshold - fadeDistance);
    const fadeEnd = Math.max(fadeStart + 1, threshold);
    return scrollY.interpolate({
      inputRange: [fadeStart, fadeEnd],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
  }, [totalElementsBottom, screenHeight, scrollY]);

  const avatarDimensions = useMemo(() => ({
    avatarSize,
    avatarMarginTop,
    avatarMarginBottom,
    avatarBorderWidth,
    avatarIconSize,
    userNameFontSize,
    userNameLineHeight,
    nationalityFontSize,
    nationalityLineHeight,
    nationalityMarginTop,
    nationalityMarginBottom,
    bioFontSize,
    bioLineHeight,
    bioMarginBottom,
    statsPaddingVertical,
    statsMarginBottom,
    statValueFontSize,
    statValueLineHeight,
    statLabelFontSize,
    statLabelLineHeight,
    statDividerHeight,
  }), [
    avatarSize,
    avatarMarginTop,
    avatarMarginBottom,
    avatarBorderWidth,
    avatarIconSize,
    userNameFontSize,
    userNameLineHeight,
    nationalityFontSize,
    nationalityLineHeight,
    nationalityMarginTop,
    nationalityMarginBottom,
    bioFontSize,
    bioLineHeight,
    bioMarginBottom,
    statsPaddingVertical,
    statsMarginBottom,
    statValueFontSize,
    statValueLineHeight,
    statLabelFontSize,
    statLabelLineHeight,
    statDividerHeight,
  ]);

  const collectionDimensions = useMemo(() => ({
    cardWidth,
    cardHeight,
    cardBorderRadius,
    addCircleSize,
    addIconSize,
    addTextFontSize,
    addTextLineHeight,
    cardTitleFontSize,
    cardSubFontSize,
    cardGradientHeight,
    cardGradientPadding,
    collectionsSectionMarginTop,
    collectionsHeaderMarginBottom,
    collectionsHeadingFontSize,
    collectionsHeadingLineHeight,
  }), [
    cardWidth,
    cardHeight,
    cardBorderRadius,
    addCircleSize,
    addIconSize,
    addTextFontSize,
    addTextLineHeight,
    cardTitleFontSize,
    cardSubFontSize,
    cardGradientHeight,
    cardGradientPadding,
    collectionsSectionMarginTop,
    collectionsHeaderMarginBottom,
    collectionsHeadingFontSize,
    collectionsHeadingLineHeight,
  ]);

  return {
    scale,
    bannerHeight,
    bodyOverlap,
    avatarDimensions,
    collectionDimensions,
    navBarHeight,
    canScroll,
    scrollY,
    bottomNavBgOpacity,
    handleRootLayout,
    handleBodyLayout,
    handleLastElementLayout,
  };
}
