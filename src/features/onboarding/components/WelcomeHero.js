import React from "react";
import { Text, Animated } from "react-native";
import styles, { getTextAnimatedStyle } from "../styles/welcome.styles";

const WelcomeHero = React.memo(function WelcomeHero({
  textOpacity,
  textTranslateY,
}) {
  return (
    <Animated.View
      style={[
        styles.textContainer,
        getTextAnimatedStyle(textOpacity, textTranslateY),
      ]}
    >
      <Text style={styles.title}>Explore Lugares{"\n"}Incríveis Pelo Mundo</Text>
      <Text style={styles.subtitle}>Vamos tornar sua vida melhor</Text>
    </Animated.View>
  );
});

export default WelcomeHero;
