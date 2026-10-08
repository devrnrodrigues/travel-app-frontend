import React from "react";
import { View, Image, Animated } from "react-native";
import styles, { getBgScaleTransform } from "../styles/onboardingBackground.styles";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const DEFAULT_BG = require("../../../assets/welcome-bg.jpg");

const OnboardingBackground = React.memo(function OnboardingBackground({
  source = DEFAULT_BG,
  bgScale,
  isWelcome = false,
}) {
  return (
    <>
      <AnimatedImage
        source={source}
        style={[
          styles.background,
          getBgScaleTransform(bgScale),
        ]}
        resizeMode="cover"
      />
      <View style={isWelcome ? styles.overlayWelcome : styles.overlay} />
    </>
  );
});

export default OnboardingBackground;
