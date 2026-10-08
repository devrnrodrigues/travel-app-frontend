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
        getCardDimensionsStyle(cardWidth, cardHeight, item.avgColor),
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
          <Ionicons name="image-outline" size={48} color="rgba(255, 255, 255, 0.35)" />
          <Text style={styles.cardFallbackText}>
            Sem imagens disponível.
          </Text>
        </View>
      )}
      <View
        style={[
          styles.cardInfo,
          getCardInfoPosition(cardInfoBottom, cardInfoHeight),
        ]}
      >
        {Platform.OS === "android" && !isDarkMode && cardImgSource && (
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
            isDarkMode ? styles.overlayDark : styles.overlayLight,
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
              style={isCompactInfo ? styles.cardTitleCompact : styles.cardTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              style={isCompactInfo ? styles.cardLocationCompact : styles.cardLocation}
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
