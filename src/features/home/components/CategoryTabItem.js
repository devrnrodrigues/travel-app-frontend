import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import styles, {
  getCategoryTextColor,
  getActiveLineStyle,
} from "../styles/categoryTabItem.styles";

const CategoryTabItem = React.memo(function CategoryTabItem({
  cat,
  isActive,
  accentColor,
  onPress,
  onLayout,
}) {
  const lineAnim = useRef(new Animated.Value(isActive ? 1 : 0.01)).current;

  useEffect(() => {
    if (isActive) {
      lineAnim.setValue(0.01);
      Animated.spring(lineAnim, {
        toValue: 1,
        damping: 15,
        stiffness: 200,
        mass: 0.6,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [isActive, lineAnim]);

  const lineScaleX = lineAnim.interpolate({
    inputRange: [0.01, 1],
    outputRange: [0.01, 1],
  });

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.75}
    >
      <View style={styles.centerAligned}>
        <View style={styles.rowCenter}>
          <Text
            style={[
              styles.categoryText,
              getCategoryTextColor(isActive, accentColor),
              isActive && styles.categoryTextActive,
            ]}
          >
            {cat}
          </Text>
        </View>
        {isActive && (
          <Animated.View
            style={[
              styles.activeLine,
              getActiveLineStyle(accentColor, lineScaleX),
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

export default CategoryTabItem;
