import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getOptimizedImageUrl } from "../../../shared/utils/imageUrl";

const TopDestinationCard = React.memo(function TopDestinationCard({
  item,
  currentTheme,
  isDarkMode = true,
  navigation,
  cardWidth,
  cardHeight,
  imageSize,
  titleSize,
  locationSize,
}) {
  const hasImage = Boolean(item?.image_url && typeof item.image_url === "string" && item.image_url.startsWith("http"));
  const isLocal = !hasImage && Boolean(item?.isLocalSource && item?.image_url);
  const cardImgSource = isLocal ? item.image_url : (hasImage ? { uri: getOptimizedImageUrl(item.image_url, 300) } : null);

  const [imageLoaded, setImageLoaded] = useState(Boolean(cardImgSource && isLocal));
  const imgAnim = useRef(new Animated.Value(cardImgSource && isLocal ? 1 : 0)).current;

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  const handlePress = () => {
    if (navigation?.navigate) {
      navigation.navigate("Details", { item, currentTheme });
    }
  };

  const title = item?.title || item?.name || "";
  const location = item?.country || item?.location || item?.city || "";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.cardContainer,
        isDarkMode ? styles.cardContainerDark : styles.cardContainerLight,
        cardWidth ? { width: cardWidth } : null,
        cardHeight ? { height: cardHeight, borderRadius: Math.round(cardHeight * 0.26) } : null,
      ]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.imageWrapper,
          imageSize
            ? {
                width: imageSize,
                height: imageSize,
                borderRadius: Math.round(imageSize * 0.25),
              }
            : null,
        ]}
      >
        {cardImgSource ? (
          <>
            <Animated.Image
              source={cardImgSource}
              style={[
                styles.thumbnail,
                imageSize ? { borderRadius: Math.round(imageSize * 0.25) } : null,
                { opacity: imgAnim },
              ]}
              onLoad={handleImageLoad}
              resizeMode="cover"
              accessibilityLabel={title}
            />
            {!imageLoaded && (
              <View
                style={[
                  styles.thumbnail,
                  styles.skeletonThumbnail,
                  imageSize ? { borderRadius: Math.round(imageSize * 0.25) } : null,
                  isDarkMode ? styles.skeletonDark : styles.skeletonLight,
                ]}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.thumbnail,
              imageSize ? { borderRadius: Math.round(imageSize * 0.25) } : null,
              isDarkMode ? styles.fallbackDark : styles.fallbackLight,
            ]}
          >
            <Ionicons
              name="image-outline"
              size={imageSize ? Math.round(imageSize * 0.32) : 24}
              color={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
            />
          </View>
        )}
      </View>

      <View style={styles.infoWrapper}>
        <Text
          style={[
            styles.title,
            { color: "#FFFFFF" },
            titleSize ? { fontSize: titleSize } : null,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {location ? (
          <Text
            style={[
              styles.location,
              { color: "#FFFFFF" },
              locationSize ? { fontSize: locationSize } : null,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 270,
    height: 98,
    borderRadius: 26,
    padding: 10,
    marginRight: 14,
    flexShrink: 0,
    borderWidth: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  cardContainerDark: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderWidth: 0,
  },
  cardContainerLight: {
    backgroundColor: "rgba(100, 100, 100, 0.80)",
    borderWidth: 0,
  },
  imageWrapper: {
    width: 78,
    height: 78,
    borderRadius: 19,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
  },
  skeletonThumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  skeletonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  skeletonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  fallbackDark: {
    backgroundColor: "#202020",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoWrapper: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 4,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  location: {
    fontSize: 13,
    fontWeight: "500",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});

export default TopDestinationCard;
