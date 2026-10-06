import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  topHeaderSection: {
    width: width,
    height: height * 0.40,
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: height * 0.095,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === "ios" ? 0 : 16,
  },
  roundButtonDark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 0,
  },
  roundButtonLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 0,
  },
  headerTitle: {
    fontSize: width > 360 ? 32 : 26,
    fontWeight: "bold",
    color: "#FFF",
    paddingHorizontal: width * 0.07,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  emptyView: {
    width: 44,
  },
});
