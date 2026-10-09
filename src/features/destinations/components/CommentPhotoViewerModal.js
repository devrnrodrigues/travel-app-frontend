import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import viewerStyles from "../styles/commentPhotoViewerModal.styles";
import useCommentPhotoViewer from "../hooks/useCommentPhotoViewer";

export default function CommentPhotoViewerModal({
  visible,
  photos = [],
  initialIndex = 0,
  onClose,
}) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const {
    activeIndex,
    flatListRef,
    handleNextWeb,
    handlePrevWeb,
    handleMomentumScrollEnd,
  } = useCommentPhotoViewer({
    visible,
    photos,
    initialIndex,
    onClose,
  });

  if (!visible || !photos || photos.length === 0) return null;

  const currentPhoto = photos[activeIndex] || photos[0];
  const currentPhotoUrl =
    currentPhoto?.url ||
    currentPhoto?.uri ||
    (typeof currentPhoto === "string" ? currentPhoto : "");

  const closeButtonTop = Math.max(insets.top + 8, 20);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={true} />
      <View style={viewerStyles.container}>
        <TouchableOpacity
          style={[viewerStyles.closeBtn, { top: closeButtonTop }]}
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <SafeAreaView style={viewerStyles.safeArea} edges={["top", "bottom"]}>
          <View style={viewerStyles.contentArea}>
            {Platform.OS === "web" ? (
              <View style={viewerStyles.webContainer}>
                {photos.length > 1 && (
                  <TouchableOpacity
                    style={[viewerStyles.webNavBtn, viewerStyles.webNavBtnLeft]}
                    onPress={handlePrevWeb}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                )}

                <TouchableWithoutFeedback onPress={onClose}>
                  <Image
                    source={{ uri: currentPhotoUrl }}
                    style={viewerStyles.mainImage}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>

                {photos.length > 1 && (
                  <TouchableOpacity
                    style={[viewerStyles.webNavBtn, viewerStyles.webNavBtnRight]}
                    onPress={handleNextWeb}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={photos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={viewerStyles.flatList}
                contentContainerStyle={viewerStyles.flatListContent}
                initialScrollIndex={
                  initialIndex > 0 && initialIndex < photos.length
                    ? initialIndex
                    : undefined
                }
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onScrollToIndexFailed={(info) => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: false,
                    });
                  }, 100);
                }}
                onMomentumScrollEnd={(e) =>
                  handleMomentumScrollEnd(e, screenWidth)
                }
                keyExtractor={(item, index) => {
                  if (item && item.id) return String(item.id);
                  if (item && item.url) return item.url;
                  if (typeof item === "string") return item;
                  return String(index);
                }}
                renderItem={({ item }) => {
                  const photoUrl =
                    item?.url ||
                    item?.uri ||
                    (typeof item === "string" ? item : "");

                  return (
                    <View style={[viewerStyles.slide, { width: screenWidth }]}>
                      <TouchableWithoutFeedback onPress={onClose}>
                        <View style={viewerStyles.imageWrapper}>
                          <Image
                            source={{ uri: photoUrl }}
                            style={viewerStyles.mainImage}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                }}
              />
            )}
          </View>

          <View style={viewerStyles.footer}>
            <View style={viewerStyles.counterPill}>
              <Text style={viewerStyles.counterText}>
                {activeIndex + 1}/{photos.length}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
