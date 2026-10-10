import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 270,
    height: 98,
    borderRadius: 26,
    padding: 10,
    marginRight: 14,
    flexShrink: 0,
    borderWidth: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  cardContainerDark: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderWidth: 0,
  },
  cardContainerLight: {
    backgroundColor: "rgba(100, 100, 100, 0.80)",
    borderWidth: 0,
  },
  cardContainerMinimalist: {
    backgroundColor: "#F3F4F6",
    borderWidth: 0,
  },
  cardContainerMinimalistDark: {
    backgroundColor: "#161616",
    borderWidth: 0,
  },
  imageWrapper: {
    width: 78,
    height: 78,
    borderRadius: 19,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
  },
  skeletonThumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  skeletonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  skeletonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  fallbackDark: {
    backgroundColor: "#202020",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  fallbackMinimalist: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  fallbackMinimalistDark: {
    backgroundColor: "#202020",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 4,
    color: "#FFFFFF",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  titleMinimalist: {
    color: "#111827",
  },
  titleMinimalistDark: {
    color: "#FFFFFF",
  },
  location: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  locationMinimalist: {
    color: "#6B7280",
  },
  locationMinimalistDark: {
    color: "#9CA3AF",
  },
});

export const getTopCardContainerStyle = (cardWidth, cardHeight) => ({
  ...(cardWidth ? { width: cardWidth } : {}),
  ...(cardHeight ? { height: cardHeight, borderRadius: Math.round(cardHeight * 0.26) } : {}),
});

export const getTopCardImageWrapperStyle = (imageSize) => ({
  ...(imageSize ? { width: imageSize, height: imageSize, borderRadius: Math.round(imageSize * 0.25) } : {}),
});

export const getTopCardThumbnailRadius = (imageSize) => ({
  ...(imageSize ? { borderRadius: Math.round(imageSize * 0.25) } : {}),
});

export const getTopCardTitleStyle = (titleSize) => ({
  ...(titleSize ? { fontSize: titleSize } : {}),
});

export const getTopCardLocationStyle = (locationSize) => ({
  ...(locationSize ? { fontSize: locationSize } : {}),
});

export const getImageOpacityStyle = (opacity) => ({
  opacity,
});
