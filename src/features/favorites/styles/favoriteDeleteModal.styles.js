import { StyleSheet } from "react-native";

export const favoriteDeleteModalStyles = StyleSheet.create({
  overlay: {
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
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    overflow: "hidden",
  },
  dialogCardLight: {
    backgroundColor: "#FFFFFF",
  },
  contentSection: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  titleLight: {
    color: "#000000",
  },
  message: {
    fontSize: 13.5,
    color: "#E5E5E5",
    textAlign: "center",
    lineHeight: 19,
  },
  messageLight: {
    color: "#555555",
  },
  actionButton: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "transparent",
  },
  actionButtonLight: {
    borderTopColor: "rgba(0, 0, 0, 0.08)",
  },
  lastButton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelTextLight: {
    color: "#000000",
  },
});

export default favoriteDeleteModalStyles;
