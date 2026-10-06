import React, { useState, useEffect, useRef, memo } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/details.styles";
import reviewStyles from "../styles/reviews.styles";

function ReviewDropdownMenuComponent({
  visible,
  isOwner,
  onEdit,
  onDelete,
  onReport,
  isDarkMode,
  onAnimationEnd,
}) {
  const [shouldRender, setShouldRender] = useState(visible);
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }).start();
    } else if (shouldRender) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }
      });
    }
  }, [visible, shouldRender, anim, onAnimationEnd]);

  if (!shouldRender) return null;

  const opacity = anim;
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Animated.View
      style={[
        reviewStyles.anchoredDropdown,
        !isDarkMode && reviewStyles.anchoredDropdownLight,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      {isOwner ? (
        <>
          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Feather
              name="edit-2"
              size={13}
              color={!isDarkMode ? "#374151" : "#FFFFFF"}
              style={styles.marginRight8}
            />
            <Text
              style={[
                reviewStyles.anchoredDropdownText,
                !isDarkMode && { color: "#374151" },
              ]}
            >
              Editar
            </Text>
          </TouchableOpacity>

          <View
            style={[
              reviewStyles.anchoredDropdownDivider,
              !isDarkMode && reviewStyles.anchoredDropdownDividerLight,
            ]}
          />

          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Feather
              name="trash-2"
              size={13}
              color="#FF453A"
              style={styles.marginRight8}
            />
            <Text style={[reviewStyles.anchoredDropdownText, { color: "#FF453A" }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={reviewStyles.anchoredDropdownItem}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <Ionicons
            name="flag-outline"
            size={13}
            color={!isDarkMode ? "#374151" : "#FFFFFF"}
            style={styles.marginRight8}
          />
          <Text
            style={[
              reviewStyles.anchoredDropdownText,
              !isDarkMode && { color: "#374151" },
            ]}
          >
            Reportar
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

export const ReviewDropdownMenu = memo(ReviewDropdownMenuComponent);
export default ReviewDropdownMenu;
