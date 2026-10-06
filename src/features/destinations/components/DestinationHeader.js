import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/details.styles";
import { ThumbnailItem } from "./ImageGalleryModal";

const { width } = Dimensions.get("window");
const STRICT_THUMB_SIZE = Math.round(width * 0.115);

function DestinationHeaderComponent({
  mainImage,
  onOpenImageModal,
  onGoBack,
  onToggleFavorite,
  isFavorited,
  loadingImages,
  thumbnails,
  onSelectImage,
  title,
  location,
  currentTheme,
  isDarkMode,
}) {
  return (
    <View style={styles.imageSection}>
      {mainImage ? (
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={onOpenImageModal}
          style={styles.mainImageTouchable}
        >
          <Image
            source={{ uri: mainImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.mainImageEmpty,
            isDarkMode ? styles.mainImageEmptyDark : styles.mainImageEmptyLight,
          ]}
        >
          <Ionicons
            name="image-outline"
            size={54}
            color="rgba(255, 255, 255, 0.35)"
          />
          <Text style={styles.emptyImageText}>
            Sem imagens disponível.
          </Text>
        </View>
      )}

      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity
          style={[
            styles.roundButton,
            !isDarkMode ? styles.roundButtonLight : styles.roundButtonDark,
          ]}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <Feather
            name="chevron-left"
            size={24}
            color={!isDarkMode ? "#000000" : "#FFFFFF"}
          />
        </TouchableOpacity>

        <View style={styles.rightActionsColumn} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.roundButton,
              !isDarkMode ? styles.roundButtonLight : styles.roundButtonDark,
            ]}
            activeOpacity={0.7}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={22}
              color={currentTheme.accent}
            />
          </TouchableOpacity>

          {(loadingImages || thumbnails.length > 1) && (
            <View style={styles.rightThumbnails} pointerEvents="box-none">
              {thumbnails.map((imgUrl, index) => (
                <ThumbnailItem
                  key={imgUrl ? `${imgUrl}-${index}` : `loading-thumb-${index}`}
                  imgUrl={imgUrl}
                  isSelected={mainImage === imgUrl}
                  accent={currentTheme.accent}
                  size={STRICT_THUMB_SIZE}
                  isLoading={!imgUrl || (index > 0 && loadingImages)}
                  isDarkMode={isDarkMode}
                  onPress={() => imgUrl && onSelectImage(imgUrl)}
                />
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>

      <View style={styles.titleOverlay}>
        <Text style={styles.mainTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-sharp"
            size={16}
            color={currentTheme.accent}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const DestinationHeader = memo(DestinationHeaderComponent);
export default DestinationHeader;
