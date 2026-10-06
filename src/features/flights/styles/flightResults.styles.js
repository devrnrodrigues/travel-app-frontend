import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const getAccentBg = (accent) => ({
  backgroundColor: accent,
});

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingTextDark: {
    color: "#8E8E93",
  },
  loadingTextLight: {
    color: "#4B5563",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  errorTextDark: {
    color: "#EF4444",
  },
  errorTextLight: {
    color: "#DC2626",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyIconMargin: {
    marginBottom: 12,
  },
  footerPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.07,
    paddingVertical: 18,
    borderTopWidth: 1,
  },
  footerPriceRowDark: {
    backgroundColor: "#0A0A0A",
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  footerPriceRowLight: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 0,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  priceLabelDark: {
    color: "#8E8E93",
  },
  priceLabelLight: {
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  priceValueDark: {
    color: "#FFFFFF",
  },
  priceValueLight: {
    color: "#111827",
    fontWeight: "800",
  },
});
