import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const TAB_WIDTH = width - 40;
export const TAB_HEIGHT = 72;
export const SWEEP_WIDTH = TAB_WIDTH * 0.7;

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  bottomTab: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    height: TAB_HEIGHT,
    borderRadius: 36,
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
    maxWidth: 500,
    alignSelf: "center",
  },
  tabItem: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  activeTab: {
    borderWidth: 1.5,
    borderRadius: 24,
    backgroundColor: "transparent",
  },
  horizontalSweepContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SWEEP_WIDTH,
    height: TAB_HEIGHT,
  },
  horizontalSweepGradient: {
    width: SWEEP_WIDTH,
    height: TAB_HEIGHT,
  },
  verticalSweepContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
  },
  verticalSweepGradient: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
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
