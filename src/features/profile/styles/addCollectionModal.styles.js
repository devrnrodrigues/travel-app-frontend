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
  photosSection: {
    marginBottom: 24,
  },
  addPhotosButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  addPhotosButtonLight: {
    borderColor: "rgba(0, 0, 0, 0.25)",
  },
  addPhotosText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addPhotosTextLight: {
    color: "#000000",
  },
  photosScroll: {
    flexDirection: "row",
    gap: 10,
  },
  photoThumbnailWrapper: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginRight: 10,
  },
  photoThumbnail: {
    width: "100%",
    height: "100%",
  },
  removePhotoBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});

export const getSubmitButtonBg = (accentColor) => ({
  backgroundColor: accentColor,
});
