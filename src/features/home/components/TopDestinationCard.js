import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOptimizedImageUrl } from "../../../shared/utils/imageUrl";
import styles, {
  getTopCardContainerStyle,
  getTopCardImageWrapperStyle,
  getTopCardThumbnailRadius,
  getTopCardTitleStyle,
  getTopCardLocationStyle,
  getImageOpacityStyle,
} from "../styles/topDestinationCard.styles";
import useImageFadeIn from "../hooks/useImageFadeIn";

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
  isMinimalist,
}) {
  const hasImage = Boolean(item?.image_url && typeof item.image_url === "string" && item.image_url.startsWith("http"));
  const isLocal = !hasImage && Boolean(item?.isLocalSource && item?.image_url);
  const cardImgSource = useMemo(() => {
    if (isLocal) return item.image_url;
    if (hasImage) return { uri: getOptimizedImageUrl(item.image_url, 300) };
    return null;
  }, [isLocal, hasImage, item?.image_url]);

  const { imageLoaded, imgAnim, handleImageLoad } = useImageFadeIn(Boolean(cardImgSource && isLocal), 250);

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
        isMinimalist
          ? isDarkMode
            ? styles.cardContainerMinimalistDark
            : styles.cardContainerMinimalist
          : isDarkMode
          ? styles.cardContainerDark
          : styles.cardContainerLight,
        getTopCardContainerStyle(cardWidth, cardHeight),
      ]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.imageWrapper,
          getTopCardImageWrapperStyle(imageSize),
        ]}
      >
        {cardImgSource ? (
          <>
            <Animated.Image
              source={cardImgSource}
              style={[
                styles.thumbnail,
                getTopCardThumbnailRadius(imageSize),
                getImageOpacityStyle(imgAnim),
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
                  getTopCardThumbnailRadius(imageSize),
                  isDarkMode ? styles.skeletonDark : styles.skeletonLight,
                ]}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.thumbnail,
              getTopCardThumbnailRadius(imageSize),
              isMinimalist
                ? isDarkMode
                  ? styles.fallbackMinimalistDark
                  : styles.fallbackMinimalist
                : isDarkMode
                ? styles.fallbackDark
                : styles.fallbackLight,
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
            isMinimalist &&
              (isDarkMode ? styles.titleMinimalistDark : styles.titleMinimalist),
            getTopCardTitleStyle(titleSize),
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
              isMinimalist &&
                (isDarkMode ? styles.locationMinimalistDark : styles.locationMinimalist),
              getTopCardLocationStyle(locationSize),
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

export default TopDestinationCard;
