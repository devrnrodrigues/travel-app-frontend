import React, { memo, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ViewerSlide from "./ViewerSlide";
import { styles } from "../styles/collectionGallery.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PhotoViewerModal = memo(function PhotoViewerModal({
  visible,
  photos,
  selectedPhotoIndex,
  activeViewerIndex,
  onClose,
  isPinchingViewer,
  setIsPinchingViewer,
  viewerFlatListRef,
  setActiveViewerIndex,
  insets,
  isDarkMode,
}) {
  const currentIndex = activeViewerIndex ?? selectedPhotoIndex ?? 0;

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveViewerIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        setActiveViewerIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, photos.length, setActiveViewerIndex, onClose]);

  const currentWebPhoto = photos[currentIndex] || photos[0];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.fullSize}>
        <View style={styles.modalBackdrop}>
          {Platform.OS === "web" ? (
            <View style={styles.webViewerContainer}>
              {photos.length > 1 && (
                <TouchableOpacity
                  style={[
                    styles.webNavButton,
                    styles.webNavButtonLeft,
                    !isDarkMode && styles.webNavButtonLight,
                  ]}
                  onPress={() => {
                    const prevIdx =
                      (currentIndex - 1 + photos.length) % photos.length;
                    setActiveViewerIndex(prevIdx);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="chevron-back"
                    size={28}
                    color={isDarkMode ? "#FFFFFF" : "#000000"}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.webImageWrapper}>
                <Image
                  source={{ uri: currentWebPhoto?.url }}
                  style={styles.webModalImage}
                  resizeMode="contain"
                />
              </View>

              {photos.length > 1 && (
                <TouchableOpacity
                  style={[
                    styles.webNavButton,
                    styles.webNavButtonRight,
                    !isDarkMode && styles.webNavButtonLight,
                  ]}
                  onPress={() => {
                    const nextIdx = (currentIndex + 1) % photos.length;
                    setActiveViewerIndex(nextIdx);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={28}
                    color={isDarkMode ? "#FFFFFF" : "#000000"}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              ref={viewerFlatListRef}
              scrollEnabled={!isPinchingViewer}
              style={styles.fullSize}
              data={photos}
              horizontal
              pagingEnabled
              initialScrollIndex={selectedPhotoIndex || 0}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const nextIdx = Math.round(
                  e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                if (nextIdx >= 0 && nextIdx < photos.length) {
                  setActiveViewerIndex(nextIdx);
                }
              }}
              renderItem={({ item }) => (
                <ViewerSlide
                  item={item}
                  onPinchActiveChange={setIsPinchingViewer}
                />
              )}
            />
          )}

          {photos && photos.length > 0 && (
            <View
              pointerEvents="none"
              style={[
                styles.viewerCounterBadge,
                !isDarkMode && styles.viewerCounterBadgeLight,
                { bottom: Math.max(insets?.bottom ? insets.bottom + 16 : 24, 24) },
              ]}
            >
              <Text style={styles.viewerCounterText}>
                {`${currentIndex + 1}/${photos.length}`}
              </Text>
            </View>
          )}

          {Platform.OS === "web" && (
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                !isDarkMode && styles.modalCloseButtonLight,
                { top: Math.max(insets?.top ? insets.top + 10 : 24, 24) },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
});

export default PhotoViewerModal;
