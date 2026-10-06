import { StyleSheet } from "react-native";
import { HORIZONTAL_PADDING, CARD_GAP } from "../favorites.styles";

export const favoriteHeaderStyles = StyleSheet.create({
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: -6,
    paddingTop: 0,
    paddingBottom: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 2,
  },
  refetchIndicator: {
    marginRight: 4,
  },
  titleContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 0,
    paddingBottom: 6,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.36,
  },
  searchContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: CARD_GAP,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchBoxDark: {
    backgroundColor: "rgba(28, 28, 30, 0.75)",
  },
  searchBoxLight: {
    backgroundColor: "rgba(255, 255, 255, 0.80)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingVertical: 0,
  },
  searchInputDark: {
    color: "#FFFFFF",
  },
  searchInputLight: {
    color: "#000000",
  },
  searchClearBtn: {
    padding: 4,
  },
});

export default favoriteHeaderStyles;
