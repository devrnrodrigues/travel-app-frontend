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
  const estimatedHeaderHeight = 114;
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
  const cardHeight = Math.max(140, Math.ceil(usableCardsHeight / targetRows));

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
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: -6,
    paddingTop: 0,
    paddingBottom: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 2,
  },
  titleContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 0,
    paddingBottom: 6,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.36,
  },
  searchContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: CARD_GAP,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    borderRadius: 11,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBoxDark: {
    backgroundColor: "#1C1C1E",
  },
  searchBoxLight: {
    backgroundColor: "#E5E5EA",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingVertical: 0,
  },
  searchInputDark: {
    color: "#FFFFFF",
  },
  searchInputLight: {
    color: "#000000",
  },
  searchClearBtn: {
    padding: 4,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  columnWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: COLUMN_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  cardInner: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1A1A1A",
  },
  cardLight: {
    backgroundColor: "#E0E0E0",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  cardPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardPlaceholderText: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
  moreButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  ratingBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.50)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
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
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyHeartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 270,
    marginBottom: 18,
  },
  emptyActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  emptyActionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  skeletonCard: {
    width: COLUMN_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
  },
  foliageHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: Math.min(270, Math.round(width * 0.62)),
    zIndex: 0,
  },
  foliageFooterContainer: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    width: "100%",
    height: Math.min(220, Math.round(width * 0.44)),
    zIndex: 0,
  },
  foliageFooter: {
    width: "100%",
    height: "100%",
  },
  foliageFooterDark: {
    opacity: 0.35,
  },
  foliageFooterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
});

export const dialogStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 275,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    overflow: "hidden",
  },
  dialogCardLight: {
    backgroundColor: "#FFFFFF",
  },
  contentSection: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  titleLight: {
    color: "#000000",
  },
  message: {
    fontSize: 13.5,
    color: "#E5E5E5",
    textAlign: "center",
    lineHeight: 19,
  },
  messageLight: {
    color: "#555555",
  },
  actionButton: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "transparent",
  },
  actionButtonLight: {
    borderTopColor: "rgba(0, 0, 0, 0.08)",
  },
  lastButton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelTextLight: {
    color: "#000000",
  },
});
