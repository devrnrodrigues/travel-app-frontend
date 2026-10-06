import { StyleSheet } from "react-native";

export const getAccentBg = (accent) => ({
  backgroundColor: accent,
});

export const getAccentBorder = (accent) => ({
  borderColor: accent,
});

export const getAccentText = (accent) => ({
  color: accent,
  fontWeight: "700",
});

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#161616",
    borderRadius: 24,
    padding: 20,
  },
  modalContentLight: {
    backgroundColor: "#FFFFFF",
  },
  calendarSelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarNavButtonLight: {
    backgroundColor: "#F3F4F6",
  },
  calendarNavButtonDisabled: {
    opacity: 0.3,
  },
  calendarTitleContainer: {
    alignItems: "center",
  },
  calendarTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  calendarTitleTextLight: {
    color: "#111827",
  },
  calendarDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 14,
  },
  calendarDividerLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calendarHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  calendarHeaderCellLight: {
    color: "#9CA3AF",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
  },
  calendarDayTile: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDayTileActive: {
    borderRadius: 19,
  },
  calendarDayTileOutline: {
    borderWidth: 1.5,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  calendarDayTextLight: {
    color: "#111827",
  },
  calendarDayTextActive: {
    color: "#000000",
    fontWeight: "700",
  },
  calendarDayTextDisabled: {
    color: "rgba(255, 255, 255, 0.2)",
  },
  calendarDayTextDisabledLight: {
    color: "#D1D5DB",
  },
  calendarDayTextOtherMonth: {
    color: "rgba(255, 255, 255, 0.15)",
  },
  calendarDayTextOtherMonthLight: {
    color: "#D1D5DB",
  },
  calendarFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  calendarFooterRowLight: {
    borderTopColor: "rgba(0, 0, 0, 0.06)",
  },
  calendarCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
  },
  calendarCancelTextLight: {
    color: "#6B7280",
  },
  calendarDoneButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  calendarDoneButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
});
