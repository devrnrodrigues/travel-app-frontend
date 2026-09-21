import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  LayoutAnimation,
  StatusBar,
  Animated,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles/collectionGallery.styles";
import { updatePhotoCaption } from "../data/mockGallery";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CollectionGalleryScreen({ route, navigation }) {
  const { collection } = route.params || {};
  const { isDarkMode, currentTheme } = useTheme();

  const [columns, setColumns] = useState(3);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activeViewerIndex, setActiveViewerIndex] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [editingText, setEditingText] = useState("");

  const [photos, setPhotos] = useState(() => collection?.photos || []);
  const lastChangeTime = useRef(0);
  const pinchRef = useRef(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const pinchScale = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(1)).current;
  const modalTranslateY = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (isEditingCaption) {
      modalScale.setValue(0.92);
      modalTranslateY.setValue(0);
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    } else {
      modalTranslateY.setValue(0);
      setIsInputFocused(false);
    }
  }, [isEditingCaption]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : 280;
      Animated.spring(modalTranslateY, {
        toValue: -Math.max(keyboardHeight * 0.52, 140),
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.spring(modalTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const currentViewerPhoto =
    photos[activeViewerIndex] ||
    (selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null);

  const handleSaveCaption = () => {
    if (!currentViewerPhoto) return;
    const trimmed = editingText.trim();
    updatePhotoCaption(collection?.id, currentViewerPhoto.id, trimmed);
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === currentViewerPhoto.id ? { ...p, caption: trimmed } : p
      )
    );
    setIsInputFocused(false);
    setIsEditingCaption(false);
  };

  const triggerTransitionAnimation = () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (e) {}
    Animated.sequence([
      Animated.timing(gridOpacity, {
        toValue: 0.82,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinchGesture = (event) => {
    const { scale } = event.nativeEvent;
    pinchScale.setValue(scale);

    const now = Date.now();
    if (now - lastChangeTime.current < 260) return;

    if (scale > 1.14) {
      setColumns((prev) => {
        if (prev > 1) {
          lastChangeTime.current = now;
          triggerTransitionAnimation();
          return prev - 1;
        }
        return prev;
      });
    } else if (scale < 0.86) {
      setColumns((prev) => {
        if (prev < 4) {
          lastChangeTime.current = now;
          triggerTransitionAnimation();
          return prev + 1;
        }
        return prev;
      });
    }
  };

  const handlePinchStateChange = (event) => {
    const { state } = event.nativeEvent;
    if (state === State.ACTIVE) {
      setIsPinching(true);
      lastChangeTime.current = 0;
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      setIsPinching(false);
      Animated.spring(pinchScale, {
        toValue: 1,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }).start();
      lastChangeTime.current = 0;
    }
  };


  const { itemWidth, itemHeight, gap, borderRadius } = useMemo(() => {
    const pad = 16;
    if (columns === 1) {
      const w = SCREEN_WIDTH - pad * 2;
      return {
        itemWidth: w,
        itemHeight: Math.round(w * 0.75),
        gap: 14,
        borderRadius: 16,
      };
    }
    if (columns === 2) {
      const g = 12;
      const w = (SCREEN_WIDTH - pad * 2 - g) / 2;
      return {
        itemWidth: w,
        itemHeight: w,
        gap: g,
        borderRadius: 14,
      };
    }
    if (columns === 3) {
      const g = 8;
      const w = (SCREEN_WIDTH - pad * 2 - g * 2) / 3;
      return {
        itemWidth: w,
        itemHeight: w,
        gap: g,
        borderRadius: 10,
      };
    }
    const g = 6;
    const w = (SCREEN_WIDTH - pad * 2 - g * 3) / 4;
    return {
      itemWidth: w,
      itemHeight: w,
      gap: g,
      borderRadius: 6,
    };
  }, [columns]);

  const renderGridItem = ({ item, index }) => {
    const isLastInRow = (index + 1) % columns === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          setSelectedPhotoIndex(index);
          setActiveViewerIndex(index);
        }}
        style={[
          styles.gridItem,
          !isDarkMode && styles.gridItemLight,
          {
            width: itemWidth,
            height: itemHeight,
            borderRadius,
            marginRight: isLastInRow ? 0 : gap,
            marginBottom: gap,
          },
        ]}
      >
        <Image
          source={{ uri: item.url }}
          style={styles.gridImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, !isDarkMode && styles.containerLight]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000000" : "#FFFFFF"}
      />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text
            style={[styles.headerTitle, !isDarkMode && styles.headerTitleLight]}
            numberOfLines={1}
          >
            {collection?.title || "Galeria"}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              !isDarkMode && styles.headerSubtitleLight,
            ]}
            numberOfLines={1}
          >
            {photos.length} fotos
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, !isDarkMode && styles.backButtonLight]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>

      <PinchGestureHandler
        ref={pinchRef}
        simultaneousHandlers={flatListRef}
        onGestureEvent={handlePinchGesture}
        onHandlerStateChange={handlePinchStateChange}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: gridOpacity,
            transform: [
              {
                scale: pinchScale.interpolate({
                  inputRange: [0.65, 1, 1.45],
                  outputRange: [0.88, 1, 1.12],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <FlatList
            ref={flatListRef}
            scrollEnabled={!isPinching}
            key={`gallery-cols-${columns}`}
            data={photos}
            numColumns={columns}
            keyExtractor={(item) => item.id}
            renderItem={renderGridItem}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces={true}
          />
        </Animated.View>
      </PinchGestureHandler>

      <Modal
        visible={selectedPhotoIndex !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setSelectedPhotoIndex(null)}
      >
        <View
          style={[
            styles.modalOverlay,
            !isDarkMode && styles.modalOverlayLight,
          ]}
        >
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={isDarkMode ? "#000000" : "#FFFFFF"}
          />

          <TouchableOpacity
            style={[
              styles.modalCloseButton,
              !isDarkMode && styles.modalCloseButtonLight,
            ]}
            onPress={() => setSelectedPhotoIndex(null)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>

          <FlatList
            data={photos}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedPhotoIndex || 0}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(item) => item.id}
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
              <View style={styles.modalSlide}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <TouchableOpacity
            style={[
              styles.captionPill,
              !isDarkMode && styles.captionPillLight,
            ]}
            activeOpacity={0.8}
            onPress={() => {
              setEditingText(currentViewerPhoto?.caption || "");
              setIsEditingCaption(true);
            }}
          >
            <Ionicons
              name="pencil"
              size={13}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
              style={{ marginRight: 6 }}
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
        </View>
      </Modal>

      <Modal
        visible={isEditingCaption}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => {
          Keyboard.dismiss();
          setIsInputFocused(false);
          setIsEditingCaption(false);
        }}
      >
        <View style={styles.editDialogOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setIsInputFocused(false);
              setIsEditingCaption(false);
            }}
          />
          <Animated.View
            style={[
              styles.editDialogBox,
              !isDarkMode && styles.editDialogBoxLight,
              {
                transform: [
                  { translateY: modalTranslateY },
                  { scale: modalScale },
                ],
              },
            ]}
          >
            <Text
              style={[
                styles.editDialogTitle,
                !isDarkMode && styles.editDialogTitleLight,
              ]}
            >
              Titulo
            </Text>
            <Text
              style={[
                styles.editDialogSubtitle,
                !isDarkMode && styles.editDialogSubtitleLight,
              ]}
            >
              Esse nome aparecerá escrito na foto do polaroid
            </Text>

            <TextInput
              ref={inputRef}
              value={editingText}
              onChangeText={setEditingText}
              placeholder="Ex: Férias em Paris"
              placeholderTextColor="#8E8E93"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              style={[
                styles.editDialogInput,
                !isDarkMode && styles.editDialogInputLight,
                isInputFocused && (
                  isDarkMode
                    ? styles.editDialogInputFocused
                    : styles.editDialogInputFocusedLight
                ),
              ]}
              maxLength={28}
              returnKeyType="done"
              onSubmitEditing={handleSaveCaption}
            />

            <View style={styles.editDialogButtons}>
              <TouchableOpacity
                style={styles.editDialogCancelBtn}
                onPress={() => {
                  Keyboard.dismiss();
                  setIsInputFocused(false);
                  setIsEditingCaption(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.editDialogCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.editDialogSaveBtn,
                  !isDarkMode && styles.editDialogSaveBtnLight,
                ]}
                onPress={handleSaveCaption}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.editDialogSaveText,
                    !isDarkMode && styles.editDialogSaveTextLight,
                  ]}
                >
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
