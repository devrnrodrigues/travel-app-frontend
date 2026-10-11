import { StyleSheet } from "react-native";

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  searchCardBase: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  searchCardDark: {
    backgroundColor: "rgba(26, 26, 26, 0.78)",
    borderWidth: 0,
  },
  searchCardLight: {
    backgroundColor: "rgba(250, 250, 250, 0.30)",
    borderWidth: 0,
  },
  searchCardMinimalist: {
    backgroundColor: "#F3F4F6",
    borderWidth: 0,
  },
  searchCardMinimalistDark: {
    backgroundColor: "#161616",
    borderWidth: 0,
  },
  searchCardImageWrapper: {
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  searchCardImage: {
    borderRadius: 13,
  },
  searchCardSkeletonDark: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  searchCardSkeletonLight: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  searchCardEmptyFallback: {
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  searchCardEmptyFallbackDark: {
    backgroundColor: "#252525",
    borderWidth: 0,
  },
  searchCardEmptyFallbackLight: {
    backgroundColor: "#E2E2E2",
    borderWidth: 0,
  },
  searchCardInfo: {
    marginLeft: 14,
    flex: 1,
    justifyContent: "center",
  },
  searchCardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  searchCardTitleMinimalist: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "bold",
  },
  searchCardTitleMinimalistDark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  searchCardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  searchCardLocationText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },
  searchCardLocationTextMinimalist: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },
  searchCardLocationTextMinimalistDark: {
    color: "#9CA3AF",
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },
  searchCardBadgesContainer: {
    position: "absolute",
    top: 8,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchCardPriceBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  searchCardPriceBadgeDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  searchCardPriceBadgeLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  searchCardRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  searchCardRatingBadgeDark: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  searchCardRatingBadgeLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  searchCardBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  searchCardRatingText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  searchCardRatingTextDark: {
    color: "#FFFFFF",
  },
  searchCardRatingTextLight: {
    color: "#000000",
  },
  marginRight3: {
    marginRight: 3,
  },
});

export const getSearchCardContainerStyle = (cardHeight, cardMarginBottom) => ({
  height: cardHeight,
  marginBottom: cardMarginBottom,
});

export const getImageDimensionStyle = (size) => ({
  width: size,
  height: size,
});

export const getImageAnimStyle = (size, opacity) => ({
  width: size,
  height: size,
  borderRadius: 13,
  opacity,
});

export const getBadgePaddingOffset = (badgeOffset) => ({
  paddingRight: badgeOffset,
});

export const getBadgeTextColor = (accentColor) => ({
  color: accentColor,
});
