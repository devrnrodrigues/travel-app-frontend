import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../home.styles";
import { SkeletonBox } from "../../../shared/components/Skeleton";

const SearchCardItem = React.memo(function SearchCardItem({
  item,
  cardHeight,
  cardMarginBottom,
  currentTheme,
  isDarkMode,
  isOverlayActive,
  showPrice = false,
  showRating = false,
  onPress,
}) {
  const isLocal = item.isLocalSource || typeof item.image_url !== "string";
  const [imageLoaded, setImageLoaded] = useState(isLocal);
  const imgAnim = useRef(new Animated.Value(isLocal ? 1 : 0)).current;
  const imageSize = Math.max(48, cardHeight - 20);

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  const shouldShowPrice = Boolean(showPrice && !showRating && (item.priceRange || item.price != null));
  const shouldShowRating = Boolean(
    showRating && !showPrice && item.realRating && item.realRating !== "0.0" && item.realRating !== "0"
  );

  const badgeOffset = shouldShowPrice ? 95 : shouldShowRating ? 50 : 0;

  return (
    <View style={styles.flex1}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.searchCardBase,
          !isDarkMode ? styles.searchCardLight : styles.searchCardDark,
          { height: cardHeight, marginBottom: cardMarginBottom },
        ]}
        onPress={onPress}
      >
        <View
          style={[styles.searchCardImageWrapper, { width: imageSize, height: imageSize }]}
        >
          {item.image_url ? (
            <>
              <Animated.Image
                source={
                  item.isLocalSource || typeof item.image_url !== "string"
                    ? item.image_url
                    : { uri: item.image_url }
                }
                style={[
                  {
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 13,
                    opacity: imgAnim,
                  },
                ]}
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <SkeletonBox
                  width={imageSize}
                  height={imageSize}
                  borderRadius={13}
                  isDarkMode={isDarkMode}
                  style={
                    isDarkMode
                      ? styles.searchCardSkeletonDark
                      : styles.searchCardSkeletonLight
                  }
                />
              )}
            </>
          ) : (
            <View
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 13,
                backgroundColor: isDarkMode ? "#252525" : "#E2E2E2",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="image-outline"
                size={Math.round(imageSize * 0.45)}
                color={isDarkMode ? "#666" : "#999"}
              />
            </View>
          )}
        </View>

        <View style={styles.searchCardInfo}>
          <Text
            style={[styles.searchCardTitle, { paddingRight: badgeOffset }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View style={styles.searchCardLocationRow}>
            <Feather name="map-pin" size={12} color={currentTheme.accent} />
            <Text style={styles.searchCardLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        {(shouldShowPrice || shouldShowRating) && (
          <View style={styles.searchCardBadgesContainer}>
            {shouldShowPrice && (
              <View
                style={[
                  styles.searchCardPriceBadge,
                  !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.06)" },
                ]}
              >
                <Text
                  style={[
                    styles.searchCardBadgeText,
                    { color: currentTheme.accent },
                  ]}
                >
                  {item.priceRange ? `${item.priceRange}/dia` : `R$ ${item.price}/dia`}
                </Text>
              </View>
            )}
            {shouldShowRating && (
              <View
                style={[
                  styles.searchCardRatingBadge,
                  !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.06)" },
                ]}
              >
                <Ionicons
                  name="star"
                  size={11}
                  color="#FFD700"
                  style={styles.marginRight3}
                />
                <Text
                  style={[
                    styles.searchCardRatingText,
                    !isDarkMode && { color: "#000" },
                  ]}
                >
                  {item.realRating}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

export default SearchCardItem;
