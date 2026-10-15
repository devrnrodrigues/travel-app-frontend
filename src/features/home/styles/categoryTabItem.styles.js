import { StyleSheet } from "react-native";

export default StyleSheet.create({
  categoryItem: {
    marginRight: 26,
  },
  centerAligned: {
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: "#FFFFFF",
  },
  categoryTextActive: {
    fontWeight: "800",
  },
  activeLine: {
    width: "100%",
    alignSelf: "stretch",
    height: 3.5,
    borderRadius: 3,
    marginTop: 5,
  },
});

export const getCategoryTextColor = (isActive, accentColor, isMinimalist, isDarkMode) => {
  if (isMinimalist) {
    if (isDarkMode) {
      return {
        color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)",
      };
    }
    return {
      color: isActive ? "#111111" : "rgba(0, 0, 0, 0.4)",
    };
  }
  return {
    color: isActive ? accentColor : "#FFFFFF",
  };
};

export const getActiveLineStyle = (accentColor, scaleX) => ({
  backgroundColor: accentColor,
  transform: [{ scaleX }],
});
