import React, { useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../home.styles";

const HomeCardItem = React.memo(function HomeCardItem({
  item,
  currentTheme,
  isDarkMode,
  navigation,
}) {
  const isLocal = item.isLocalSource || typeof item.image_url !== "string";
  const [imageLoaded, setImageLoaded] = useState(isLocal);
  const imgAnim = useRef(new Animated.Value(isLocal ? 1 : 0)).current;

  const hasRating =
    Number(item.rating) > 0 &&
    item.realRating !== "0.0" &&
    item.realRating !== "0" &&
    Boolean(item.realRating);

  const cardImgSource = isLocal
    ? (item.image_url || currentTheme.bg)
    : { uri: item.image_url };

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => navigation.navigate("Details", { item, currentTheme })}
    >
      <Animated.Image
        source={cardImgSource}
        style={[styles.cardImage, { opacity: imgAnim }]}
        onLoad={handleImageLoad}
      />
      <View
        style={[
          styles.cardInfo,
          {
            backgroundColor: "transparent",
            borderWidth: 0,
            shadowColor: "transparent",
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: "hidden",
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
        ]}
      >
        {Platform.OS === "android" && !isDarkMode && (
          <Image
            source={cardImgSource}
            blurRadius={3}
            style={styles.cardFullBackground}
          />
        )}

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: !isDarkMode
                ? "rgba(250, 250, 250, 0.30)"
                : "rgba(12, 12, 12, 0.82)",
              borderRadius: 25,
            },
          ]}
        />

        {Platform.OS !== "android" && !isDarkMode && (
          <BlurView
            intensity={20}
            tint="light"
            style={styles.cardOverlayImage}
          />
        )}

        <View style={styles.cardInfoInner}>
          <View style={styles.cardInfoLeft}>
            <Text
              style={[styles.cardTitle, !isDarkMode && { color: "#FFFFFF" }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              style={[styles.cardLocation, !isDarkMode && { color: "rgba(255, 255, 255, 0.85)" }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.location}
            </Text>
          </View>
          {hasRating ? (
            <View
              style={[
                styles.ratingContainer,
                !isDarkMode && styles.cardInfoLightBg,
              ]}
            >
              <Ionicons name="star" size={14} color={currentTheme.accent} />
              <Text style={[styles.ratingText, { color: currentTheme.accent, fontWeight: "700" }]}>
                {item.realRating}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default HomeCardItem;
