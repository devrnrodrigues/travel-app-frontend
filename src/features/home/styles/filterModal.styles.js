import { StyleSheet } from "react-native";

export const filterModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.90)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    borderWidth: 0,
    borderColor: "transparent",
    zIndex: 2,
  },
  sheetDark: {
    backgroundColor: "#000000",
  },
  sheetLight: {
    backgroundColor: "#FFFFFF",
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  dragHandleArea: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  indicatorDark: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  indicatorLight: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleDark: {
    color: "#FFFFFF",
  },
  titleLight: {
    color: "#000000",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  subtitleDark: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  subtitleLight: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  countryListScroll: {
    maxHeight: 350,
    marginTop: 10,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 0,
    borderColor: "transparent",
  },
  countryItemDark: {
    backgroundColor: "transparent",
  },
  countryItemLight: {
    backgroundColor: "#F7F7F9",
  },
  countryItemActiveDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  countryItemActiveLight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  countryName: {
    fontSize: 15,
    fontWeight: "500",
  },
  countryNameDark: {
    color: "#FFFFFF",
  },
  countryNameLight: {
    color: "#000000",
  },
  countryNameActive: {
    fontWeight: "bold",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginRight6: {
    marginRight: 6,
  },
  marginRight10: {
    marginRight: 10,
  },
  flag18: {
    fontSize: 18,
    marginRight: 10,
  },
  flag16: {
    fontSize: 16,
    marginRight: 10,
  },
});

export const getActiveItemBorderStyle = (accentColor) => ({
  borderWidth: 0,
});

export const getActiveItemTextStyle = (accentColor) => ({
  color: accentColor,
});

export const getModalTranslateStyle = (translateY) => ({
  transform: [{ translateY }],
});
