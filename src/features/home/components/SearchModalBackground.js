import React from "react";
import { View, Animated, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles, { getFadeOpacityStyle } from "../styles/searchModal.styles";

const GRADIENT_COLORS = ["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"];
const GRADIENT_LOCATIONS = [0, 0.45, 1];

const SearchModalBackground = React.memo(function SearchModalBackground({
  resolvedBgSource,
  searchFadeAnim,
  isDarkMode,
}) {
  return (
    <Animated.View
      style={[
        styles.fullAbsolute,
        getFadeOpacityStyle(searchFadeAnim),
      ]}
      pointerEvents="none"
    >
      <ImageBackground
        source={resolvedBgSource}
        blurRadius={10}
        style={styles.screenCover}
        resizeMode="cover"
      >
        <LinearGradient
          colors={GRADIENT_COLORS}
          locations={GRADIENT_LOCATIONS}
          style={styles.screenCover}
        />
        <View
          style={!isDarkMode ? styles.screenCoverLight : styles.screenCoverDark}
        />
      </ImageBackground>
    </Animated.View>
  );
});

export default SearchModalBackground;
