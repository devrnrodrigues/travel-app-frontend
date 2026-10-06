import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const getAccentBg = (accent) => ({
  backgroundColor: accent,
});

export const getPaddingBottom = (padding) => ({
  paddingBottom: padding,
});

export const getSwitchTrackStyle = (backgroundColor) => ({
  backgroundColor,
});

export const getSwitchThumbStyle = (translateX, backgroundColor) => ({
  transform: [{ translateX }],
  backgroundColor,
});

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 0,
    paddingHorizontal: width * 0.07,
  },
  tripTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  tripTypeContainerLight: {
    backgroundColor: "#F3F4F6",
  },
  tripTypeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tripTypeTextActive: {
    color: "#000000",
    fontWeight: "700",
  },
  tripTypeTextInactiveLight: {
    color: "#6B7280",
  },
  tripTypeTextInactiveDark: {
    color: "#8E8E93",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputLabelDark: {
    color: "#FFFFFF",
  },
  inputLabelLight: {
    color: "#111827",
    fontWeight: "800",
  },
  inputSearchContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  inputSearchContainerError: {
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 4,
  },
  textInputField: {
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
  },
  textInputFieldDark: {
    backgroundColor: "#161616",
    color: "#FFFFFF",
  },
  textInputFieldLight: {
    backgroundColor: "#F7F8F9",
    color: "#111827",
    borderWidth: 0,
    elevation: 0,
  },
  inputSpinner: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  fieldErrorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -14,
    marginBottom: 16,
    marginLeft: 4,
  },
  fieldErrorTextCentered: {
    color: "#EF4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 0,
  },
  autocompleteContainer: {
    borderRadius: 16,
    marginTop: -12,
    marginBottom: 20,
    paddingVertical: 6,
    overflow: "hidden",
  },
  autocompleteContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
  },
  autocompleteContainerLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    elevation: 0,
  },
  autocompleteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },
  autocompleteItemLight: {
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  autocompleteIcon: {
    marginRight: 8,
  },
  autocompleteText: {
    fontSize: 14,
    flex: 1,
  },
  autocompleteTextDark: {
    color: "#FFFFFF",
  },
  autocompleteTextLight: {
    color: "#111827",
  },
  input: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    justifyContent: "center",
    elevation: 0,
  },
  inputDark: {
    backgroundColor: "#161616",
  },
  inputLight: {
    backgroundColor: "#F7F8F9",
    borderWidth: 0,
    elevation: 0,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1,
    marginBottom: 4,
  },
  selectContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 15,
  },
  inputTextDark: {
    color: "#FFFFFF",
  },
  inputTextLight: {
    color: "#111827",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputCol: {
    flex: 1,
    marginRight: 10,
  },
  inputColLast: {
    flex: 1,
    marginRight: 0,
  },
  labelCol: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  labelColDark: {
    color: "#FFFFFF",
  },
  labelColLight: {
    color: "#6B7280",
    fontWeight: "800",
  },
  inputCenter: {
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputCenterDark: {
    backgroundColor: "#161616",
    color: "#FFFFFF",
  },
  inputCenterLight: {
    backgroundColor: "#F7F8F9",
    color: "#111827",
    borderWidth: 0,
    elevation: 0,
  },
  inputCenterError: {
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  fieldLimitNotice: {
    fontSize: 12,
    color: "#F59E0B",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 16,
  },
  childrenAgesWrapper: {
    marginBottom: 20,
  },
  childrenAgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  childAgeCard: {
    width: "47%",
    marginHorizontal: "1.5%",
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#161616",
  },
  childAgeCardLight: {
    backgroundColor: "#F7F8F9",
  },
  childAgeCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  childAgeValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childAgeCardValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  childAgeCardValueDark: {
    color: "#FFFFFF",
  },
  childAgeCardValueLight: {
    color: "#111827",
  },
  directToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161616",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  directToggleContainerLight: {
    backgroundColor: "#F7F8F9",
  },
  directToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  directToggleIcon: {
    marginRight: 10,
  },
  directToggleText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
  directToggleTextDark: {
    color: "#FFFFFF",
  },
  directToggleTextLight: {
    color: "#111827",
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  priceValueDark: {
    color: "#FFFFFF",
  },
  priceValueLight: {
    color: "#111827",
    fontWeight: "800",
  },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    elevation: 0,
  },
  actionButtonDark: {
    elevation: 0,
  },
  actionButtonLight: {
    backgroundColor: "#000000",
    elevation: 0,
  },
});
