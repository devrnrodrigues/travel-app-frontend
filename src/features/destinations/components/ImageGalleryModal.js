import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Animated,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import styles from "../styles/details.styles";
import { SkeletonBox } from "../../../shared/components/Skeleton";

const { width } = Dimensions.get("window");
const LOOP_BLOCKS = 30;

export const ThumbnailItem = React.memo(function ThumbnailItem({
  imgUrl,
  isSelected,
  accent,
  onPress,
  size,
  isLoading,
  isDarkMode,
}) {
  const [loaded, setLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoaded(false);
    imgAnim.setValue(0);
  }, [imgUrl]);

  const handleLoad = () => {
    setLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isLoading || !imgUrl}
      style={[
        styles.thumbTouch,
        {
          borderColor: isSelected ? accent : "transparent",
          backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.85)" : "#FFFFFF",
        },
      ]}
    >
      {imgUrl ? (
        <Animated.Image
          source={{ uri: imgUrl }}
          style={[styles.thumbImage, { opacity: imgAnim }]}
          width={size}
          height={size}
          resizeMode="cover"
          onLoad={handleLoad}
        />
      ) : null}
      {(isLoading || !loaded) && (
        <View
          style={[
            styles.thumbLoadingOverlay,
            {
              backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.85)" : "#FFFFFF",
            },
          ]}
          pointerEvents="none"
        >
          <SkeletonBox width={size} height={size} borderRadius={8} isDarkMode={isDarkMode} />
        </View>
      )}
    </TouchableOpacity>
  );
});

export default function ImageGalleryModal({
  visible,
  onClose,
  thumbnails = [],
  mainImage,
  onSelectImage,
  defaultImage,
}) {
  const activeModalIndexRef = useRef(0);
  const modalFlatListRef = useRef(null);

  const validThumbnails = useMemo(() => {
    const list = (thumbnails || []).filter((t) => typeof t === "string" && t.length > 0);
    return list.length > 0 ? list : (defaultImage ? [defaultImage] : []);
  }, [thumbnails, defaultImage]);

  const infiniteThumbnails = useMemo(() => {
    const list = [];
    for (let i = 0; i < LOOP_BLOCKS; i++) {
      list.push(...validThumbnails);
    }
    return list;
  }, [validThumbnails]);

  const currentImageRef = useRef(mainImage);
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      currentImageRef.current = mainImage;
      const targetIndex = validThumbnails.indexOf(mainImage);
      const safeIndex = targetIndex >= 0 ? targetIndex : 0;
      const N = validThumbnails.length;
      if (N > 0) {
        const middleRound = Math.floor(LOOP_BLOCKS / 2);
        const initialSlide = middleRound * N + safeIndex;
        activeModalIndexRef.current = initialSlide;
      }

      if (modalFlatListRef.current) {
        const targetOffset = activeModalIndexRef.current * width;
        modalFlatListRef.current?.scrollToOffset({
          offset: targetOffset,
          animated: false,
        });
        const timer = setTimeout(() => {
          try {
            modalFlatListRef.current?.scrollToOffset({
              offset: targetOffset,
              animated: false,
            });
          } catch (e) { }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
    prevVisibleRef.current = visible;
  }, [visible, mainImage, validThumbnails]);

  const handleModalScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset?.x ?? 0;
    const slideW = e.nativeEvent.layoutMeasurement?.width || width;
    if (slideW <= 0) return;

    const currentSlide = Math.round(offsetX / slideW);
    activeModalIndexRef.current = currentSlide;
    const N = validThumbnails.length;
    if (N === 0) return;

    const realIndex = ((currentSlide % N) + N) % N;
    if (validThumbnails[realIndex]) {
      currentImageRef.current = validThumbnails[realIndex];
    }
  };

  const handleClose = () => {
    if (currentImageRef.current && onSelectImage) {
      onSelectImage(currentImageRef.current);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.fullImageModalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />

        <FlatList
          ref={modalFlatListRef}
          data={infiniteThumbnails}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={true}
          style={styles.fullScreenCover}
          contentContainerStyle={{ alignItems: "center" }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={handleModalScrollEnd}
          keyExtractor={(_, index) => `modal-thumb-${index}`}
          windowSize={5}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          removeClippedSubviews={false}
          renderItem={({ item: imgUri }) => (
            <View style={styles.modalSlide}>
              <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.fullWidthFlex} />
              </TouchableWithoutFeedback>

              <View style={styles.galleryRow}>
                <TouchableWithoutFeedback onPress={handleClose}>
                  <View style={styles.flex1FullHeight} />
                </TouchableWithoutFeedback>

                <View style={styles.modalImageWrapper}>
                  <View style={styles.modalImageInner}>
                    <Image
                      source={{ uri: imgUri }}
                      style={styles.fullImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <TouchableWithoutFeedback onPress={handleClose}>
                  <View style={styles.flex1FullHeight} />
                </TouchableWithoutFeedback>
              </View>

              <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.fullWidthFlex} />
              </TouchableWithoutFeedback>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}
