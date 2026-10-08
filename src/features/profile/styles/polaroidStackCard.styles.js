import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    width: 180,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  card: {
    position: "absolute",
    width: 162,
    height: 240,
    backgroundColor: "#FFFFFF",
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 4,
    borderRadius: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  imageBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2a303c",
    overflow: "hidden",
    borderRadius: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  chinBox: {
    height: 36,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  chinTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: "#1c1917",
    textAlign: "center",
    lineHeight: 21,
  },
});

export const getCardAnimatedStyle = (zIndex, transX, transY, rotDeg, scale, opacity) => ({
  zIndex,
  opacity,
  transform: [
    { translateX: transX },
    { translateY: transY },
    {
      rotate: rotDeg.interpolate({
        inputRange: [-360, 360],
        outputRange: ["-360deg", "360deg"],
      }),
    },
    { scale },
  ],
});

export const getDimOverlayStyle = (opacity) => ({
  opacity,
});
