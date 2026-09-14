import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  flex1: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 12,
    borderRadius: 15,
    marginLeft: 12,
  },
  iconButtonDark: {
    backgroundColor: "rgba(0, 0, 0, 0.70)",
  },
  iconButtonLight: {
    backgroundColor: "rgba(100, 100, 100, 0.40)",
  },
  searchBarWrapper: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  searchIconBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarInner: {
    width: width - 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: "100%",
  },
  searchLeadingIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 0,
  },
  searchActionBtn: {
    padding: 4,
    marginRight: 2,
  },
  searchCloseBtn: {
    padding: 4,
  },
  cardBase: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardDark: {
    backgroundColor: "rgba(12, 12, 12, 0.82)",
  },
  cardLight: {
    backgroundColor: "rgba(100, 100, 100, 0.65)",
  },
  imageWrapper: {
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageSkeletonDark: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  imageSkeletonLight: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  cardInfo: {
    marginLeft: 14,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 5,
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  emptySubtitleDark: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    textAlign: "center",
  },
  emptySubtitleLight: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    textAlign: "center",
  },
  whiteText: {
    color: "#FFFFFF",
  },
  boldWhiteText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchBarLight: {
    backgroundColor: "rgba(100, 100, 100, 0.82)",
  },
});

export const dialogStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 275,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
  },
  contentSection: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 13.5,
    color: "#E5E5E5",
    textAlign: "center",
    lineHeight: 19,
  },
  actionButton: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
  },
  lastButton: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
