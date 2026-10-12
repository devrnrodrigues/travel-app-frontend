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
    backgroundColor: "#FFFFFF",
  },
  headerBarMinimalist: {
    backgroundColor: "#FFFFFF",
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchBarInputDark: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(38, 38, 38, 0.72)",
  },
  searchBarInputLight: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F7",
  },
  searchBarInputMinimalist: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F7",
  },
  searchBarInputDecorativeDark: {
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 14,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
  },
  searchBarInputDecorativeLight: {
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 14,
    backgroundColor: "rgba(100, 100, 100, 0.82)",
  },
  searchBarInputFocusedDark: {
    backgroundColor: "#1F1F1F",
  },
  searchBarInputFocusedLight: {
    backgroundColor: "#FFFFFF",
  },
  searchBarInputFocusedDecorativeDark: {
    backgroundColor: "rgba(10, 10, 10, 0.95)",
  },
  searchBarInputFocusedDecorativeLight: {
    backgroundColor: "rgba(100, 100, 100, 0.95)",
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  photoIconButtonDark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(38, 38, 38, 0.72)",
  },
  photoIconButtonLight: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
  },
  photoIconButtonMinimalist: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
  },
  photoIconButtonDecorativeDark: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
  },
  photoIconButtonDecorativeLight: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "rgba(100, 100, 100, 0.82)",
  },
});

export default exploreHeaderStyles;
