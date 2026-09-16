import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const SPACING = 10;

export default StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: "800", textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  headerIcons: { flexDirection: "row" },
  iconButton: {
    padding: 12,
    borderRadius: 15,
    marginLeft: 12,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  iconButtonDark: {
    backgroundColor: "rgba(0, 0, 0, 0.70)",
  },
  iconButtonLight: {
    backgroundColor: "rgba(100, 100, 100, 0.40)",
  },
  categoriesSection: { height: 80, justifyContent: "center" },
  categoriesContainer: { paddingLeft: 25, alignItems: "center" },
  categoryItem: { marginRight: 30 },
  categoryText: { fontSize: 17, fontWeight: "600", textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  categoryTextActive: { fontWeight: "bold" },
  activeLine: { width: "100%", alignSelf: "stretch", height: 3.5, borderRadius: 3, marginTop: 5 },
  contentContainer: { flex: 1, justifyContent: "center", paddingBottom: 105 },
  cardsList: { paddingHorizontal: 15, alignItems: 'center' },
  card: {
    width: CARD_WIDTH,
    height: 500,
    marginHorizontal: SPACING,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#121212",
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  cardImage: { width: "100%", height: "100%", position: 'absolute', opacity: 0.9 },
  cardInfo: {
    position: "absolute",
    bottom: 25,
    alignSelf: 'center',
    width: '88%',
    height: 104,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF", lineHeight: 24 },
  cardLocation: { fontSize: 13, color: "#FFF", marginTop: 3 },
  ratingContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  ratingText: { marginLeft: 5, fontSize: 14, fontWeight: "bold" },
  flex1: {
    flex: 1,
  },
  blackScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
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
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#FFF",
    paddingHorizontal: 15,
  },
  searchFilterRow: {
    marginHorizontal: -20,
  },
  filterBtn: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtnActiveText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  filterBtnInactiveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
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
  marginRight15: {
    marginRight: 15,
  },
  marginRight20: {
    marginRight: 20,
  },
  searchListWrapper: {
    flex: 1,
    marginHorizontal: -20,
  },
  searchEmptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  whiteText: {
    color: "#FFF",
  },
  searchCardImageWrapper: {
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchCardSkeletonDark: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  searchCardSkeletonLight: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  searchCardInfo: {
    marginLeft: 14,
    flex: 1,
    justifyContent: "center",
  },
  searchCardTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  searchCardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  searchCardLocationText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },
  searchCardBadgesContainer: {
    position: "absolute",
    top: 8,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchCardPriceBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  searchCardRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  searchCardBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  searchCardRatingText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  marginRight3: {
    marginRight: 3,
  },
  centerAligned: {
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginLeft5: {
    marginLeft: 5,
  },
  cardFullBackground: {
    position: "absolute",
    width: CARD_WIDTH,
    height: 500,
    bottom: -25,
    left: -(CARD_WIDTH * 0.06),
    borderRadius: 25,
  },
  cardInfoInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cardInfoLeft: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  countryListScroll: {
    maxHeight: 350,
    marginTop: 10,
  },
  flag18: {
    fontSize: 18,
    marginRight: 10,
  },
  flag16: {
    fontSize: 16,
    marginRight: 10,
  },
  searchCardDark: {
    backgroundColor: "rgba(12, 12, 12, 0.85)",
  },
  searchCardLight: {
    backgroundColor: "rgba(100, 100, 100, 0.30)",
  },
  cardOverlayImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  cardSkeletonDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.60)",
  },
  cardSkeletonLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  cardInfoLightBg: {
    backgroundColor: "rgba(100, 100, 100, 0.50)",
  },
  filterCategoriesContent: {
    paddingLeft: 20,
    paddingRight: 35,
    alignItems: "center",
  },
  searchBarContainerLight: {
    backgroundColor: "rgba(100, 100, 100, 0.82)",
  },
  countryItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  fullBlackScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  searchCardBase: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  searchInputBox: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
  },
  searchFiltersArea: {
    overflow: "hidden",
  },
  countryModalDark: {
    backgroundColor: "rgba(0, 0, 0, 0.78)",
  },
  countryModalLight: {
    backgroundColor: "rgba(100, 100, 100, 0.82)",
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
});

export const countryModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.90)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    borderWidth: 0,
    borderColor: "transparent",
    zIndex: 2,
  },
  dragHandleArea: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  countryName: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
});
