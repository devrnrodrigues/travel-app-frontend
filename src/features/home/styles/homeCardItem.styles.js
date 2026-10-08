import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.9,
  },
  cardImageFallback: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageFallbackDark: {
    backgroundColor: "#181818",
  },
  cardImageFallbackLight: {
    backgroundColor: "#242424",
  },
  cardFallbackText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
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
  cardFullBackground: {
    position: "absolute",
    height: 500,
    bottom: -25,
    borderRadius: 25,
  },
  overlayBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  overlayDark: {
    backgroundColor: "rgba(12, 12, 12, 0.82)",
  },
  overlayLight: {
    backgroundColor: "rgba(116, 116, 116, 0.4)",
  },
  cardOverlayImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 24,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  cardTitleCompact: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 21,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  cardLocation: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 3,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  cardLocationCompact: {
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 3,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardInfoLightBg: {
    backgroundColor: "rgba(100, 100, 100, 0.50)",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "700",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});

export const getCardDimensionsStyle = (cardWidth, cardHeight, avgColor) => ({
  ...(cardWidth ? { width: cardWidth } : {}),
  ...(cardHeight ? { height: cardHeight } : {}),
  ...(avgColor ? { backgroundColor: avgColor } : {}),
});

export const getCardInfoPosition = (bottom, height) => ({
  ...(bottom !== undefined ? { bottom } : {}),
  ...(height !== undefined ? { height } : {}),
});

export const getAndroidBackgroundDimensions = (cardWidth) => ({
  ...(cardWidth ? { width: cardWidth, left: -(cardWidth * 0.06) } : {}),
});

export const getImageOpacityStyle = (opacity) => ({
  opacity,
});

export const getRatingColorStyle = (accentColor) => ({
  color: accentColor,
});
