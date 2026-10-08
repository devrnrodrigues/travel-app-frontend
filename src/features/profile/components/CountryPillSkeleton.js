import React from "react";
import { View } from "react-native";
import { useShimmerAnimation, ShimmerOverlay } from "../../../shared/components/Skeleton";
import styles, { getPillWidthStyle } from "../styles/countryPillSkeleton.styles";

export function CountryPillSkeleton({ isDarkMode, width = 110 }) {
  const shimmerAnim = useShimmerAnimation(1800);

  return (
    <View
      style={[
        styles.pill,
        !isDarkMode && styles.pillLight,
        getPillWidthStyle(width),
      ]}
    >
      <View
        style={[
          styles.flagIcon,
          isDarkMode ? styles.flagIconDark : styles.flagIconLight,
        ]}
      />
      <View
        style={[
          styles.labelBar,
          isDarkMode ? styles.labelBarDark : styles.labelBarLight,
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
