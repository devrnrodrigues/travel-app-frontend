import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const HORIZONTAL_PADDING = 16;
export const CARD_GAP = 12;

export const getCardDimensions = (
  windowWidth = width,
  windowHeight = height,
  insetsBottom = 0,
  insetsTop = 0,
  measuredContainerHeight = 0
) => {
  const cardWidth = Math.floor((windowWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2);
  const bottomInset = insetsBottom || 0;
  const topInset = insetsTop || 0;
  const estimatedHeaderHeight = 128;
  const tabHeight = 54 + bottomInset;

  const visibleHeight =
    measuredContainerHeight > 0
      ? measuredContainerHeight - tabHeight
      : windowHeight - topInset - estimatedHeaderHeight - tabHeight;

  const isSmallScreen = windowHeight < 740 || visibleHeight < 460;
  const targetRows = isSmallScreen ? 2 : 3;

  const verticalPadding = CARD_GAP;
  const totalVerticalSpacing = (targetRows + 1) * CARD_GAP;
  const usableCardsHeight = visibleHeight - totalVerticalSpacing;
  const cardHeight = Math.max(140, Math.floor(usableCardsHeight / targetRows));

  return {
    cardWidth,
    cardHeight,
    isSmallScreen,
    targetRows,
    tabBarHeight: tabHeight,
    verticalPadding,
    scrollPaddingBottom: tabHeight,
  };
};

const initialDims = getCardDimensions(width, height);
export const COLUMN_WIDTH = initialDims.cardWidth;
export const CARD_HEIGHT = initialDims.cardHeight;

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  whiteScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  columnWrapper: {
    flexDirection: "row",
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  listFooterWrapper: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overflowVisible: {
    overflow: "visible",
  },
  listContent: {
    width: "100%",
  },
  card: {
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "rgba(26, 26, 26, 0.78)",
  },
  cardLight: {
    backgroundColor: "rgba(250, 250, 250, 0.30)",
  },
  cardInner: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  cardOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 36,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  foliageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 155,
    overflow: "hidden",
    zIndex: 0,
  },
  foliageHeader: {
    position: "absolute",
    top: -8,
    left: "-8%",
    width: "128%",
    height: 320,
  },
  foliageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  foliageWhiteFilter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
});
