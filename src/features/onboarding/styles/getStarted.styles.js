import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const { width: winW, height: winH } = Dimensions.get("window");
const { width: scrW, height: scrH } = Dimensions.get("screen");
const width = Math.max(winW, scrW);
const height = Math.max(winH, scrH) + (Platform.OS === "android" ? 120 : 0);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
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
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 20 : 24,
    paddingBottom: Platform.OS === "android" ? 28 : 16,
    paddingHorizontal: 24,
  },
  brandContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 0.2,
  },
  bottomContainer: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 36,
    width: "100%",
    maxWidth: 270,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
        }
      : {}),
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
  },
  secondaryLink: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryLinkText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  secondaryLinkHighlight: {
    color: "#FFFFFF",
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
