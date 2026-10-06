import React, { memo } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, {
  getSwitchTrackStyle,
  getSwitchThumbStyle,
} from "../styles/flightSearchForm.styles";

function FlightDirectSwitchComponent({
  onlyDirect,
  setOnlyDirect,
  currentTheme,
  isDarkMode,
  switchTrackBg,
  switchThumbTranslate,
  switchThumbBg,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setOnlyDirect((prev) => !prev)}
      style={[
        styles.directToggleContainer,
        !isDarkMode && styles.directToggleContainerLight,
      ]}
    >
      <View style={styles.directToggleLeft}>
        <Feather
          name="send"
          size={16}
          color={onlyDirect ? currentTheme.accent : (!isDarkMode ? "#6B7280" : "#8E8E93")}
        />
        <Text
          style={[
            styles.directToggleText,
            isDarkMode ? styles.directToggleTextDark : styles.directToggleTextLight,
          ]}
        >
          Apenas voos diretos
        </Text>
      </View>
      <Animated.View
        style={[
          styles.switchTrack,
          getSwitchTrackStyle(switchTrackBg),
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            getSwitchThumbStyle(switchThumbTranslate, switchThumbBg),
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export const FlightDirectSwitch = memo(FlightDirectSwitchComponent);
