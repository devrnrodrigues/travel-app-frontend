import React, { useEffect, useRef } from "react";
import { Animated, Platform, Easing } from "react-native";

export default function FadeInView({
  children,
  duration = 260,
  delay = 0,
  slideDistance = 0,
  style,
  ...props
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [anim, duration, delay]);

  const animatedStyle = {
    opacity: anim,
    ...(slideDistance > 0
      ? {
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [slideDistance, 0],
              }),
            },
          ],
        }
      : {}),
  };

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
