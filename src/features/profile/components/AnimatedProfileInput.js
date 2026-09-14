import React, { useRef, useEffect } from "react";
import { TextInput, Animated, Easing } from "react-native";
import { styles } from "../styles/profile.styles";

export default function AnimatedProfileInput({
  isFocused,
  style,
  currentTheme,
  isDarkMode,
  ...props
}) {
  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", currentTheme.accent],
  });

  return (
    <Animated.View
      style={[
        styles.input,
        !isDarkMode && styles.inputContainerLight,
        styles.inputContainer,
        {
          borderColor,
        },
        style,
      ]}
    >
      <TextInput
        style={[
          styles.textInput,
          props.multiline ? styles.textInputMultiline : styles.textInputSingle,
        ]}
        {...props}
      />
    </Animated.View>
  );
}
