import React, { memo } from "react";
import { View, TouchableOpacity, ImageBackground, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  styles,
  getCoverBannerDynamicStyle,
} from "../styles/profile.styles";

const ProfileHeader = memo(function ProfileHeader({
  bgSource,
  currentTheme,
  scale,
  bannerHeight,
  onOpenSettings,
}) {
  const gradientColors =
    currentTheme?.colors && currentTheme.colors.length >= 3
      ? [
          currentTheme.colors[0],
          currentTheme.colors[1],
          "rgba(0, 0, 0, 0.72)",
          "rgba(0, 0, 0, 0.96)",
        ]
      : ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.95)"];

  const gradientLocations = [0, 0.38, 0.72, 1];
  const hitSlopSettings = { top: 12, bottom: 12, left: 12, right: 12 };

  return (
    <Animated.View>
      <ImageBackground
        source={bgSource}
        style={getCoverBannerDynamicStyle(scale, bannerHeight)}
        resizeMode="cover"
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          style={styles.fullSize}
        >
          <View style={styles.coverTopBar}>
            <TouchableOpacity
              style={styles.coverIconButton}
              onPress={onOpenSettings}
              activeOpacity={0.7}
              hitSlop={hitSlopSettings}
            >
              <Ionicons name="settings-sharp" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
});

export default ProfileHeader;
