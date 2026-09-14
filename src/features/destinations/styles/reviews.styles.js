import { StyleSheet } from "react-native";

const reviewStyles = StyleSheet.create({
  descriptionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
  },

  inlineActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#161616",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },

  inlineActionText: {
    fontSize: 12,
    fontWeight: "750",
  },

  commentSectionContainer: {
    marginTop: 24,
    paddingTop: 0,
  },

  commentSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  commentsFeed: {
    paddingVertical: 0,
  },

  reviewCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },

  reviewCardLight: {
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },

  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginTop: 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    flexShrink: 0,
  },

  avatarContainerLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  avatarInitials: {
    fontSize: 14,
    fontWeight: "750",
    color: "#FFFFFF",
  },

  reviewContentColumn: {
    flex: 1,
  },

  reviewerName: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },

  reviewerNameLight: {
    color: "#1F2937",
  },

  starsShopeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    marginBottom: 2,
  },

  reviewDate: {
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 6,
  },

  reviewDateLight: {
    color: "#9CA3AF",
  },

  reviewComment: {
    color: "#E5E7EB",
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: "400",
    marginBottom: 8,
  },

  reviewCommentLight: {
    color: "#374151",
  },

  commentFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 12,
  },

  helpfulText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },

  moreOptionsBtn: {
    padding: 6,
    marginRight: -4,
    justifyContent: "center",
    alignItems: "center",
  },

  anchoredDropdown: {
    position: "absolute",
    bottom: 30,
    right: 0,
    minWidth: 116,
    backgroundColor: "#161616",
    borderRadius: 13,
    paddingVertical: 4,
    zIndex: 9999,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  anchoredDropdownLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  anchoredDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
  },

  anchoredDropdownText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  anchoredDropdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 8,
  },

  anchoredDropdownDividerLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },

  menuModalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  dropdownMenuCard: {
    width: "100%",
    maxWidth: 260,
    backgroundColor: "#161616",
    borderRadius: 18,
    paddingVertical: 6,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  dropdownMenuCardLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  dropdownMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dropdownMenuText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },

  dropdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  dropdownDividerLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },

  userInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "80%",
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "800",
  },

  starsIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexShrink: 0,
  },

  commentBodyContainer: {
    width: "100%",
    paddingHorizontal: 2,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#161616",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },

  emptyText: {
    color: "#FFFFFF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  formCard: {
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    padding: 22,
    borderRadius: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 0,
    borderColor: "transparent",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  formLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  starsRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#0E0E0E",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },

  inputLight: {
    backgroundColor: "rgba(45, 45, 45, 0.65)",
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  submitBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  submitBtnText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 15,
  },

  commentActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },

  commentActionBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  dialogOverlay: {
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
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
  },

  dialogContentSection: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: "center",
  },

  dialogTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },

  dialogMessage: {
    fontSize: 13.5,
    color: "#E5E5E5",
    textAlign: "center",
    lineHeight: 19,
  },

  dialogActionButton: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
  },

  dialogLastButton: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  dialogDeleteText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
  },

  dialogCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  menuRelative: {
    position: "relative",
  },
  flex1MarginRight10: {
    flex: 1,
    marginRight: 10,
  },
  editedInfoTextDark: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 3,
  },
  editedInfoTextLight: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    marginTop: 3,
  },
  marginTop2: {
    marginTop: 2,
  },
  marginRight8: {
    marginRight: 8,
  },
  reviewModalTextInput: {
    flex: 1,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
});

export default reviewStyles;
