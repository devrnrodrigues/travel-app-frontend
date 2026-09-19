import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 0;
const GAP = 1;
const COLUMN_WIDTH = (width - GAP * 2) / 3;

export { COLUMN_WIDTH, GAP, HORIZONTAL_PADDING };

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  searchBarContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 15, 15, 0.85)",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 0,
    outlineStyle: "none",
  },
  clearButton: {
    padding: 4,
  },
  columnWrapper: {
    gap: GAP,
  },
  flatListContent: {
    gap: GAP,
    paddingBottom: 40,
    backgroundColor: "#000000",
  },
  masonryContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#000000",
  },
  masonryRow: {
    flexDirection: "row",
    gap: GAP,
    backgroundColor: "#000000",
  },
  masonryColumn: {
    flex: 1,
    gap: GAP,
    backgroundColor: "#000000",
  },
  gridItem: {
    width: "100%",
    position: "relative",
    backgroundColor: "#000000",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#000000",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  topBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  topBadgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
    marginLeft: 2.5,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 46,
    justifyContent: "flex-end",
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 16,
  },
  destinationTitle: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    lineHeight: 14.5,
  },
  destinationLocation: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 9.5,
    fontWeight: "500",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  badgeIconMargin: {
    marginRight: 2.5,
  },
  screenDarkBg: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  flex1: {
    flex: 1,
  },
  searchBarInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  imageSkeletonOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  imageSkeletonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  imageSkeletonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  searchBarLight: {
    backgroundColor: "rgba(100, 100, 100, 0.82)",
  },
  searchBarFocusedBase: {
    borderWidth: 1.5,
  },
  searchBarFocusedDark: {
    backgroundColor: "#121212",
  },
  searchBarFocusedLight: {
    backgroundColor: "rgba(100, 100, 100, 1)",
  },
  searchInputLight: {
    color: "#FFFFFF",
  },
  loadingMoreContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
export const categoryThemes = {
  "Florestas": { colors: ["rgba(15, 23, 21, 0.45)", "rgba(20, 33, 29, 0.55)", "rgba(27, 46, 41, 0.68)"], accent: "#4CAF50" },
  "Praias": { colors: ["rgba(11, 29, 38, 0.60)", "rgba(18, 46, 59, 0.70)", "rgba(26, 66, 82, 0.80)"], accent: "#00B4D8" },
  "Montanhas": { colors: ["rgba(26, 26, 26, 0.60)", "rgba(45, 45, 45, 0.70)", "rgba(61, 61, 61, 0.80)"], accent: "#FFA726" },
  "Cachoeiras": { colors: ["rgba(13, 27, 42, 0.60)", "rgba(27, 38, 59, 0.70)", "rgba(65, 90, 119, 0.80)"], accent: "#80DEEA" },
  "Deserto": { colors: ["rgba(43, 24, 16, 0.60)", "rgba(64, 37, 24, 0.70)", "rgba(87, 50, 32, 0.80)"], accent: "#FF7043" },
  "Neve": { colors: ["rgba(26, 36, 43, 0.60)", "rgba(44, 58, 69, 0.70)", "rgba(61, 80, 94, 0.80)"], accent: "#E0F7FA" },
  "Histórico": { colors: ["rgba(28, 22, 17, 0.60)", "rgba(46, 37, 29, 0.70)", "rgba(64, 51, 41, 0.80)"], accent: "#D4AF37" },
  "Urbano": { colors: ["rgba(20, 20, 25, 0.60)", "rgba(35, 35, 45, 0.70)", "rgba(48, 48, 61, 0.80)"], accent: "#90CAF9" },
  "Ilhas": { colors: ["rgba(10, 25, 30, 0.60)", "rgba(19, 43, 51, 0.70)", "rgba(28, 61, 71, 0.80)"], accent: "#26A69A" },
  "Interior": { colors: ["rgba(10, 10, 10, 0.70)", "rgba(18, 18, 18, 0.80)", "rgba(25, 25, 25, 0.90)"], accent: "#AED581" },
};

export const defaultTheme = {
  colors: ["#0A0A0A", "#050505"],
  accent: "#4CAF50",
};
