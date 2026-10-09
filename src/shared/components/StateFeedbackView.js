import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function StateFeedbackView({
  icon = "alert-circle-outline",
  iconType = "ionicons",
  title,
  message,
  buttonText,
  onButtonPress,
  isDarkMode = true,
  style,
}) {
  const isFeather = iconType === "feather";

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          isDarkMode ? styles.iconDark : styles.iconLight,
        ]}
      >
        {isFeather ? (
          <Feather name={icon} size={32} color="rgba(255, 255, 255, 0.85)" />
        ) : (
          <Ionicons name={icon} size={34} color="rgba(255, 255, 255, 0.85)" />
        )}
      </View>

      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {buttonText && onButtonPress ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.button}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.70)",
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 18,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
