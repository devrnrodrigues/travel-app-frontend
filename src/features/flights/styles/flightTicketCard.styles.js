import { StyleSheet } from "react-native";

export const getTicketCardBorder = (accent) => ({
  borderColor: accent,
});

export const getSelectButtonDarkStyle = (accent) => ({
  borderColor: accent,
});

export const getSelectButtonTextDarkStyle = (accent) => ({
  color: accent,
});

export default StyleSheet.create({
  ticketCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  ticketCardDark: {
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  ticketCardLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 0,
    marginHorizontal: 3,
    marginVertical: 4,
  },
  ticketCardSelected: {
    borderWidth: 2,
  },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  companyLogo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 6,
  },
  fallbackAirplaneIcon: {
    marginRight: 6,
  },
  companyName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  companyNameDark: {
    color: "#FFFFFF",
  },
  companyNameLight: {
    color: "#111827",
    fontWeight: "700",
  },
  stopsBadge: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stopsBadgeDark: {
    color: "#8E8E93",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  stopsBadgeLight: {
    color: "#0D9488",
    backgroundColor: "rgba(13, 148, 136, 0.12)",
    fontWeight: "700",
  },
  flightRoute: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  flightInfo: {
    flex: 1,
  },
  flightInfoEnd: {
    flex: 1,
    alignItems: "flex-end",
  },
  flightTime: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  flightTimeDark: {
    color: "#FFFFFF",
  },
  flightTimeLight: {
    color: "#111827",
    fontWeight: "700",
  },
  flightLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  flightLabelDark: {
    color: "#8E8E93",
  },
  flightLabelLight: {
    color: "#6B7280",
  },
  routeLineContainer: {
    flex: 1.2,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  durationTextDark: {
    color: "#8E8E93",
  },
  durationTextLight: {
    color: "#6B7280",
  },
  routeLine: {
    width: "100%",
    height: 1.5,
    borderRadius: 1,
  },
  routeLineDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  routeLineLight: {
    backgroundColor: "#E5E7EB",
    height: 1,
  },
  flightReturnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  flightReturnRowDark: {
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  flightReturnRowLight: {
    borderTopColor: "rgba(0, 0, 0, 0.04)",
  },
  baggageContainer: {
    marginTop: 10,
    marginBottom: 2,
  },
  baggageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  baggageRowLast: {
    flexDirection: "row",
    alignItems: "center",
  },
  baggageIcon: {
    marginRight: 4,
  },
  baggageTextDark: {
    fontSize: 12,
    color: "#8E8E93",
  },
  baggageTextLight: {
    fontSize: 12,
    color: "#6B7280",
  },
  ticketCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 10,
  },
  ticketCardFooterDark: {
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  ticketCardFooterLight: {
    borderTopColor: "rgba(0, 0, 0, 0.04)",
  },
  cardPriceLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardPriceLabelDark: {
    color: "#8E8E93",
  },
  cardPriceLabelLight: {
    color: "#6B7280",
  },
  cardPriceValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardPriceValueDark: {
    color: "#FFFFFF",
  },
  cardPriceValueLight: {
    color: "#111827",
    fontWeight: "800",
  },
  cardSelectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  cardSelectButtonDark: {
    borderWidth: 1,
  },
  cardSelectButtonLight: {
    backgroundColor: "#161616",
    borderWidth: 0,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 0,
  },
  cardSelectButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  cardSelectButtonTextDark: {
    color: "#FFFFFF",
  },
  cardSelectButtonTextLight: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
