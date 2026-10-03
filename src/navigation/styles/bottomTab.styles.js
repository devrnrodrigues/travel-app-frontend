import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const TAB_WIDTH = width;
export const TAB_HEIGHT = 54;
export const SWEEP_WIDTH = TAB_WIDTH * 0.7;

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
    borderWidth: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  bottomTabLight: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#DCDCE0",
  },
  tabItem: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 21,
  },
  activeTab: {
    borderWidth: 1.5,
    borderRadius: 21,
    backgroundColor: "transparent",
  },
  horizontalSweepContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SWEEP_WIDTH,
    bottom: 0,
  },
  horizontalSweepGradient: {
    width: SWEEP_WIDTH,
    height: "100%",
  },
  verticalSweepContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  verticalSweepGradient: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyleHidden: {
    height: 0,
  },
  sceneContainerDark: {
    backgroundColor: "#000000",
  },
  sceneContainerLight: {
    backgroundColor: "#0A0A0A",
  },
});
