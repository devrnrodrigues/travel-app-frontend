import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
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
  searchInputLight: {
    color: "#000000",
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
    borderWidth: 1,
    borderColor: "rgba(22, 22, 22, 0.6)"
  },
  cardLight: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.20)",
    backgroundColor: "rgba(255, 255, 255, 0.40)",
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
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    marginLeft: 8,
  },
  ratingBadgeLight: {
    backgroundColor: "rgba(0, 0, 0, 0.22)",
  },
  ratingStar: {
    marginRight: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  ratingTextLight: {
    color: "#FFFFFF",
  },
  favoritesBlurContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 118,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "transparent",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }
      : {}),
  },
  favoritesBlurContainerDark: {
    backgroundColor: "rgba(10, 10, 10, 0.45)",
  },
  favoritesBlurContainerEmpty: {
    marginTop: 22,
    marginBottom: 132,
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  emptyBlurCard: {
    flex: 1,
    width: "100%",
    minHeight: 380,
    borderRadius: 26,
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingVertical: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }
      : {}),
  },
  emptyBlurCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.55)",
  },
  emptyBlurCardOverlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: "rgba(255, 255, 255, 0.94)",
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 250,
    marginBottom: 18,
  },
  emptyActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 0,
  },
  emptyActionBtnText: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 13,
    fontWeight: "600",
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
    backgroundColor: "#000000",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
  },
  dialogCardLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
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
  titleLight: {
    color: "#000000",
  },
  message: {
    fontSize: 13.5,
    color: "#E5E5E5",
    textAlign: "center",
    lineHeight: 19,
  },
  messageLight: {
    color: "#555555",
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
  actionButtonLight: {
    borderTopColor: "rgba(0, 0, 0, 0.08)",
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
  cancelTextLight: {
    color: "#000000",
  },
});
