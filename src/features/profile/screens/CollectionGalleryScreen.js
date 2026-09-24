import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles/collectionGallery.styles";
import { updatePhotoCaption } from "../data/mockGallery";
import {
  updatePhotoCaptionApi,
  updateCollectionApi,
  deleteCollectionApi,
  addPhotosToCollectionApi,
  deletePhotoApi,
} from "../api/collectionService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ViewerSlide({
  item,
  onToggleControls,
  onPinchActiveChange,
}) {
  const baseScale = useRef(1);
  const currentScale = useRef(1);
  const scale = useRef(new Animated.Value(1)).current;
  const lastTap = useRef(0);

  useEffect(() => {
    baseScale.current = 1;
    currentScale.current = 1;
    scale.setValue(1);
  }, [item?.id]);

  const handlePinchGesture = (event) => {
    const s = event?.nativeEvent?.scale;
    if (typeof s === "number" && !isNaN(s) && s > 0) {
      const nextScale = Math.max(1, Math.min(baseScale.current * s, 4.5));
      scale.setValue(nextScale);
      currentScale.current = nextScale;
    }
  };

  const handlePinchStateChange = (event) => {
    const { state } = event.nativeEvent;
    if (state === State.ACTIVE) {
      onPinchActiveChange?.(true);
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      baseScale.current = currentScale.current;
      if (baseScale.current <= 1.05) {
        baseScale.current = 1;
        currentScale.current = 1;
        scale.setValue(1);
        onPinchActiveChange?.(false);
      } else {
        onPinchActiveChange?.(true);
      }
    }
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      lastTap.current = 0;
      if (baseScale.current > 1.05) {
        baseScale.current = 1;
        currentScale.current = 1;
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onPinchActiveChange?.(false);
        });
      } else {
        baseScale.current = 2.5;
        currentScale.current = 2.5;
        Animated.timing(scale, {
          toValue: 2.5,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onPinchActiveChange?.(true);
        });
      }
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current !== 0 && Date.now() - lastTap.current >= 260) {
          lastTap.current = 0;
          onToggleControls();
        }
      }, 280);
    }
  };

  return (
    <View style={styles.modalSlide}>
      <PinchGestureHandler
        onGestureEvent={handlePinchGesture}
        onHandlerStateChange={handlePinchStateChange}
      >
        <Animated.View
          style={{
            width: SCREEN_WIDTH,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ scale }],
          }}
        >
          <TouchableWithoutFeedback onPress={handleTap}>
            <Image
              source={{ uri: item.url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

export default function CollectionGalleryScreen({ route, navigation }) {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [collectionTitle, setCollectionTitle] = useState(collection?.title || "Galeria");
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
  const menuAnim = useRef(new Animated.Value(0)).current;
  const menuButtonRef = useRef(null);
  const [menuCoords, setMenuCoords] = useState({ top: 68, left: 16 });

  const [isEditCollectionModalOpen, setIsEditCollectionModalOpen] = useState(false);
  const [editCollectionTitle, setEditCollectionTitle] = useState(collection?.title || "");
  const [isEditTitleFocused, setIsEditTitleFocused] = useState(false);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const editModalScale = useRef(new Animated.Value(0.92)).current;
  const editModalTranslateY = useRef(new Animated.Value(0)).current;

  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [selectedNewPhotos, setSelectedNewPhotos] = useState([]);
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const addPhotosModalScale = useRef(new Animated.Value(0.92)).current;

  const [editablePhotos, setEditablePhotos] = useState(() => collection?.photos || []);
  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const deleteModalScale = useRef(new Animated.Value(0.92)).current;

  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const deletePhotoModalScale = useRef(new Animated.Value(0.92)).current;

  const [areViewerControlsVisible, setAreViewerControlsVisible] = useState(true);
  const [isPinchingViewer, setIsPinchingViewer] = useState(false);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const viewerFlatListRef = useRef(null);

  const toggleViewerControls = useCallback(() => {
    setAreViewerControlsVisible((prev) => {
      const next = !prev;
      Animated.timing(controlsOpacity, {
        toValue: next ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return next;
    });
  }, [controlsOpacity]);

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      setAreViewerControlsVisible(true);
      controlsOpacity.setValue(1);
      setIsPinchingViewer(false);
    }
  }, [selectedPhotoIndex, controlsOpacity]);

  const handleOpenMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    const node = menuButtonRef.current;
    if (node) {
      if (typeof node.measureInWindow === "function") {
        node.measureInWindow((x, y, width, height) => {
          if (typeof x === "number" && !isNaN(x) && x > 0) {
            const menuWidth = 175;
            const targetLeft = Math.max(16, x + width - menuWidth + 4);
            setMenuCoords({
              top: y + height + 6,
              left: targetLeft,
            });
          }
          setIsMenuOpen(true);
        });
        return;
      } else if (typeof node.getBoundingClientRect === "function") {
        const rect = node.getBoundingClientRect();
        const menuWidth = 175;
        const targetLeft = Math.max(16, rect.left + rect.width - menuWidth + 4);
        setMenuCoords({
          top: rect.bottom + 6,
          left: targetLeft,
        });
        setIsMenuOpen(true);
        return;
      }
    }
    setIsMenuOpen(true);
  };

  useEffect(() => {
    if (isMenuOpen) {
      menuAnim.setValue(0);
      Animated.spring(menuAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen]);

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });
  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.5, 1],
  });
  const menuScaleY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

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
    if (isEditCollectionModalOpen) {
      setEditablePhotos(photos || []);
      setDeletedPhotoIds([]);
      editModalScale.setValue(0.92);
      editModalTranslateY.setValue(0);
      Animated.spring(editModalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    } else {
      editModalTranslateY.setValue(0);
      setIsEditTitleFocused(false);
    }
  }, [isEditCollectionModalOpen, photos]);

  useEffect(() => {
    if (isAddPhotosModalOpen) {
      setSelectedNewPhotos([]);
      addPhotosModalScale.setValue(0.92);
      Animated.spring(addPhotosModalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    }
  }, [isAddPhotosModalOpen]);

  useEffect(() => {
    if (isDeleteCollectionModalOpen) {
      deleteModalScale.setValue(0.92);
      Animated.spring(deleteModalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    }
  }, [isDeleteCollectionModalOpen]);

  useEffect(() => {
    if (isDeletePhotoModalOpen) {
      deletePhotoModalScale.setValue(0.92);
      Animated.spring(deletePhotoModalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    }
  }, [isDeletePhotoModalOpen]);

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
      Animated.spring(editModalTranslateY, {
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
      Animated.spring(editModalTranslateY, {
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

  const handlePickNewPhotos = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para selecionar fotos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const uris = result.assets.map((asset) => asset.uri);
      setSelectedNewPhotos((prev) => [...prev, ...uris]);
    } catch {
      Alert.alert("Erro", "Não foi possível selecionar as fotos.");
    }
  };

  const handleAddPhotosSubmit = async () => {
    if (selectedNewPhotos.length === 0) {
      Alert.alert("Atenção", "Por favor, selecione ao menos uma foto.");
      return;
    }
    if (!collection?.id) {
      Alert.alert("Erro", "Coleção não encontrada.");
      return;
    }

    setIsAddingPhotos(true);
    try {
      const updated = await addPhotosToCollectionApi(collection.id, selectedNewPhotos);
      if (updated?.photos) {
        setPhotos(updated.photos);
      }
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setSelectedNewPhotos([]);
      setIsAddPhotosModalOpen(false);
    } catch (err) {
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        "Não foi possível adicionar as fotos.";
      Alert.alert("Erro", detail);
    } finally {
      setIsAddingPhotos(false);
    }
  };

  const handleSaveEditCollection = async () => {
    const trimmedTitle = editCollectionTitle.trim();
    if (!trimmedTitle) {
      Alert.alert("Atenção", "Por favor, informe um título para a coleção.");
      return;
    }
    if (trimmedTitle.length > 30) {
      Alert.alert("Atenção", "O título da coleção deve ter no máximo 30 caracteres.");
      return;
    }

    if (collection?.id) {
      setIsSavingEdit(true);
      try {
        const updated = await updateCollectionApi(collection.id, {
          title: trimmedTitle,
          deletePhotoIds: deletedPhotoIds,
        });
        setCollectionTitle(trimmedTitle);
        if (updated?.photos) {
          setPhotos(updated.photos);
        } else {
          setPhotos(editablePhotos);
        }
        await queryClient.invalidateQueries({ queryKey: ["collections"] });
        Keyboard.dismiss();
        setIsEditTitleFocused(false);
        setIsEditCollectionModalOpen(false);
      } catch (err) {
        const detail =
          (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
          err?.message ||
          "Não foi possível salvar as alterações.";
        Alert.alert("Erro", detail);
      } finally {
        setIsSavingEdit(false);
      }
    } else {
      setCollectionTitle(trimmedTitle);
      setPhotos(editablePhotos);
      Keyboard.dismiss();
      setIsEditTitleFocused(false);
      setIsEditCollectionModalOpen(false);
    }
  };

  const handleConfirmDeleteCollection = async () => {
    if (!collection?.id) {
      setIsDeleteCollectionModalOpen(false);
      navigation.goBack();
      return;
    }

    setIsDeletingCollection(true);
    try {
      await deleteCollectionApi(collection.id);
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setIsDeleteCollectionModalOpen(false);
      navigation.goBack();
    } catch (err) {
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        "Não foi possível excluir a coleção.";
      Alert.alert("Erro", detail);
    } finally {
      setIsDeletingCollection(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!currentViewerPhoto) return;
    setIsDeletingPhoto(true);
    try {
      if (collection?.id && currentViewerPhoto.id) {
        await deletePhotoApi(collection.id, currentViewerPhoto.id);
        await queryClient.invalidateQueries({ queryKey: ["collections"] });
      }
      const updatedPhotos = photos.filter((p) => p.id !== currentViewerPhoto.id);
      setPhotos(updatedPhotos);
      setIsDeletePhotoModalOpen(false);
      if (updatedPhotos.length === 0) {
        setSelectedPhotoIndex(null);
      } else {
        const nextIdx = Math.min(activeViewerIndex, updatedPhotos.length - 1);
        setActiveViewerIndex(nextIdx);
      }
    } catch (err) {
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        "Não foi possível excluir a foto.";
      Alert.alert("Erro", detail);
    } finally {
      setIsDeletingPhoto(false);
    }
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
          <View style={styles.titleRow}>
            <Text
              style={[styles.headerTitle, !isDarkMode && styles.headerTitleLight]}
              numberOfLines={1}
            >
              {collectionTitle}
            </Text>
            <TouchableOpacity
              ref={menuButtonRef}
              style={[
                styles.titleMenuButton,
                !isDarkMode && styles.titleMenuButtonLight,
              ]}
              activeOpacity={0.7}
              onPress={handleOpenMenu}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </View>
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

      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <Animated.View
            style={[
              styles.menuDropdown,
              !isDarkMode && styles.menuDropdownLight,
              {
                top: menuCoords.top,
                left: menuCoords.left,
                opacity: menuOpacity,
                transform: [
                  { translateY: menuTranslateY },
                  { scaleY: menuScaleY },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsMenuOpen(false);
                setSelectedNewPhotos([]);
                setIsAddPhotosModalOpen(true);
              }}
            >
              <Ionicons
                name="images-outline"
                size={16}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
                style={styles.menuItemIcon}
              />
              <Text
                style={[
                  styles.menuItemText,
                  !isDarkMode && styles.menuItemTextLight,
                ]}
              >
                Adicionar fotos
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.menuDivider,
                !isDarkMode && styles.menuDividerLight,
              ]}
            />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsMenuOpen(false);
                setEditCollectionTitle(collectionTitle);
                setEditablePhotos(photos || []);
                setDeletedPhotoIds([]);
                setIsEditCollectionModalOpen(true);
              }}
            >
              <Ionicons
                name="pencil-outline"
                size={16}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
                style={styles.menuItemIcon}
              />
              <Text
                style={[
                  styles.menuItemText,
                  !isDarkMode && styles.menuItemTextLight,
                ]}
              >
                Editar coleção
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.menuDivider,
                !isDarkMode && styles.menuDividerLight,
              ]}
            />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsMenuOpen(false);
                setIsDeleteCollectionModalOpen(true);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#FF453A"
                style={styles.menuItemIcon}
              />
              <Text
                style={[
                  styles.menuItemText,
                  styles.menuItemTextDanger,
                ]}
              >
                Excluir coleção
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

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
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 100,
                  paddingHorizontal: 32,
                }}
              >
                <Ionicons
                  name="images-outline"
                  size={52}
                  color={isDarkMode ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"}
                  style={{ marginBottom: 14 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDarkMode ? "#8E8E93" : "#666666",
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  Nenhuma foto na coleção
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: isDarkMode ? "#636366" : "#8E8E93",
                    textAlign: "center",
                  }}
                >
                  Toque nos três pontos acima para adicionar fotos.
                </Text>
              </View>
            }
          />
        </Animated.View>
      </PinchGestureHandler>

      <Modal
        visible={selectedPhotoIndex !== null}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setSelectedPhotoIndex(null)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View
            style={[
              styles.modalOverlay,
              !isDarkMode && styles.modalOverlayLight,
            ]}
          >
            <StatusBar
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              backgroundColor="transparent"
              translucent={true}
            />

            {Platform.OS === "web" ? (
              <TouchableOpacity
                style={styles.webViewerContainer}
                activeOpacity={1}
                onPress={toggleViewerControls}
              >
                {photos.length > 1 && (
                  <Animated.View
                    pointerEvents={areViewerControlsVisible ? "auto" : "none"}
                    style={[
                      styles.webNavButton,
                      styles.webNavButtonLeft,
                      !isDarkMode && styles.webNavButtonLight,
                      { opacity: controlsOpacity },
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={(e) => {
                        e?.stopPropagation?.();
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
                  </Animated.View>
                )}

                {currentViewerPhoto?.url ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={toggleViewerControls}
                    style={{
                      maxWidth: 1200,
                      maxHeight: 850,
                      width: "90%",
                      height: "82%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: currentViewerPhoto.url }}
                      style={styles.webModalImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : null}

                {photos.length > 1 && (
                  <Animated.View
                    pointerEvents={areViewerControlsVisible ? "auto" : "none"}
                    style={[
                      styles.webNavButton,
                      styles.webNavButtonRight,
                      !isDarkMode && styles.webNavButtonLight,
                      { opacity: controlsOpacity },
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={(e) => {
                        e?.stopPropagation?.();
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
                  </Animated.View>
                )}
              </TouchableOpacity>
            ) : (
              <FlatList
                ref={viewerFlatListRef}
                scrollEnabled={!isPinchingViewer}
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
                  <ViewerSlide
                    item={item}
                    onToggleControls={toggleViewerControls}
                    onPinchActiveChange={setIsPinchingViewer}
                  />
                )}
              />
            )}

            <Animated.View
              pointerEvents="none"
              style={[
                styles.bottomTranslucentBar,
                !isDarkMode && styles.bottomTranslucentBarLight,
                {
                  opacity: controlsOpacity,
                },
              ]}
            />

            <Animated.View
              pointerEvents={areViewerControlsVisible ? "auto" : "none"}
              style={[
                styles.captionPill,
                !isDarkMode && styles.captionPillLight,
                {
                  opacity: controlsOpacity,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
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
            </Animated.View>

            <Animated.View
              pointerEvents={areViewerControlsVisible ? "auto" : "none"}
              style={[
                styles.modalDeleteButton,
                !isDarkMode && styles.modalDeleteButtonLight,
                {
                  opacity: controlsOpacity,
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                onPress={() => setIsDeletePhotoModalOpen(true)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#FF453A"
                />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              pointerEvents={areViewerControlsVisible ? "auto" : "none"}
              style={[
                styles.modalCloseButton,
                !isDarkMode && styles.modalCloseButtonLight,
                {
                  top: Math.max(insets.top + 10, 24),
                  opacity: controlsOpacity,
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setSelectedPhotoIndex(null)}
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

      <Modal
        visible={isEditCollectionModalOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => {
          Keyboard.dismiss();
          setIsEditTitleFocused(false);
          setIsEditCollectionModalOpen(false);
        }}
      >
        <View style={styles.editDialogOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setIsEditTitleFocused(false);
              setIsEditCollectionModalOpen(false);
            }}
          />
          <Animated.View
            style={[
              styles.collectionModalCard,
              !isDarkMode && styles.collectionModalCardLight,
              {
                transform: [
                  { translateY: editModalTranslateY },
                  { scale: editModalScale },
                ],
              },
            ]}
          >
            <Text
              style={[
                styles.collectionModalTitle,
                !isDarkMode && styles.collectionModalTitleLight,
              ]}
            >
              Editar coleção
            </Text>
            <Text
              style={[
                styles.collectionModalSubtitle,
                !isDarkMode && styles.collectionModalSubtitleLight,
              ]}
            >
              Altere o título da sua coleção
            </Text>

            <Text
              style={[
                styles.collectionModalSectionLabel,
                !isDarkMode && styles.collectionModalSectionLabelLight,
              ]}
            >
              Nome
            </Text>

            <TextInput
              value={editCollectionTitle}
              onChangeText={setEditCollectionTitle}
              placeholder="Ex: viagem para europa, praias..."
              placeholderTextColor="#8E8E93"
              onFocus={() => setIsEditTitleFocused(true)}
              onBlur={() => setIsEditTitleFocused(false)}
              style={[
                styles.editDialogInput,
                !isDarkMode && styles.editDialogInputLight,
                isEditTitleFocused && (
                  isDarkMode
                    ? styles.editDialogInputFocused
                    : styles.editDialogInputFocusedLight
                ),
              ]}
              maxLength={30}
              returnKeyType="done"
            />

            <View style={styles.charCountRow}>
              <Text
                style={[
                  styles.charCountText,
                  !isDarkMode && styles.charCountTextLight,
                ]}
              >
                {editCollectionTitle.length}/30
              </Text>
            </View>

            <View style={styles.editPhotosHeader}>
              <Text
                style={[
                  styles.collectionModalSectionLabel,
                  !isDarkMode && styles.collectionModalSectionLabelLight,
                  { marginBottom: 0 },
                ]}
              >
                Fotos da coleção
              </Text>
              <Text style={styles.editPhotosCountText}>
                {editablePhotos.length} foto{editablePhotos.length !== 1 ? "s" : ""}
              </Text>
            </View>

            {editablePhotos.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.editPhotosScrollContent}
              >
                {editablePhotos.map((photo, pIdx) => (
                  <View key={photo.id || pIdx} style={styles.editPhotoThumbnailWrapper}>
                    <Image
                      source={{ uri: photo.url }}
                      style={[
                        styles.editPhotoThumbnail,
                        !isDarkMode && styles.editPhotoThumbnailLight,
                      ]}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.editPhotoDeleteBadge}
                      activeOpacity={0.7}
                      onPress={() => {
                        const photoToDelete = editablePhotos[pIdx];
                        if (photoToDelete?.id) {
                          setDeletedPhotoIds((prev) => [...prev, photoToDelete.id]);
                        }
                        setEditablePhotos((prev) => prev.filter((_, i) => i !== pIdx));
                      }}
                    >
                      <Ionicons name="trash-outline" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.emptyPhotosBox,
                  !isDarkMode && styles.emptyPhotosBoxLight,
                ]}
              >
                <Text style={styles.emptyPhotosText}>
                  Nenhuma foto restante nesta coleção
                </Text>
              </View>
            )}

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  !isDarkMode && styles.modalCancelButtonLight,
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  setIsEditTitleFocused(false);
                  setDeletedPhotoIds([]);
                  setEditablePhotos(photos || []);
                  setIsEditCollectionModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    !isDarkMode && styles.modalCancelButtonTextLight,
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  !isDarkMode && styles.modalSubmitButtonLight,
                ]}
                activeOpacity={0.8}
                disabled={isSavingEdit}
                onPress={handleSaveEditCollection}
              >
                {isSavingEdit ? (
                  <ActivityIndicator
                    size="small"
                    color={!isDarkMode ? "#FFFFFF" : "#000000"}
                  />
                ) : (
                  <Text
                    style={[
                      styles.modalSubmitButtonText,
                      !isDarkMode && styles.modalSubmitButtonTextLight,
                    ]}
                  >
                    Salvar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={isAddPhotosModalOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => {
          setIsAddPhotosModalOpen(false);
        }}
      >
        <View style={styles.editDialogOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsAddPhotosModalOpen(false)}
          />
          <Animated.View
            style={[
              styles.collectionModalCard,
              !isDarkMode && styles.collectionModalCardLight,
              {
                transform: [{ scale: addPhotosModalScale }],
              },
            ]}
          >
            <Text
              style={[
                styles.collectionModalTitle,
                !isDarkMode && styles.collectionModalTitleLight,
              ]}
            >
              Adicionar fotos
            </Text>
            <Text
              style={[
                styles.collectionModalSubtitle,
                !isDarkMode && styles.collectionModalSubtitleLight,
              ]}
            >
              Selecione fotos para incluir nesta coleção
            </Text>

            <Text
              style={[
                styles.collectionModalSectionLabel,
                !isDarkMode && styles.collectionModalSectionLabelLight,
              ]}
            >
              Fotos
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadPhotoBox,
                !isDarkMode && styles.uploadPhotoBoxLight,
              ]}
              activeOpacity={0.75}
              onPress={handlePickNewPhotos}
            >
              <View
                style={[
                  styles.uploadPhotoIconCircle,
                  !isDarkMode && styles.uploadPhotoIconCircleLight,
                ]}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={26}
                  color={isDarkMode ? "#FFFFFF" : "#000000"}
                />
              </View>
              <Text
                style={[
                  styles.uploadPhotoTitle,
                  !isDarkMode && styles.uploadPhotoTitleLight,
                ]}
              >
                {selectedNewPhotos.length > 0
                  ? "Adicionar mais fotos"
                  : "Inserir fotos"}
              </Text>
              <Text
                style={[
                  styles.uploadPhotoSubtitle,
                  !isDarkMode && styles.uploadPhotoSubtitleLight,
                ]}
              >
                {selectedNewPhotos.length > 0
                  ? `${selectedNewPhotos.length} foto${selectedNewPhotos.length !== 1 ? "s" : ""} selecionada${selectedNewPhotos.length !== 1 ? "s" : ""}`
                  : "Toque para escolher fotos do dispositivo"}
              </Text>
            </TouchableOpacity>

            {selectedNewPhotos.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.editPhotosScrollContent, { marginTop: 10 }]}
              >
                {selectedNewPhotos.map((uri, idx) => (
                  <View key={`${uri}_${idx}`} style={styles.editPhotoThumbnailWrapper}>
                    <Image
                      source={{ uri }}
                      style={[
                        styles.editPhotoThumbnail,
                        !isDarkMode && styles.editPhotoThumbnailLight,
                      ]}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.editPhotoDeleteBadge}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedNewPhotos((prev) => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      <Ionicons name="trash-outline" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  !isDarkMode && styles.modalCancelButtonLight,
                ]}
                onPress={() => {
                  setSelectedNewPhotos([]);
                  setIsAddPhotosModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    !isDarkMode && styles.modalCancelButtonTextLight,
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  !isDarkMode && styles.modalSubmitButtonLight,
                ]}
                activeOpacity={0.8}
                disabled={isAddingPhotos}
                onPress={handleAddPhotosSubmit}
              >
                {isAddingPhotos ? (
                  <ActivityIndicator
                    size="small"
                    color={!isDarkMode ? "#FFFFFF" : "#000000"}
                  />
                ) : (
                  <Text
                    style={[
                      styles.modalSubmitButtonText,
                      !isDarkMode && styles.modalSubmitButtonTextLight,
                    ]}
                  >
                    Adicionar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      <Modal
        visible={isDeleteCollectionModalOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setIsDeleteCollectionModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.confirmOverlay}
          activeOpacity={1}
          onPress={() => setIsDeleteCollectionModalOpen(false)}
        >
          <Animated.View
            style={[
              styles.confirmCard,
              !isDarkMode && styles.confirmCardLight,
              {
                transform: [{ scale: deleteModalScale }],
              },
            ]}
          >
            <View style={styles.confirmContentSection}>
              <Text style={[styles.confirmTitle, !isDarkMode && styles.confirmTitleLight]}>
                Excluir coleção?
              </Text>
              <Text style={[styles.confirmMessage, !isDarkMode && styles.confirmMessageLight]}>
                Deseja excluir a coleção{" "}
                <Text style={[styles.confirmBoldText, !isDarkMode && styles.confirmBoldTextLight]}>
                  "{collectionTitle}"
                </Text>
                ? Esta ação não pode ser desfeita.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmActionButton,
                !isDarkMode && styles.confirmActionButtonLight,
              ]}
              onPress={handleConfirmDeleteCollection}
              activeOpacity={0.65}
              disabled={isDeletingCollection}
            >
              {isDeletingCollection ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Text style={styles.confirmDeleteText}>Excluir</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmActionButton,
                styles.confirmLastButton,
                !isDarkMode && styles.confirmActionButtonLight,
              ]}
              onPress={() => setIsDeleteCollectionModalOpen(false)}
              activeOpacity={0.65}
            >
              <Text style={[styles.confirmCancelText, !isDarkMode && styles.confirmCancelTextLight]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isDeletePhotoModalOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setIsDeletePhotoModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.confirmOverlay}
          activeOpacity={1}
          onPress={() => setIsDeletePhotoModalOpen(false)}
        >
          <Animated.View
            style={[
              styles.confirmCard,
              !isDarkMode && styles.confirmCardLight,
              {
                transform: [{ scale: deletePhotoModalScale }],
              },
            ]}
          >
            <View style={styles.confirmContentSection}>
              <Text style={[styles.confirmTitle, !isDarkMode && styles.confirmTitleLight]}>
                Excluir foto?
              </Text>
              <Text style={[styles.confirmMessage, !isDarkMode && styles.confirmMessageLight]}>
                Deseja excluir esta foto da coleção? Esta ação não pode ser desfeita.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmActionButton,
                !isDarkMode && styles.confirmActionButtonLight,
              ]}
              onPress={handleConfirmDeletePhoto}
              activeOpacity={0.65}
              disabled={isDeletingPhoto}
            >
              {isDeletingPhoto ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Text style={styles.confirmDeleteText}>Excluir</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmActionButton,
                styles.confirmLastButton,
                !isDarkMode && styles.confirmActionButtonLight,
              ]}
              onPress={() => setIsDeletePhotoModalOpen(false)}
              activeOpacity={0.65}
            >
              <Text style={[styles.confirmCancelText, !isDarkMode && styles.confirmCancelTextLight]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
