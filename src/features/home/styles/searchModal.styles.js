import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  transparentFlex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  screenCover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  screenCoverDark: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  screenCoverLight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "rgba(80, 80, 80, 0.45)",
  },
  searchContainer: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 20,
  },
  searchHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  searchBackBtn: {
    marginRight: 15,
  },
  searchInputBox: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    paddingHorizontal: 15,
  },
  searchFilterRow: {
    marginHorizontal: -20,
  },
  filterCategoriesContent: {
    paddingLeft: 20,
    paddingRight: 35,
    alignItems: "center",
  },
  filterBtnBase: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtnInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  filterBtnActiveText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },
  filterBtnInactiveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  searchListWrapper: {
    flex: 1,
    marginHorizontal: -20,
  },
  searchListContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 24,
  },
  searchEmptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  whiteText: {
    color: "#FFFFFF",
  },
  marginRight6: {
    marginRight: 6,
  },
  marginLeft6: {
    marginLeft: 6,
  },
  marginLeft15: {
    marginLeft: 15,
  },
  marginRight10: {
    marginRight: 10,
  },
  marginRight20: {
    marginRight: 20,
  },
  paddingTop6: {
    paddingTop: 6,
  },
  flex1: {
    flex: 1,
  },
  fullAbsolute: {
    ...StyleSheet.absoluteFillObject,
  },
});

export const getSearchInputAnimatedStyle = (borderColor, backgroundColor) => ({
  borderColor,
  backgroundColor,
});

export const getFilterAnimatedStyle = (height, marginBottom, opacity, translateY) => ({
  height,
  marginBottom,
  opacity,
  transform: [{ translateY }],
  overflow: "hidden",
});

export const getFilterButtonActiveBg = (accentColor) => ({
  backgroundColor: accentColor,
});

export const getFilterIconAnimatedStyle = (rotate, scale) => ({
  transform: [{ rotate }, { scale }],
});

export const getModalSlideStyle = (opacity, translateY) => ({
  opacity,
  transform: [{ translateY }],
});

export const getFadeOpacityStyle = (opacity) => ({
  opacity,
});
