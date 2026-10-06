import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import viewerStyles from "../styles/commentPhotoViewerModal.styles";
import useCommentPhotoViewer from "../hooks/useCommentPhotoViewer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CommentPhotoViewerModal({
  visible,
  photos = [],
  initialIndex = 0,
  onClose,
}) {
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
        {Platform.OS === "web" && (
          <TouchableOpacity
            style={viewerStyles.webCloseBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        )}
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
                    source={{ uri: currentPhoto?.url }}
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
                initialScrollIndex={initialIndex}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => handleMomentumScrollEnd(e, SCREEN_WIDTH)}
                keyExtractor={(item) => item.id || item.url}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={onClose}>
                    <View style={viewerStyles.slide}>
                      <Image
                        source={{ uri: item.url }}
                        style={viewerStyles.mainImage}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
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
