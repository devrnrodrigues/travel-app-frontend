import React, { useState, useEffect, useRef } from "react";
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
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CommentPhotoViewerModal({
  visible,
  photos = [],
  initialIndex = 0,
  onClose,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setActiveIndex(initialIndex);
      setTimeout(() => {
        if (flatListRef.current && photos.length > 0 && initialIndex < photos.length) {
          flatListRef.current.scrollToIndex({
            index: initialIndex,
            animated: false,
          });
        }
      }, 50);
    }
  }, [visible, initialIndex, photos.length]);

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, photos.length, onClose]);

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
                    onPress={() =>
                      setActiveIndex(
                        (prev) => (prev - 1 + photos.length) % photos.length
                      )
                    }
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
                    onPress={() =>
                      setActiveIndex((prev) => (prev + 1) % photos.length)
                    }
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
                onMomentumScrollEnd={(e) => {
                  const nextIndex = Math.round(
                    e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                  );
                  if (nextIndex >= 0 && nextIndex < photos.length) {
                    setActiveIndex(nextIndex);
                  }
                }}
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

const viewerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.96)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  webCloseBtn: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  webNavBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  webNavBtnLeft: {
    left: 24,
  },
  webNavBtnRight: {
    right: 24,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "85%",
    maxWidth: 900,
    maxHeight: 700,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 10,
  },
  counterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
