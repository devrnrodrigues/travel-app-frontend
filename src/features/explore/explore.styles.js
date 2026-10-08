import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 0;
const GAP = 1;
const COLUMN_WIDTH = (width - GAP * 2) / 3;
const CARD_HEIGHT = Math.round(COLUMN_WIDTH * 1.52);

export { COLUMN_WIDTH, CARD_HEIGHT, GAP, HORIZONTAL_PADDING };

export const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  screenDarkBg: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  flex1: {
    flex: 1,
  },
  columnWrapper: {
    gap: GAP,
  },
  gridItem: {
    width: COLUMN_WIDTH,
    height: CARD_HEIGHT,
    position: "relative",
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  gridItemLight: {
    backgroundColor: "rgba(180, 180, 180, 0.45)",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 46,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
  },
  flatListContent: {
    flexGrow: 1,
    gap: GAP,
    backgroundColor: "transparent",
  },
  listFooterWrapper: {
    paddingTop: GAP,
  },
  bgDark: {
    backgroundColor: "#000000",
  },
  bgLight: {
    backgroundColor: "#E5E7EB",
  },
});

export const categoryThemes = {
  "Florestas": { colors: ["rgba(15, 23, 21, 0.45)", "rgba(20, 33, 29, 0.55)", "rgba(27, 46, 41, 0.68)"], accent: "#4CAF50" },
  "florestas": { colors: ["rgba(15, 23, 21, 0.45)", "rgba(20, 33, 29, 0.55)", "rgba(27, 46, 41, 0.68)"], accent: "#4CAF50" },
  "Praias": { colors: ["rgba(11, 29, 38, 0.60)", "rgba(18, 46, 59, 0.70)", "rgba(26, 66, 82, 0.80)"], accent: "#00B4D8" },
  "praias": { colors: ["rgba(11, 29, 38, 0.60)", "rgba(18, 46, 59, 0.70)", "rgba(26, 66, 82, 0.80)"], accent: "#00B4D8" },
  "Montanhas": { colors: ["rgba(26, 26, 26, 0.60)", "rgba(45, 45, 45, 0.70)", "rgba(61, 61, 61, 0.80)"], accent: "#FFA726" },
  "montanhas": { colors: ["rgba(26, 26, 26, 0.60)", "rgba(45, 45, 45, 0.70)", "rgba(61, 61, 61, 0.80)"], accent: "#FFA726" },
  "Cachoeiras": { colors: ["rgba(13, 27, 42, 0.60)", "rgba(27, 38, 59, 0.70)", "rgba(65, 90, 119, 0.80)"], accent: "#80DEEA" },
  "cachoeiras": { colors: ["rgba(13, 27, 42, 0.60)", "rgba(27, 38, 59, 0.70)", "rgba(65, 90, 119, 0.80)"], accent: "#80DEEA" },
  "Deserto": { colors: ["rgba(43, 24, 16, 0.60)", "rgba(64, 37, 24, 0.70)", "rgba(87, 50, 32, 0.80)"], accent: "#FF7043" },
  "deserto": { colors: ["rgba(43, 24, 16, 0.60)", "rgba(64, 37, 24, 0.70)", "rgba(87, 50, 32, 0.80)"], accent: "#FF7043" },
  "Neve": { colors: ["rgba(26, 36, 43, 0.60)", "rgba(44, 58, 69, 0.70)", "rgba(61, 80, 94, 0.80)"], accent: "#E0F7FA" },
  "neve": { colors: ["rgba(26, 36, 43, 0.60)", "rgba(44, 58, 69, 0.70)", "rgba(61, 80, 94, 0.80)"], accent: "#E0F7FA" },
  "Histórico": { colors: ["rgba(28, 22, 17, 0.60)", "rgba(46, 37, 29, 0.70)", "rgba(64, 51, 41, 0.80)"], accent: "#D4AF37" },
  "historico": { colors: ["rgba(28, 22, 17, 0.60)", "rgba(46, 37, 29, 0.70)", "rgba(64, 51, 41, 0.80)"], accent: "#D4AF37" },
  "Urbano": { colors: ["rgba(20, 20, 25, 0.60)", "rgba(35, 35, 45, 0.70)", "rgba(48, 48, 61, 0.80)"], accent: "#90CAF9" },
  "urbano": { colors: ["rgba(20, 20, 25, 0.60)", "rgba(35, 35, 45, 0.70)", "rgba(48, 48, 61, 0.80)"], accent: "#90CAF9" },
  "Ilhas": { colors: ["rgba(10, 25, 30, 0.60)", "rgba(19, 43, 51, 0.70)", "rgba(28, 61, 71, 0.80)"], accent: "#26A69A" },
  "ilhas": { colors: ["rgba(10, 25, 30, 0.60)", "rgba(19, 43, 51, 0.70)", "rgba(28, 61, 71, 0.80)"], accent: "#26A69A" },
  "Interior": { colors: ["rgba(10, 10, 10, 0.70)", "rgba(18, 18, 18, 0.80)", "rgba(25, 25, 25, 0.90)"], accent: "#AED581" },
  "interior": { colors: ["rgba(10, 10, 10, 0.70)", "rgba(18, 18, 18, 0.80)", "rgba(25, 25, 25, 0.90)"], accent: "#AED581" },
  "Cidades": { colors: ["rgba(16, 24, 40, 0.60)", "rgba(28, 41, 66, 0.70)", "rgba(42, 60, 92, 0.80)"], accent: "#3B82F6" },
  "cidades": { colors: ["rgba(16, 24, 40, 0.60)", "rgba(28, 41, 66, 0.70)", "rgba(42, 60, 92, 0.80)"], accent: "#3B82F6" },
  "Cidade": { colors: ["rgba(16, 24, 40, 0.60)", "rgba(28, 41, 66, 0.70)", "rgba(42, 60, 92, 0.80)"], accent: "#3B82F6" },
  "cidade": { colors: ["rgba(16, 24, 40, 0.60)", "rgba(28, 41, 66, 0.70)", "rgba(42, 60, 92, 0.80)"], accent: "#3B82F6" },
};

export const defaultTheme = {
  colors: ["#0A0A0A", "#050505"],
  accent: "#4CAF50",
};

export default exploreStyles;
