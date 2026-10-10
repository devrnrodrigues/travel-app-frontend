import React from "react";
import { View } from "react-native";
import { useShimmerAnimation, ShimmerOverlay } from "../../../shared/components/Skeleton";
import { useTheme } from "../../../theme/ThemeContext";
import styles, { getPillWidthStyle } from "../styles/countryPillSkeleton.styles";

export function CountryPillSkeleton({ isDarkMode, width = 110 }) {
  const shimmerAnim = useShimmerAnimation(1800);
  let isMinimalist = false;
  try {
    const theme = useTheme();
    isMinimalist = !isDarkMode && theme?.aestheticMode === "minimalista";
  } catch {}

  return (
    <View
      style={[
        styles.pill,
        isMinimalist ? styles.pillMinimalist : (!isDarkMode && styles.pillLight),
        getPillWidthStyle(width),
      ]}
    >
      <View
        style={[
          styles.flagIcon,
          isDarkMode
            ? styles.flagIconDark
            : isMinimalist
            ? styles.flagIconMinimalist
            : styles.flagIconLight,
        ]}
      />
      <View
        style={[
          styles.labelBar,
          isDarkMode
            ? styles.labelBarDark
            : isMinimalist
            ? styles.labelBarMinimalist
            : styles.labelBarLight,
        ]}
      />
      <ShimmerOverlay
        animatedValue={shimmerAnim}
        width={width}
        height={35}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function CountryPillSkeletonGroup({ isDarkMode, count = 4 }) {
  const widths = [112, 130, 96, 136, 118];
  return (
    <View style={[styles.container, styles.gap8]}>
      {Array.from({ length: count }).map((_, i) => (
        <CountryPillSkeleton
          key={i}
          isDarkMode={isDarkMode}
          width={widths[i % widths.length]}
        />
      ))}
    </View>
  );
}
