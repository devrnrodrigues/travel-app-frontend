import React, { useRef, useEffect } from "react";
import { TextInput, Text, Animated, Easing } from "react-native";
import styles, {
  getInputAnimatedStyle,
  getTextInputStyle,
} from "../styles/animatedProfileInput.styles";

export default function AnimatedProfileInput({
  isFocused,
  style,
  currentTheme,
  isDarkMode,
  hasError,
  charCount,
  maxLength,
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
  }, [isFocused, anim]);

  const borderColor = hasError
    ? "#EF4444"
    : anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", currentTheme.accent],
      });

  const minHeight = props.multiline ? 80 : 50;
  const inputMinHeight = props.multiline ? 70 : 46;

  return (
    <Animated.View
      style={[
        styles.container,
        !isDarkMode && styles.containerLight,
        getInputAnimatedStyle(borderColor, minHeight),
        style,
      ]}
    >
      <TextInput
        style={[
          styles.textInput,
          !isDarkMode && styles.textInputLight,
          getTextInputStyle(inputMinHeight),
          props.multiline ? styles.textInputMultiline : styles.textInputSingle,
        ]}
        maxLength={maxLength}
        {...props}
      />
      {charCount !== undefined && maxLength !== undefined && (
        <Text
          style={[
            styles.inlineCounter,
            !isDarkMode && styles.inlineCounterLight,
          ]}
        >
          {charCount}/{maxLength}
        </Text>
      )}
    </Animated.View>
  );
}
