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
});
