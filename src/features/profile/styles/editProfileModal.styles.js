import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    maxHeight: "90%",
    backgroundColor: "#161616",
  },
  modalContentLight: {
    backgroundColor: "#FFFFFF",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "center",
    marginBottom: 20,
  },
  dragHandleLight: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  modalTitleLight: {
    color: "#000000",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldLabelLight: {
    color: "rgba(0, 0, 0, 0.55)",
  },
  countryDropdown: {
    borderRadius: 14,
    marginTop: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(30, 30, 30, 0.95)",
  },
  countryDropdownLight: {
    backgroundColor: "#F7F7F7",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  countryItemLight: {
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 10,
  },
  countryName: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  countryNameLight: {
    color: "#000000",
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});

export const getCountryDropdownAnimatedStyle = (heightAnim, opacityAnim) => ({
  maxHeight: heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  }),
  opacity: opacityAnim,
});

export const getSaveButtonBg = (accentColor) => ({
  backgroundColor: accentColor,
});
