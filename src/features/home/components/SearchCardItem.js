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
  showPrice,
  showRating,
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

  return (
    <View style={styles.flex1}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.searchCardBase, !isDarkMode ? styles.searchCardLight : styles.searchCardDark, { height: cardHeight, marginBottom: cardMarginBottom }]}
        onPress={onPress}>
        <View
          style={[styles.searchCardImageWrapper, { width: imageSize, height: imageSize }]}
        >
          <Animated.Image
            source={item.isLocalSource || typeof item.image_url !== "string" ? item.image_url : { uri: item.image_url }}
            style={[{ width: imageSize, height: imageSize, borderRadius: 13, opacity: imgAnim }]}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <SkeletonBox
              width={imageSize}
              height={imageSize}
              borderRadius={13}
              isDarkMode={isDarkMode}
              style={isDarkMode ? styles.searchCardSkeletonDark : styles.searchCardSkeletonLight}
            />
          )}
        </View>

        <View style={styles.searchCardInfo}>
          <Text
            style={[styles.searchCardTitle, { paddingRight: (showPrice || showRating) ? 72 : 0 }]}
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

        {((showPrice && item.price != null) || showRating) && (
          <View
            style={styles.searchCardBadgesContainer}
          >
            {showPrice && item.price != null && (
              <View
                style={[styles.searchCardPriceBadge, { marginRight: showRating ? 5 : 0 }]}
              >
                <Text style={[styles.searchCardBadgeText, { color: currentTheme.accent }]}>
                  R$ {item.price}
                </Text>
              </View>
            )}
            {showRating && (
              <View
                style={styles.searchCardRatingBadge}
              >
                <Ionicons name="star" size={11} color="#FFD700" style={styles.marginRight3} />
                <Text style={styles.searchCardRatingText}>
                  {item.realRating || "4.8"}
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
