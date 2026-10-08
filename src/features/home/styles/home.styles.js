import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const getHomeDimensions = (
  windowWidth = width,
  windowHeight = height,
  insetsTop = 0,
  insetsBottom = 0
) => {
  const topInset = insetsTop || 0;
  const bottomInset = insetsBottom || 0;
  const bottomBarHeight = 54 + bottomInset;
  const availableHeight = windowHeight - topInset - bottomBarHeight;

  const isSmallScreen = availableHeight < 640;
  const isTallScreen = availableHeight > 780;

  const headerPaddingTop = isSmallScreen ? 8 : isTallScreen ? 16 : 12;
  const headerTitleSize = isSmallScreen ? 26 : isTallScreen ? 32 : 30;
  const iconPadding = isSmallScreen ? 10 : 12;
  const headerHeight = headerPaddingTop + (isSmallScreen ? 34 : 42);

  const categoriesHeight = isSmallScreen ? 44 : isTallScreen ? 54 : 48;
  const topCardHeight = isSmallScreen ? 82 : isTallScreen ? 134 : 90;
  const topCardWidth = isSmallScreen ? 236 : isTallScreen ? 320 : 258;
  const topCardImageSize = isSmallScreen ? 64 : isTallScreen ? 106 : 72;
  const topDestTitleSize = isSmallScreen ? 19 : isTallScreen ? 23 : 22;
  const topDestHeaderMarginBottom = isSmallScreen ? 8 : isTallScreen ? 12 : 12;
  const topDestSectionHeight = topDestTitleSize + topDestHeaderMarginBottom + topCardHeight;

  const bottomSpacing = isSmallScreen ? 10 : isTallScreen ? 16 : 12;

  const baseDestHeight = isSmallScreen ? 109 : 132;
  const totalBaseHeights = headerHeight + categoriesHeight + baseDestHeight;
  const availableForCard = availableHeight - bottomSpacing - totalBaseHeights;

  const rawCardHeight = Math.round(availableForCard * 0.94);
  const cardHeight = Math.round(Math.max(290, Math.min(rawCardHeight, 505)));
  const cardWidth = Math.round(Math.min(windowWidth * 0.76, 360, cardHeight * 0.74));

  const cardInfoBottom = Math.round(Math.max(14, Math.min(25, cardHeight * 0.055)));
  const cardInfoHeight = Math.round(Math.min(104, Math.max(86, cardHeight * 0.25)));

  return {
    windowWidth,
    windowHeight,
    availableHeight,
    isSmallScreen,
    isTallScreen,
    headerPaddingTop,
    headerTitleSize,
    iconPadding,
    categoriesHeight,
    cardHeight,
    cardWidth,
    cardInfoBottom,
    cardInfoHeight,
    topCardHeight,
    topCardWidth,
    topCardImageSize,
    topDestTitleSize,
    topDestHeaderMarginBottom,
    bottomBarHeight,
    bottomSpacing,
  };
};

const initialDims = getHomeDimensions(width, height);
export const CARD_WIDTH = initialDims.cardWidth;
export const CARD_HEIGHT = initialDims.cardHeight;

export default StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
  },
  homeContentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSection: {
    width: "100%",
  },
  backgroundImage: { position: "absolute", width: "100%", height: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  headerTitle: {
    fontWeight: "800",
    flex: 1,
    marginRight: 10,
    color: "#FFFFFF",
  },
  headerTitleDark: {
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  headerTitleLight: {
    textShadowColor: "rgba(255, 255, 255, 1)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerIcons: { flexDirection: "row" },
  iconButton: {
    borderRadius: 15,
    marginLeft: 12,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  iconButtonDark: {
    backgroundColor: "rgba(0, 0, 0, 0.70)",
  },
  iconButtonLight: {
    backgroundColor: "rgba(100, 100, 100, 0.40)",
  },
  categoriesSection: { justifyContent: "center" },
  categoriesContainer: { paddingHorizontal: 25, alignItems: "center" },
  contentContainer: { width: "100%", justifyContent: "center" },
  cardsList: { paddingHorizontal: 15, alignItems: "center" },
  card: {
    marginHorizontal: 10,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#121212",
    flexShrink: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  cardInfo: {
    position: "absolute",
    alignSelf: "center",
    width: "88%",
    borderRadius: 25,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: "hidden",
  },
  cardInfoInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cardInfoLeft: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  categoryItem: {
    marginRight: 26,
  },
  centerAligned: {
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  topDestinationsSection: {
    width: "100%",
    paddingBottom: 0,
  },
  topDestinationsHeader: {
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topDestinationsTitle: {
    fontWeight: "800",
    letterSpacing: -0.3,
    color: "#FFFFFF",
  },
  topDestinationsTitleDark: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  topDestinationsTitleLight: {
    color: "#1A1A1A",
  },
  topDestinationsList: {
    paddingHorizontal: 25,
    paddingBottom: 0,
  },
  flex1: {
    flex: 1,
  },
  blackScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  bgDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  fullWidth: {
    width: "100%",
  },
  footerLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});

export const getScrollContentPadding = (bottomPadding) => ({
  paddingBottom: bottomPadding,
});

export const getHeaderTopPadding = (paddingTop) => ({
  paddingTop,
});

export const getHeaderTitleSize = (fontSize) => ({
  fontSize,
});

export const getIconButtonPadding = (padding) => ({
  padding,
});

export const getCategoriesHeight = (height) => ({
  height,
});

export const getTopDestHeaderMargin = (marginBottom) => ({
  marginBottom,
});

export const getTopDestTitleSize = (fontSize) => ({
  fontSize,
});

export const getTopFooterLoading = (height) => ({
  justifyContent: "center",
  alignItems: "center",
  width: 60,
  height,
});

export const getDimAnimStyle = (opacity) => ({
  opacity,
});
