import { StyleSheet } from "react-native";

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
    borderWidth: 0,
  },
  searchBarInputDark: {
    backgroundColor: "rgba(38, 38, 38, 0.72)",
  },
  searchBarInputLight: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
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
    borderWidth: 0,
  },
  photoIconButtonDark: {
    backgroundColor: "rgba(38, 38, 38, 0.72)",
  },
  photoIconButtonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
});

export default exploreHeaderStyles;
