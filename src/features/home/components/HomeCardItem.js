import React, { useMemo } from "react";
import { View, Text, Image, TouchableOpacity, Animated, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import styles, {
  getCardDimensionsStyle,
  getCardInfoPosition,
  getAndroidBackgroundDimensions,
  getImageOpacityStyle,
  getRatingColorStyle,
} from "../styles/homeCardItem.styles";
import { getOptimizedImageUrl } from "../../../shared/utils/imageUrl";
import useImageFadeIn from "../hooks/useImageFadeIn";

const HomeCardItem = React.memo(function HomeCardItem({
  item,
  currentTheme,
  isDarkMode,
  navigation,
  cardWidth,
  cardHeight,
  cardInfoBottom,
  cardInfoHeight,
  isMinimalist,
}) {
  const hasImage = Boolean(item.image_url && typeof item.image_url === "string" && item.image_url.startsWith("http"));
  const isLocal = !hasImage && Boolean(item.isLocalSource && item.image_url);
  const cardImgSource = useMemo(() => {
    if (isLocal) return item.image_url;
    if (hasImage) return { uri: getOptimizedImageUrl(item.image_url, 800) };
    return null;
  }, [isLocal, hasImage, item.image_url]);

  const { imgAnim, handleImageLoad } = useImageFadeIn(Boolean(cardImgSource && isLocal), 260);

  const hasRating =
    Number(item.rating) > 0 &&
    item.realRating !== "0.0" &&
    item.realRating !== "0" &&
    Boolean(item.realRating);

  const isCompactInfo = Boolean(cardInfoHeight && cardInfoHeight < 96);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        isDarkMode ? styles.cardDark : styles.cardLight,
        getCardDimensionsStyle(cardWidth, cardHeight, isDarkMode ? item.avgColor : undefined),
      ]}
      onPress={() => navigation.navigate("Details", { item, currentTheme })}
    >
      {cardImgSource ? (
        <Animated.Image
          source={cardImgSource}
          style={[styles.cardImage, getImageOpacityStyle(imgAnim)]}
          onLoad={handleImageLoad}
          accessibilityLabel={item.alt || item.title || item.name}
        />
      ) : (
        <View
          style={[
            styles.cardImageFallback,
            isDarkMode ? styles.cardImageFallbackDark : styles.cardImageFallbackLight,
          ]}
        >
          <Ionicons
            name="image-outline"
            size={48}
            color={isDarkMode ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.25)"}
          />
          <Text style={[styles.cardFallbackText, !isDarkMode && { color: "rgba(0, 0, 0, 0.45)" }]}>
            Sem imagens disponível.
          </Text>
        </View>
      )}
      <View
        style={[
          styles.cardInfo,
          getCardInfoPosition(cardInfoBottom, cardInfoHeight),
          isMinimalist
            ? isDarkMode
              ? styles.cardInfoMinimalistDark
              : styles.cardInfoMinimalist
            : isDarkMode
            ? styles.cardInfoDark
            : styles.cardInfoLight,
        ]}
      >
        {Platform.OS === "android" && !isDarkMode && !isMinimalist && cardImgSource && (
          <Image
            source={cardImgSource}
            blurRadius={4}
            style={[
              styles.cardFullBackground,
              getAndroidBackgroundDimensions(cardWidth),
            ]}
          />
        )}

        <View
          style={[
            styles.overlayBase,
            isMinimalist
              ? isDarkMode
                ? styles.overlayMinimalistDark
                : styles.overlayMinimalist
              : isDarkMode
              ? styles.overlayDark
              : styles.overlayLight,
          ]}
        />

        {Platform.OS !== "android" && !isDarkMode && !isMinimalist && (
          <BlurView
            intensity={20}
            tint="light"
            style={styles.cardOverlayImage}
          />
        )}

        <View style={styles.cardInfoInner}>
          <View
            style={[
              styles.cardInfoLeft,
              hasRating && styles.cardInfoLeftWithRating,
            ]}
          >
            <Text
              style={[
                isCompactInfo ? styles.cardTitleCompact : styles.cardTitle,
                isMinimalist &&
                  (isDarkMode ? styles.cardTitleMinimalistDark : styles.cardTitleMinimalist),
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              style={[
                isCompactInfo ? styles.cardLocationCompact : styles.cardLocation,
                isMinimalist &&
                  (isDarkMode ? styles.cardLocationMinimalistDark : styles.cardLocationMinimalist),
              ]}
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
                isCompactInfo && styles.ratingContainerCompact,
                isMinimalist
                  ? isDarkMode
                    ? styles.ratingContainerMinimalistDark
                    : styles.ratingContainerMinimalist
                  : !isDarkMode && styles.cardInfoLightBg,
              ]}
            >
              <Ionicons name="star" size={14} color={currentTheme?.accent || "#FFD700"} />
              <Text
                style={[
                  styles.ratingText,
                  getRatingColorStyle(currentTheme?.accent || "#FFD700"),
                ]}
              >
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
