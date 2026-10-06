import { StyleSheet } from "react-native";

export const favoriteCardStyles = StyleSheet.create({
  card: {
    borderRadius: 18,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  cardInner: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1A1A1A",
  },
  cardLight: {
    backgroundColor: "#E0E0E0",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  imagePlaceholderDark: {
    backgroundColor: "#252525",
  },
  imagePlaceholderLight: {
    backgroundColor: "#E2E2E2",
  },
  cardPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardPlaceholderDark: {
    backgroundColor: "#222222",
  },
  cardPlaceholderLight: {
    backgroundColor: "#E5E5EA",
  },
  cardPlaceholderText: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
  cardPlaceholderTextDark: {
    color: "#777777",
  },
  cardPlaceholderTextLight: {
    color: "#8E8E93",
  },
  ratingBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.50)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
  },
  cardOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 36,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    marginBottom: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "500",
    marginLeft: 4,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default favoriteCardStyles;
