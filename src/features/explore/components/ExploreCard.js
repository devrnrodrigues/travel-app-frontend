import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getOptimizedImageUrl } from "../../../shared/utils/imageUrl";
import styles from "../styles/exploreCard.styles";

export const ExploreCard = React.memo(function ExploreCard({ item, onPress, isDarkMode }) {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [onPress, item]);

  const reviewCount = Number(item?.reviewCount ?? 0);
  const hasReviews = reviewCount >= 1;
  const ratingValue =
    item?.realRating && item.realRating !== "0.0"
      ? item.realRating
      : item?.rating != null && Number(item.rating) > 0
      ? Number(item.rating).toFixed(1)
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.gridItem,
        !isDarkMode && styles.gridItemLight,
        item.avgColor ? { backgroundColor: item.avgColor } : null,
      ]}
      onPress={handlePress}
    >
      {item.image_url ? (
        <Image
          source={{ uri: getOptimizedImageUrl(item.image_url, 350) }}
          style={styles.gridImage}
          resizeMode="cover"
          accessibilityLabel={item.alt || item.name || item.title}
        />
      ) : (
        <View
          style={[
            styles.gridImage,
            isDarkMode ? styles.emptyImageContainerDark : styles.emptyImageContainerLight,
          ]}
        >
          <Ionicons name="image-outline" size={32} color="rgba(255, 255, 255, 0.35)" />
          <Text style={styles.emptyImageText}>
            Sem imagens disponível.
          </Text>
        </View>
      )}

      {hasReviews && ratingValue ? (
        <View style={styles.topBadge}>
          <Ionicons name="star" size={9.5} color="#FFD700" />
          <Text style={styles.topBadgeText}>{ratingValue}</Text>
        </View>
      ) : null}

      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.86)"]}
        style={styles.bottomOverlay}
      >
        <Text style={styles.destinationTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.location ? (
          <View style={styles.badgeRow}>
            <Feather
              name="map-pin"
              size={8.5}
              color="rgba(255, 255, 255, 0.75)"
              style={styles.badgeIconMargin}
            />
            <Text style={styles.destinationLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        ) : null}
      </LinearGradient>
    </TouchableOpacity>
  );
});

export default ExploreCard;
