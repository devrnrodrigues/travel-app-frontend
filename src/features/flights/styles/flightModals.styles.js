import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const getSelectedBorder = (accent) => ({
  borderColor: accent,
});

export const getSelectedIconBg = (accent) => ({
  backgroundColor: `${accent}18`,
});

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalDestinationContent: {
    backgroundColor: "#161616",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  modalDestinationContentLight: {
    backgroundColor: "#FFFFFF",
  },
  modalSelectHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  modalSelectHeaderLight: {
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
  },
  modalSelectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalSelectTitleLight: {
    color: "#111827",
  },
  modalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: "#202020",
  },
  modalOptionItemLight: {
    backgroundColor: "#F7F8F9",
  },
  modalOptionItemSelected: {
    borderWidth: 1.5,
  },
  modalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalOptionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  modalOptionIconBoxLight: {
    backgroundColor: "#E5E7EB",
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  modalOptionTextLight: {
    color: "#111827",
  },
  modalOptionTextSelected: {
    fontWeight: "700",
  },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
  },
  closeModalButtonLight: {
    backgroundColor: "#F3F4F6",
  },
  closeModalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeModalButtonTextLight: {
    color: "#4B5563",
  },
});
