import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/ThemeContext";

export default function StateFeedbackView({
  icon = "alert-circle-outline",
  iconType = "ionicons",
  imageSource,
  imageStyle,
  title,
  message,
  buttonText,
  buttonIcon,
  buttonIconType = "feather",
  onButtonPress,
  isDarkMode: propIsDarkMode,
  style,
  showDarkFilter = true,
}) {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;
  const isLight = !isDarkMode;
  const isFeather = iconType === "feather";

  const iconColor = isLight
    ? "#6B7280"
    : "rgba(255, 255, 255, 0.85)";

  return (
    <View style={[styles.container, style]}>
      {imageSource ? (
        <View style={styles.imageWrapper}>
          <Image
            source={imageSource}
            style={[
              styles.feedbackImage,
              isDarkMode && showDarkFilter && styles.feedbackImageDark,
              imageStyle,
            ]}
            resizeMode="contain"
          />
          {isDarkMode && showDarkFilter ? (
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.88)", "#000000"]}
              locations={[0, 0.4, 0.75, 1]}
              style={styles.imageBottomFade}
              pointerEvents="none"
            />
          ) : null}
        </View>
      ) : (
        <View
          style={[
            styles.iconContainer,
            isLight
              ? styles.iconLight
              : styles.iconDark,
          ]}
        >
          {isFeather ? (
            <Feather name={icon} size={32} color={iconColor} />
          ) : (
            <Ionicons name={icon} size={34} color={iconColor} />
          )}
        </View>
      )}

      {title ? (
        <Text style={[styles.title, isLight && styles.titleLight]}>
          {title}
        </Text>
      ) : null}
      {message ? (
        <Text style={[styles.message, isLight && styles.messageLight]}>
          {message}
        </Text>
      ) : null}

      {buttonText && onButtonPress ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.button, isLight && styles.buttonLight]}
          onPress={onButtonPress}
        >
          {buttonIcon ? (
            buttonIconType === "ionicons" ? (
              <Ionicons
                name={buttonIcon}
                size={16}
                color={isLight ? "#4B5563" : "#FFFFFF"}
                style={styles.buttonIcon}
              />
            ) : (
              <Feather
                name={buttonIcon}
                size={15}
                color={isLight ? "#4B5563" : "#FFFFFF"}
                style={styles.buttonIcon}
              />
            )
          ) : null}
          <Text style={[styles.buttonText, isLight && styles.buttonTextLight]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  imageWrapper: {
    width: 230,
    height: 168,
    marginBottom: 14,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackImage: {
    width: 230,
    height: 168,
  },
  feedbackImageDark: {
    opacity: 0.85,
  },
  imageBottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 65,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconDark: {
    backgroundColor: "rgba(255, 255, 255, 0.10)",
  },
  iconLight: {
    backgroundColor: "#F3F4F6",
  },
  iconMinimalist: {
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  titleLight: {
    color: "#4B5563",
  },
  titleMinimalist: {
    color: "#4B5563",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.88)",
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 18,
  },
  messageLight: {
    color: "#6B7280",
  },
  messageMinimalist: {
    color: "#9CA3AF",
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonLight: {
    backgroundColor: "#F3F4F6",
  },
  buttonMinimalist: {
    backgroundColor: "#F3F4F6",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonTextLight: {
    color: "#4B5563",
  },
  buttonTextMinimalist: {
    color: "#4B5563",
  },
});
