import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ViewerSlide from "./ViewerSlide";
import {
  styles,
  getModalCloseButtonAnimatedStyle,
  getControlsOpacityAnimatedStyle,
} from "../styles/collectionGallery.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PhotoViewerModal = memo(function PhotoViewerModal({
  visible,
  photos,
  selectedPhotoIndex,
  onClose,
  isPinchingViewer,
  setIsPinchingViewer,
  viewerFlatListRef,
  setActiveViewerIndex,
  toggleViewerControls,
  areViewerControlsVisible,
  controlsOpacity,
  currentViewerPhoto,
  onOpenEditCaption,
  onOpenDeletePhoto,
  insets,
  isDarkMode,
}) {
  const closeButtonTop = Math.max(insets.top + 10, 24);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.fullSize}>
        <View style={styles.modalBackdrop}>
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
                onToggleControls={toggleViewerControls}
                onPinchActiveChange={setIsPinchingViewer}
              />
            )}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.bottomTranslucentBar,
              !isDarkMode && styles.bottomTranslucentBarLight,
              getControlsOpacityAnimatedStyle(controlsOpacity),
            ]}
          />

          <Animated.View
            pointerEvents={areViewerControlsVisible ? "auto" : "none"}
            style={[
              styles.captionPill,
              !isDarkMode && styles.captionPillLight,
              getControlsOpacityAnimatedStyle(controlsOpacity),
            ]}
          >
            <TouchableOpacity
              style={styles.captionPillContent}
              activeOpacity={0.8}
              onPress={() => onOpenEditCaption(currentViewerPhoto)}
            >
              <Ionicons
                name="pencil"
                size={13}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
                style={styles.captionPillIcon}
              />
              <Text
                style={[
                  styles.captionPillText,
                  !isDarkMode && styles.captionPillTextLight,
                ]}
                numberOfLines={1}
              >
                {currentViewerPhoto?.caption || "Adicionar nome"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            pointerEvents={areViewerControlsVisible ? "auto" : "none"}
            style={[
              styles.modalDeleteButton,
              !isDarkMode && styles.modalDeleteButtonLight,
              getControlsOpacityAnimatedStyle(controlsOpacity),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableFill}
              activeOpacity={0.7}
              onPress={onOpenDeletePhoto}
            >
              <Ionicons name="trash-outline" size={20} color="#FF453A" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            pointerEvents={areViewerControlsVisible ? "auto" : "none"}
            style={[
              styles.modalCloseButton,
              !isDarkMode && styles.modalCloseButtonLight,
              getModalCloseButtonAnimatedStyle(
                closeButtonTop,
                controlsOpacity
              ),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableFill}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
});

export default PhotoViewerModal;
