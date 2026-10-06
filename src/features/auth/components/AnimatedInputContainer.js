import React, { useRef, useEffect, memo } from "react";
import { Animated, Easing } from "react-native";
import styles from "../auth.styles";

function AnimatedInputContainerComponent({ isFocused, children, style }) {
  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, anim]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.14)", "rgba(255, 255, 255, 0.25)"],
  });

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "rgba(255, 255, 255, 0.70)"],
  });

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export const AnimatedInputContainer = memo(AnimatedInputContainerComponent);
export default AnimatedInputContainer;
