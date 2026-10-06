import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const getScreenContainerStyle = (isDarkMode, opacity) => ({
  backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
  opacity,
});

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoBottomSection: {
    flex: 1,
    marginTop: -height * 0.08,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 0,
    elevation: 0,
  },
  infoBottomSectionDark: {
    backgroundColor: "#0A0A0A",
  },
  infoBottomSectionLight: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
  },
  flex1: {
    flex: 1,
  },
});
