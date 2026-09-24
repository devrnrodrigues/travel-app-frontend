import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles/collectionGallery.styles";
import { updatePhotoCaption } from "../data/mockGallery";
import { updatePhotoCaptionApi } from "../api/collectionService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CollectionGalleryScreen({ route, navigation }) {
  const queryClient = useQueryClient();
  const { collection, highlightPhotoIndex } = route.params || {};
  const { isDarkMode, currentTheme } = useTheme();

  const [columns, setColumns] = useState(3);

  useEffect(() => {
    AsyncStorage.getItem("@gallery_grid_columns")
      .then((saved) => {
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (parsed >= 1 && parsed <= 4) {
            setColumns(parsed);
          }
        }
      })
      .catch(() => {});
  }, []);

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
  const borderBlinkAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const rawIdx = route.params?.highlightPhotoIndex;
      if (rawIdx !== undefined && rawIdx !== null) {
        const targetIdx = Number(rawIdx);
        borderBlinkAnim.setValue(0);

        const timer = setTimeout(() => {
          if (targetIdx > 0) {
            try {
              flatListRef.current?.scrollToIndex({
                index: targetIdx,
                animated: true,
                viewPosition: 0.5,
              });
            } catch (e) {}
          }

          Animated.sequence([
            Animated.timing(borderBlinkAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }),
            Animated.timing(borderBlinkAnim, {
              toValue: 0.05,
              duration: 450,
              useNativeDriver: false,
            }),
            Animated.timing(borderBlinkAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }),
            Animated.timing(borderBlinkAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: false,
            }),
          ]).start();
        }, 350);

        return () => clearTimeout(timer);
      } else {
        borderBlinkAnim.setValue(0);
      }
    }, [route.params?.highlightPhotoIndex, borderBlinkAnim])
  );

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

  useEffect(() => {
    if (Platform.OS !== "web" || selectedPhotoIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveViewerIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        setActiveViewerIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  const currentViewerPhoto =
    photos[activeViewerIndex] ||
    (selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null);

  const handleSaveCaption = async () => {
    if (!currentViewerPhoto) return;
    const trimmed = editingText.trim();
    if (trimmed.length > 30) return;

    if (collection?.id && currentViewerPhoto.id) {
      try {
        await updatePhotoCaptionApi(collection.id, currentViewerPhoto.id, trimmed);
        queryClient.invalidateQueries({ queryKey: ["collections"] });
      } catch {
        updatePhotoCaption(collection?.id, currentViewerPhoto.id, trimmed);
      }
    } else {
      updatePhotoCaption(collection?.id, currentViewerPhoto.id, trimmed);
    }

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
          const next = prev - 1;
          AsyncStorage.setItem("@gallery_grid_columns", String(next)).catch(() => {});
          return next;
        }
        return prev;
      });
    } else if (scale < 0.86) {
      setColumns((prev) => {
        if (prev < 4) {
          lastChangeTime.current = now;
          triggerTransitionAnimation();
          const next = prev + 1;
          AsyncStorage.setItem("@gallery_grid_columns", String(next)).catch(() => {});
          return next;
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
    const rawIdx = route.params?.highlightPhotoIndex;
    const isHighlighted =
      rawIdx !== undefined &&
      rawIdx !== null &&
      Number(index) === Number(rawIdx);

    return (
      <View
        style={{
          width: itemWidth,
          height: itemHeight,
          marginRight: isLastInRow ? 0 : gap,
          marginBottom: gap,
          position: "relative",
        }}
      >
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
              width: "100%",
              height: "100%",
              borderRadius,
            },
          ]}
        >
          <Image
            source={{ uri: item.url }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {isHighlighted && (
          <Animated.View
            pointerEvents="none"
            collapsable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius,
              borderWidth: 4,
              borderColor: currentTheme?.accent || "#3B82F6",
              opacity: borderBlinkAnim,
              zIndex: 9999,
              elevation: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
            }}
          />
        )}
      </View>
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
            extraData={route.params?.highlightPhotoIndex}
            numColumns={columns}
            keyExtractor={(item) => item.id}
            renderItem={renderGridItem}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces={true}
            onScrollToIndexFailed={() => {}}
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
                      (activeViewerIndex - 1 + photos.length) % photos.length;
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

              {currentViewerPhoto?.url ? (
                <Image
                  source={{ uri: currentViewerPhoto.url }}
                  style={styles.webModalImage}
                  resizeMode="contain"
                />
              ) : null}

              {photos.length > 1 && (
                <TouchableOpacity
                  style={[
                    styles.webNavButton,
                    styles.webNavButtonRight,
                    !isDarkMode && styles.webNavButtonLight,
                  ]}
                  onPress={() => {
                    const nextIdx = (activeViewerIndex + 1) % photos.length;
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
              style={{ flex: 1 }}
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
          )}

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
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={handleSaveCaption}
            />

            <View style={styles.charCountRow}>
              <Text
                style={[
                  styles.charCountText,
                  !isDarkMode && styles.charCountTextLight,
                ]}
              >
                {editingText.length}/30
              </Text>
            </View>

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
