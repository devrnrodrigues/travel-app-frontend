import { useState, useRef, useCallback, useMemo } from "react";
import { useWindowDimensions, Animated, Dimensions } from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function useProfileLayout(insets, isMinimalist = true) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;

  const bottomInset = insets?.bottom || 0;
  const navBarHeight = (isMinimalist ? 54 : 115) + bottomInset;

  const availableHeight = Math.max(480, windowHeight - navBarHeight);
  const scale = Math.max(0.70, Math.min(1.20, availableHeight / 720));

  const bannerRatio = availableHeight < 640 ? 0.24 : availableHeight < 740 ? 0.26 : 0.275;
  let bannerHeight = Math.round(Math.max(135, availableHeight * bannerRatio));

  let bodyOverlap = Math.round(Math.max(16, Math.min(30, bannerHeight * 0.12)));
  let bodyTop = bannerHeight - bodyOverlap;
  let spaceForBody = availableHeight - bodyTop;

  const avatarSize = Math.round(Math.max(76, Math.min(106, 92 * scale)));
  const avatarMarginTop = -Math.round(avatarSize * 0.50);
  const avatarMarginBottom = Math.round(Math.max(6, Math.min(12, 9 * scale)));
  const avatarBorderWidth = Math.round(Math.max(3, Math.min(4, 3.5 * scale)));
  const avatarIconSize = Math.round(avatarSize * 0.42);

  const userNameFontSize = Math.round(Math.max(18, Math.min(22, 20.5 * scale)));
  const userNameLineHeight = Math.round(userNameFontSize * 1.25);

  const nationalityFontSize = Math.round(Math.max(12, Math.min(14, 13 * scale)));
  const nationalityLineHeight = Math.round(nationalityFontSize * 1.3);
  const nationalityMarginTop = Math.round(Math.max(2, Math.min(4, 3 * scale)));
  const nationalityMarginBottom = Math.round(Math.max(4, Math.min(8, 6 * scale)));

  const bioFontSize = Math.round(Math.max(11.5, Math.min(13.5, 12.5 * scale)));
  const bioLineHeight = Math.round(bioFontSize * 1.35);
  const bioMarginBottom = Math.round(Math.max(6, Math.min(12, 9 * scale)));

  const statsPaddingVertical = Math.round(Math.max(10, Math.min(18, 14 * scale)));
  const statValueFontSize = Math.round(Math.max(18, Math.min(22, 20.5 * scale)));
  const statValueLineHeight = Math.round(statValueFontSize * 1.22);
  const statLabelFontSize = Math.round(Math.max(9.5, Math.min(11, 10.5 * scale)));
  const statLabelLineHeight = Math.round(statLabelFontSize * 1.25);
  const statDividerHeight = Math.round(Math.max(24, Math.min(32, 28 * scale)));
  let statsMarginTop = Math.round(Math.max(2, Math.min(8, 4 * scale)));
  let statsMarginBottom = Math.round(Math.max(8, Math.min(16, 12 * scale)));

  const collectionsSectionMarginTop = Math.round(Math.max(4, Math.min(10, 6 * scale)));
  const collectionsHeadingFontSize = Math.round(Math.max(15, Math.min(18, 16.5 * scale)));
  const collectionsHeadingLineHeight = Math.round(collectionsHeadingFontSize * 1.25);
  let collectionsHeaderMarginBottom = Math.round(Math.max(6, Math.min(12, 8 * scale)));

  const avatarInsideBody = avatarSize * 0.50 + avatarMarginBottom;
  const nameHeight = userNameLineHeight;
  const nationalityHeight = nationalityMarginTop + nationalityLineHeight + nationalityMarginBottom;
  const bioHeight = bioLineHeight + bioMarginBottom;
  const statsContentHeight = statValueLineHeight + statLabelLineHeight + 4;
  let statsTotalHeight = statsMarginTop + (statsPaddingVertical * 2) + statsContentHeight + statsMarginBottom;
  let collectionsHeaderTotalHeight = collectionsSectionMarginTop + collectionsHeadingLineHeight + collectionsHeaderMarginBottom;
  const bottomBuffer = Math.round(Math.max(18, Math.min(32, 24 * scale)));

  let upperBodyHeight = avatarInsideBody + nameHeight + nationalityHeight + bioHeight + statsTotalHeight + collectionsHeaderTotalHeight;

  let spaceForCards = spaceForBody - upperBodyHeight - bottomBuffer;

  const targetCardBaseline = Math.round(Math.max(185, Math.min(265, 240 * scale)));
  if (spaceForCards > targetCardBaseline) {
    const extraSpace = spaceForCards - targetCardBaseline;
    const bannerExtra = Math.round(extraSpace * 0.35);
    bannerHeight += bannerExtra;
    bodyOverlap = Math.round(Math.max(16, Math.min(32, bannerHeight * 0.12)));
    bodyTop = bannerHeight - bodyOverlap;
    spaceForBody = availableHeight - bodyTop;

    const spacingExtra = Math.round(extraSpace * 0.15);
    const halfSpacing = Math.round(spacingExtra * 0.5);
    statsMarginBottom += halfSpacing;
    collectionsHeaderMarginBottom += halfSpacing;
    statsTotalHeight += halfSpacing;
    collectionsHeaderTotalHeight += halfSpacing;
    upperBodyHeight += spacingExtra;

    spaceForCards = spaceForBody - upperBodyHeight - bottomBuffer;
  }

  const cardHeight = Math.round(Math.max(185, Math.min(360, spaceForCards)));
  const cardWidth = Math.round(Math.min(windowWidth * 0.65, cardHeight * 0.69));
  const cardBorderRadius = Math.round(Math.max(16, Math.min(24, cardHeight * 0.075)));

  const addCircleSize = Math.round(Math.max(46, Math.min(62, 52 * scale)));
  const addIconSize = Math.round(addCircleSize * 0.48);
  const addTextFontSize = Math.round(Math.max(13, Math.min(16, 14 * scale)));
  const addTextLineHeight = Math.round(addTextFontSize * 1.3);

  const cardTitleFontSize = Math.round(Math.max(13.5, Math.min(17, cardHeight * 0.056)));
  const cardSubFontSize = Math.round(Math.max(11, Math.min(14, cardHeight * 0.043)));
  const cardGradientHeight = Math.round(Math.max(75, Math.min(130, cardHeight * 0.38)));
  const cardGradientPadding = Math.round(Math.max(10, Math.min(18, 14 * scale)));

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

  const isBehindNavbar = totalElementsBottom > screenHeight - navBarHeight + 4;
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
    statsMarginTop,
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
    statsMarginTop,
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
