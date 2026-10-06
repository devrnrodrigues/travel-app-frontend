import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const exploreHeaderStyles = StyleSheet.create({
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingBottom: 16,
    zIndex: 9999,
    elevation: 10,
  },
  headerBarDark: {
    backgroundColor: "#000000",
  },
  headerBarLight: {
    backgroundColor: "rgba(100, 100, 100, 1)",
  },
  headerFoliageWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    overflow: "hidden",
  },
  headerFoliage: {
    width: "124%",
    height: Math.min(320, Math.round(width * 0.82)),
    position: "absolute",
    top: -6,
    left: "-8%",
  },
  headerFoliageDark: {
    opacity: 0.85,
  },
  headerFoliageLight: {
    opacity: 0.85,
  },
  headerFoliageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    elevation: 2,
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchBarInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchBarInputDark: {
    backgroundColor: "rgba(38, 38, 38, 0.72)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchBarInputLight: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  searchBarInputFocusedDark: {
    backgroundColor: "#1F1F1F",
  },
  searchBarInputFocusedLight: {
    backgroundColor: "#FFFFFF",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 15.5,
    paddingVertical: 0,
  },
  searchInputDark: {
    color: "#FFFFFF",
  },
  searchInputLight: {
    color: "#000000",
  },
  searchingIndicator: {
    marginRight: 6,
  },
  clearButton: {
    padding: 4,
  },
  photoIconButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  photoIconButtonDark: {
    backgroundColor: "rgba(38, 38, 38, 0.72)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  photoIconButtonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
});

export default exploreHeaderStyles;
