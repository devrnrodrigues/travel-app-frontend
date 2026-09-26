export const THEMES_BY_CAT = {
  0: {
    colors: ["rgba(15, 23, 21, 0.45)", "rgba(20, 33, 29, 0.55)", "rgba(27, 46, 41, 0.68)"],
    accent: "#4CAF50",
    icon: "leaf",
    bg: require("../assets/welcome-bg.jpg"),
  },
  1: {
    colors: ["rgba(11, 29, 38, 0.60)", "rgba(18, 46, 59, 0.70)", "rgba(26, 66, 82, 0.80)"],
    accent: "#00B4D8",
    icon: "waves",
    bg: "https://images.pexels.com/photos/21832892/pexels-photo-21832892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  2: {
    colors: ["rgba(26, 26, 26, 0.60)", "rgba(45, 45, 45, 0.70)", "rgba(61, 61, 61, 0.80)"],
    accent: "#FFA726",
    icon: "image-filter-hdr",
    bg: "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  3: {
    colors: ["rgba(13, 27, 42, 0.60)", "rgba(27, 38, 59, 0.70)", "rgba(65, 90, 119, 0.80)"],
    accent: "#80DEEA",
    icon: "waterfall",
    bg: "https://images.pexels.com/photos/14659324/pexels-photo-14659324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  4: {
    colors: ["rgba(43, 24, 16, 0.60)", "rgba(64, 37, 24, 0.70)", "rgba(87, 50, 32, 0.80)"],
    accent: "#FF7043",
    icon: "white-balance-sunny",
    bg: "https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  5: {
    colors: ["rgba(26, 36, 43, 0.60)", "rgba(44, 58, 69, 0.70)", "rgba(61, 80, 94, 0.80)"],
    accent: "#E0F7FA",
    icon: "snowflake",
    bg: "https://images.pexels.com/photos/35636196/pexels-photo-35636196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  6: {
    colors: ["rgba(28, 22, 17, 0.60)", "rgba(46, 37, 29, 0.70)", "rgba(64, 51, 41, 0.80)"],
    accent: "#D4AF37",
    icon: "pillar",
    bg: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  7: {
    colors: ["rgba(20, 20, 25, 0.60)", "rgba(35, 35, 45, 0.70)", "rgba(48, 48, 61, 0.80)"],
    accent: "#90CAF9",
    icon: "city-variant-outline",
    bg: "https://images.pexels.com/photos/15271798/pexels-photo-15271798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  8: {
    colors: ["rgba(10, 25, 30, 0.60)", "rgba(19, 43, 51, 0.70)", "rgba(28, 61, 71, 0.80)"],
    accent: "#26A69A",
    icon: "island",
    bg: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  9: {
    colors: ["rgba(10, 10, 10, 0.70)", "rgba(18, 18, 18, 0.80)", "rgba(25, 25, 25, 0.90)"],
    accent: "#AED581",
    icon: "home-variant-outline",
    bg: "https://images.pexels.com/photos/16725824/pexels-photo-16725824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
};

export function resolveCategoryTheme(category, index = 0) {
  const fallback = THEMES_BY_CAT[index % 10] || THEMES_BY_CAT[0];
  if (!category) return fallback;

  return {
    colors: fallback.colors,
    accent: category.accentColor || fallback.accent,
    icon: category.icon || fallback.icon,
    bg: category.bgImageUrl || fallback.bg,
  };
}
