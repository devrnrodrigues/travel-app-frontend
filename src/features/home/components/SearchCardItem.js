import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles, {
  getSearchCardContainerStyle,
  getImageDimensionStyle,
  getImageAnimStyle,
  getBadgePaddingOffset,
  getBadgeTextColor,
} from "../styles/searchCardItem.styles";
import { SkeletonBox } from "../../../shared/components/Skeleton";
import useImageFadeIn from "../hooks/useImageFadeIn";

const SearchCardItem = React.memo(function SearchCardItem({
  item,
  cardHeight,
  cardMarginBottom,
  currentTheme,
  isDarkMode,
  showPrice = false,
  showRating = false,
  onPress,
}) {
  const isLocal = item.isLocalSource || typeof item.image_url !== "string";
  const { imageLoaded, imgAnim, handleImageLoad } = useImageFadeIn(Boolean(isLocal), 220);
  const imageSize = Math.max(48, cardHeight - 20);

  const shouldShowPrice = Boolean(showPrice && !showRating && (item.priceRange || item.price != null));
  const shouldShowRating = Boolean(
    showRating && !showPrice && item.realRating && item.realRating !== "0.0" && item.realRating !== "0"
  );

  const badgeOffset = shouldShowPrice ? 95 : shouldShowRating ? 50 : 0;

  const imageSource =
    item.isLocalSource || typeof item.image_url !== "string"
      ? item.image_url
      : { uri: item.image_url };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.searchCardBase,
        !isDarkMode ? styles.searchCardLight : styles.searchCardDark,
        getSearchCardContainerStyle(cardHeight, cardMarginBottom),
      ]}
      onPress={onPress}
    >
      <View
        style={[styles.searchCardImageWrapper, getImageDimensionStyle(imageSize)]}
      >
        {item.image_url ? (
          <>
            <Animated.Image
              source={imageSource}
              resizeMode="cover"
              style={[
                styles.searchCardImage,
                getImageAnimStyle(imageSize, imgAnim),
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
              style={[
                styles.searchCardEmptyFallback,
                isDarkMode ? styles.searchCardEmptyFallbackDark : styles.searchCardEmptyFallbackLight,
                getImageDimensionStyle(imageSize),
              ]}
            >
              <Ionicons
                name="image-outline"
                size={Math.round(imageSize * 0.45)}
                color={isDarkMode ? "#666666" : "#999999"}
              />
            </View>
          )}
        </View>

        <View style={styles.searchCardInfo}>
          <Text
            style={[styles.searchCardTitle, getBadgePaddingOffset(badgeOffset)]}
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
                  !isDarkMode ? styles.searchCardPriceBadgeLight : styles.searchCardPriceBadgeDark,
                ]}
              >
                <Text
                  style={[
                    styles.searchCardBadgeText,
                    getBadgeTextColor(currentTheme.accent),
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
                  !isDarkMode ? styles.searchCardRatingBadgeLight : styles.searchCardRatingBadgeDark,
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
                    !isDarkMode ? styles.searchCardRatingTextLight : styles.searchCardRatingTextDark,
                  ]}
                >
                  {item.realRating}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  });

export default SearchCardItem;
