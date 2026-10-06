import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getOptimizedImageUrl } from "../../../shared/utils/imageUrl";
import styles from "../styles/favoriteCard.styles";
import useFavoriteCardAnimation from "../hooks/useFavoriteCardAnimation";

export const FavoriteCardItem = React.memo(function FavoriteCardItem({
  item,
  index,
  totalItems,
  scrollY,
  cardDimensions,
  navigation,
  currentTheme,
  isDarkMode,
  setItemToDelete,
  cardWidth,
  cardHeight,
}) {
  const {
    imageLoaded,
    imgAnim,
    handleImageLoad,
    rotateX,
    translateY,
    opacity,
  } = useFavoriteCardAnimation({
    scrollY,
    index,
    totalItems,
    cardDimensions,
    cardHeight,
  });

  const reviewCount = Number(item?.reviewCount ?? item?.destinationReviewCount ?? 0);
  const hasRating = reviewCount >= 1;
  const ratingValue =
    item?.realRating && item.realRating !== "0.0" && item.realRating !== "0"
      ? item.realRating
      : item?.rating != null && Number(item.rating) > 0
        ? Number(item.rating).toFixed(1)
        : item?.destinationRating != null && Number(item.destinationRating) > 0
          ? Number(item.destinationRating).toFixed(1)
          : null;

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate("Details", {
      item: {
        ...item,
        id: item.item_id || item.id,
        item_id: item.item_id || item.id,
      },
      currentTheme,
    });
  }, [navigation, item, currentTheme]);

  const handleLongPress = useCallback(() => {
    if (setItemToDelete) {
      setItemToDelete(item);
    }
  }, [setItemToDelete, item]);

  return (
    <Animated.View
      style={[
        cardWidth && cardHeight ? { width: cardWidth, height: cardHeight } : null,
        {
          opacity,
          transform: [{ perspective: 700 }, { translateY }, { rotateX }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        style={[
          styles.card,
          isDarkMode ? styles.cardDark : styles.cardLight,
          cardWidth && cardHeight ? { width: cardWidth, height: cardHeight } : null,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={450}
      >
        <View style={styles.cardInner}>
          {item.image_url ? (
            <>
              <Animated.Image
                source={{ uri: getOptimizedImageUrl(item.image_url, 450) }}
                style={[styles.cardImage, { opacity: imgAnim }]}
                resizeMode="cover"
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <View
                  style={[
                    styles.cardImage,
                    isDarkMode ? styles.imagePlaceholderDark : styles.imagePlaceholderLight,
                  ]}
                />
              )}
            </>
          ) : (
            <View
              style={[
                styles.cardPlaceholder,
                isDarkMode ? styles.cardPlaceholderDark : styles.cardPlaceholderLight,
              ]}
            >
              <Ionicons
                name="image-outline"
                size={32}
                color={isDarkMode ? "#666666" : "#999999"}
              />
              <Text
                style={[
                  styles.cardPlaceholderText,
                  isDarkMode ? styles.cardPlaceholderTextDark : styles.cardPlaceholderTextLight,
                ]}
              >
                Sem imagem
              </Text>
            </View>
          )}

          {hasRating && ratingValue ? (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>{ratingValue}</Text>
            </View>
          ) : null}

          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.42)", "rgba(0, 0, 0, 0.88)"]}
            locations={[0, 0.42, 1]}
            style={styles.cardOverlay}
          >
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.location ? (
              <View style={styles.locationRow}>
                <Feather
                  name="map-pin"
                  size={11}
                  color={currentTheme?.accent || "#007AFF"}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default FavoriteCardItem;
