import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const GAP = 1;
const COLUMN_WIDTH = (width - GAP * 2) / 3;
const CARD_HEIGHT = Math.round(COLUMN_WIDTH * 1.52);

export { COLUMN_WIDTH, CARD_HEIGHT, GAP };

export const exploreCardStyles = StyleSheet.create({
  gridItem: {
    width: COLUMN_WIDTH,
    height: CARD_HEIGHT,
    position: "relative",
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  gridItemLight: {
    backgroundColor: "#F3F4F6",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  emptyImageContainerDark: {
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  emptyImageContainerLight: {
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  emptyImageText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "500",
  },
  topBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: 5,
    paddingHorizontal: 4.5,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  topBadgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
    marginLeft: 2.5,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 46,
    justifyContent: "flex-end",
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 16,
  },
  destinationTitle: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    lineHeight: 14.5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  badgeIconMargin: {
    marginRight: 2.5,
  },
  destinationLocation: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 9.5,
    fontWeight: "500",
  },
});

export default exploreCardStyles;
