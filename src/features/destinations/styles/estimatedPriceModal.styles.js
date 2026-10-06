import { StyleSheet } from "react-native";

export const estimatedPriceStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "82%",
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardDark: {
    backgroundColor: "#000000",
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
  textLight: {
    color: "#FFFFFF",
  },
  textDark: {
    color: "#111827",
  },
  subtitleDark: {
    color: "#A1A1AA",
  },
  subtitleLight: {
    color: "#6B7280",
  },
  scrollContent: {
    paddingBottom: 4,
  },
  heroSection: {
    marginTop: 4,
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  avgDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  avgText: {
    fontSize: 13,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
  },
  separatorDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  separatorLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  breakdownList: {
    marginBottom: 14,
  },
  breakdownRowWrapper: {
    paddingVertical: 13,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: {
    justifyContent: "center",
  },
  titleWithInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIconButton: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  hotelInfoContainer: {
    marginTop: 2,
    overflow: "hidden",
  },
  hotelInfoText: {
    fontSize: 11,
    lineHeight: 15,
  },
  rowBorderDark: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  rowBorderLight: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
  },
  rowLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    textAlign: "left",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowRange: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  rowAvg: {
    fontSize: 12,
    marginTop: 2,
  },
  disclaimerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  disclaimerContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  disclaimerContainerLight: {
    backgroundColor: "#F4F4F5",
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  disclaimerDark: {
    color: "#A1A1AA",
  },
  disclaimerLight: {
    color: "#6B7280",
  },
  skeletonWrapper: {
    marginVertical: 4,
  },
  skeletonSpacing: {
    marginTop: 8,
  },
  skeletonSmallSpacing: {
    marginTop: 5,
  },
  alignEnd: {
    alignItems: "flex-end",
  },
});

export default estimatedPriceStyles;
