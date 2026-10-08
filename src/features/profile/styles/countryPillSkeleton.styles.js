import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  gap8: {
    gap: 8,
  },
  pill: {
    height: 35,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
    position: "relative",
  },
  pillLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 3,
    marginRight: 8,
  },
  flagIconDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  flagIconLight: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  labelBar: {
    flex: 1,
    height: 14,
    borderRadius: 4,
  },
  labelBarDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  labelBarLight: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
});

export const getPillWidthStyle = (width) => ({
  width,
});
