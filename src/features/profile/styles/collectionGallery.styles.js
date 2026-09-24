import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  containerLight: {
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  backButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  headerTitleLight: {
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
    fontWeight: "500",
  },
  headerSubtitleLight: {
    color: "#666666",
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  gridItem: {
    overflow: "hidden",
    backgroundColor: "#161616",
  },
  gridItemLight: {
    backgroundColor: "#F0F0F0",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  modalOverlayLight: {
    backgroundColor: "#FFFFFF",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  modalCloseButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  webViewerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  webModalImage: {
    width: "90%",
    height: "82%",
    maxWidth: 1200,
    maxHeight: 850,
  },
  webNavButton: {
    position: "absolute",
    top: "50%",
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
  },
  webNavButtonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  webNavButtonLeft: {
    left: 24,
  },
  webNavButtonRight: {
    right: 24,
  },
  modalSlide: {
    width: SCREEN_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  captionPill: {
    position: "absolute",
    bottom: 38,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    maxWidth: SCREEN_WIDTH - 60,
    zIndex: 20,
  },
  captionPillLight: {
    backgroundColor: "rgba(0, 0, 0, 0.07)",
  },
  captionPillText: {
    fontFamily: "Caveat-Bold",
    fontSize: 17,
    color: "#FFFFFF",
    paddingRight: 6,
    paddingLeft: 2,
  },
  captionPillTextLight: {
    color: "#000000",
  },
  editDialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  editDialogBox: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 22,
    padding: 24,
    backgroundColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  editDialogBoxLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
    shadowOpacity: 0.15,
  },
  editDialogTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  editDialogTitleLight: {
    color: "#000000",
  },
  editDialogSubtitle: {
    fontSize: 13,
    color: "#D8D8DC",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 18,
  },
  editDialogSubtitleLight: {
    color: "#666666",
  },
  editDialogInput: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#111111",
    color: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  editDialogInputLight: {
    backgroundColor: "#F2F2F7",
    color: "#000000",
    borderColor: "transparent",
  },
  editDialogInputFocused: {
    borderColor: "#FFFFFF",
  },
  editDialogInputFocusedLight: {
    borderColor: "#000000",
  },
  charCountRow: {
    alignItems: "flex-end",
    marginTop: 6,
    marginRight: 4,
  },
  charCountText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  charCountTextLight: {
    color: "#8E8E93",
  },
  editDialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 18,
    gap: 10,
  },
  editDialogCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  editDialogCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  editDialogSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  editDialogSaveBtnLight: {
    backgroundColor: "#000000",
  },
  editDialogSaveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  editDialogSaveTextLight: {
    color: "#FFFFFF",
  },
});
