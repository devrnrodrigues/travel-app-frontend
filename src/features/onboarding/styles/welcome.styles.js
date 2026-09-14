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
    backgroundColor: "rgba(0, 0, 0, 0.22)",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 24 : 40,
    paddingBottom: Platform.OS === "android" ? 32 : 24,
    paddingHorizontal: 24,
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: Platform.OS === "android" ? 12 : 6,
  },
  swipeTrack: {
    backgroundColor: "rgba(255,255,255,0.22)",
    width: 70,
    height: 150,
    borderRadius: 35,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 6,
    overflow: "hidden",
  },
  arrows: {
    marginBottom: 15,
  },
  arrow: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#fff",
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
