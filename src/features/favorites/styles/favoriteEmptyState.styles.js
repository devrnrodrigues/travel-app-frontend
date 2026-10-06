import { StyleSheet } from "react-native";

export const favoriteEmptyStateStyles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyIconDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  emptyIconLight: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    alignSelf: "center",
    color: "#FFFFFF",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 18,
    color: "rgba(255, 255, 255, 0.70)",
  },
});

export default favoriteEmptyStateStyles;
