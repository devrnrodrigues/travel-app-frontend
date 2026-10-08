import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: winW, height: winH } = Dimensions.get("window");
const { width: scrW, height: scrH } = Dimensions.get("screen");
const width = Math.max(winW, scrW);
const height = Math.max(winH, scrH) + (Platform.OS === "android" ? 120 : 0);

export default StyleSheet.create({
  background: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  overlayWelcome: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.22)",
  },
});

export const getBgScaleTransform = (scale) => ({
  transform: [{ scale }],
});
