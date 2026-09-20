import React from "react";
import { View } from "react-native";
import { useShimmerAnimation, ShimmerOverlay } from "../../../shared/components/Skeleton";
import { styles } from "../profile.styles";

export function CountryPillSkeleton({ isDarkMode, width = 110 }) {
  const shimmerAnim = useShimmerAnimation(1800);

  return (
    <View
      style={[
        styles.countryPill,
        !isDarkMode && styles.countryPillLight,
        {
          width,
          overflow: "hidden",
          position: "relative",
        },
      ]}
    >
      <View
        style={[
          styles.flagIcon,
          {
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.12)",
          },
        ]}
      />
      <View
        style={{
          flex: 1,
          height: 14,
          borderRadius: 4,
          backgroundColor: isDarkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.12)",
        }}
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
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
