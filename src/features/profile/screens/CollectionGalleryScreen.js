import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StatusBar,
  Animated,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
import { useTheme } from "../../../theme/ThemeContext";
import useCollectionGallery from "../hooks/useCollectionGallery";
import useGalleryGrid from "../hooks/useGalleryGrid";
import CollectionGalleryHeader from "../components/CollectionGalleryHeader";
import CollectionPhotoGrid from "../components/CollectionPhotoGrid";
import GalleryMenuModal from "../components/GalleryMenuModal";
import PhotoViewerModal from "../components/PhotoViewerModal";
import EditCaptionModal from "../components/EditCaptionModal";
import EditCollectionModal from "../components/EditCollectionModal";
import AddPhotosModal from "../components/AddPhotosModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { styles } from "../styles/collectionGallery.styles";

const SAFE_EDGES = ["top", "bottom"];

export default function CollectionGalleryScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { collection: initialCollection, highlightPhotoIndex } =
    route.params || {};
  const { isDarkMode, currentTheme } = useTheme();

  const {
    collection,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
    isMenuOpen,
    setIsMenuOpen,
    isEditingCaption,
    setIsEditingCaption,
    captionText,
    setCaptionText,
    isSavingCaption,
    captionErrors,
    setCaptionErrors,
    handleOpenEditCaption,
    handleSaveCaption,
    isEditCollectionModalOpen,
    setIsEditCollectionModalOpen,
    editCollectionTitle,
    setEditCollectionTitle,
    selectedPhotoIdsToDelete,
    setSelectedPhotoIdsToDelete,
    isSavingEditCollection,
    editCollectionErrors,
    setEditCollectionErrors,
    handleTogglePhotoDelete,
    handleSaveEditCollection,
    isAddPhotosModalOpen,
    setIsAddPhotosModalOpen,
    newPhotosToUpload,
    setNewPhotosToUpload,
    isPickingPhotos,
    isSavingNewPhotos,
    addPhotosErrors,
    setAddPhotosErrors,
    handlePickNewPhotos,
    handleRemoveNewPhoto,
    handleSaveNewPhotos,
    isDeleteCollectionModalOpen,
    setIsDeleteCollectionModalOpen,
    isDeletingCollection,
    handleDeleteCollection,
    isDeletePhotoModalOpen,
    setIsDeletePhotoModalOpen,
    photoToDelete,
    isDeletingPhoto,
    handleConfirmDeletePhoto,
    handleDeletePhoto,
    handleSetCoverPhoto,
  } = useCollectionGallery(initialCollection, navigation);

  const {
    columns,
    itemDimensions,
    pinchRef,
    flatListRef,
    isPinching,
    gridOpacity,
    pinchScale,
    borderBlinkAnim,
    handlePinchGesture,
    handlePinchStateChange,
  } = useGalleryGrid(highlightPhotoIndex);

  const [activeViewerIndex, setActiveViewerIndex] = useState(0);
  const [isPinchingViewer, setIsPinchingViewer] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEditTitleFocused, setIsEditTitleFocused] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 68, left: 20 });

  const menuButtonRef = useRef(null);
  const viewerFlatListRef = useRef(null);
  const captionInputRef = useRef(null);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;
  const editModalTranslateY = useRef(new Animated.Value(0)).current;
  const editModalScale = useRef(new Animated.Value(0.92)).current;
  const addPhotosModalScale = useRef(new Animated.Value(0.92)).current;
  const deleteModalScale = useRef(new Animated.Value(0.92)).current;
  const deletePhotoModalScale = useRef(new Animated.Value(0.92)).current;

  const photos = useMemo(() => collection?.photos || [], [collection?.photos]);
  const collectionTitle = collection?.title || "Galeria";

  const editablePhotos = useMemo(() => {
    return photos.filter((p) => !selectedPhotoIdsToDelete.includes(p.id));
  }, [photos, selectedPhotoIdsToDelete]);

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      setIsPinchingViewer(false);
      setActiveViewerIndex(selectedPhotoIndex);
    }
  }, [selectedPhotoIndex]);

  const handleOpenMenu = useCallback(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    const node = menuButtonRef.current;
    if (node && typeof node.measureInWindow === "function") {
      node.measureInWindow((x, y, width, height) => {
        if (typeof x === "number" && !isNaN(x) && x >= 0) {
          const menuWidth = 175;
          const targetLeft = Math.max(16, Math.min(x, SCREEN_WIDTH - menuWidth - 16));
          setMenuCoords({
            top: y + height + 6,
            left: targetLeft,
          });
        }
        setIsMenuOpen(true);
      });
      return;
    }
    setIsMenuOpen(true);
  }, [isMenuOpen, setIsMenuOpen]);

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
  }, [isMenuOpen, menuAnim]);

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });

  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.7, 1],
  });

  const menuScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  useEffect(() => {
    if (isEditingCaption) {
      modalTranslateY.setValue(18);
      modalScale.setValue(0.94);
      Animated.parallel([
        Animated.spring(modalTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isEditingCaption, modalTranslateY, modalScale]);

  useEffect(() => {
    if (isEditCollectionModalOpen) {
      editModalTranslateY.setValue(18);
      editModalScale.setValue(0.94);
      Animated.parallel([
        Animated.spring(editModalTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(editModalScale, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isEditCollectionModalOpen, editModalTranslateY, editModalScale]);

  useEffect(() => {
    if (isAddPhotosModalOpen) {
      addPhotosModalScale.setValue(0.94);
      Animated.spring(addPhotosModalScale, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [isAddPhotosModalOpen, addPhotosModalScale]);

  useEffect(() => {
    if (isDeleteCollectionModalOpen) {
      deleteModalScale.setValue(0.94);
      Animated.spring(deleteModalScale, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [isDeleteCollectionModalOpen, deleteModalScale]);

  useEffect(() => {
    if (isDeletePhotoModalOpen) {
      deletePhotoModalScale.setValue(0.94);
      Animated.spring(deletePhotoModalScale, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [isDeletePhotoModalOpen, deletePhotoModalScale]);

  const handleSelectPhoto = useCallback(
    (index) => {
      setSelectedPhotoIndex(index);
      setActiveViewerIndex(index);
    },
    [setSelectedPhotoIndex]
  );

  const handleCloseViewer = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, [setSelectedPhotoIndex]);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const handleOpenAddPhotos = useCallback(() => {
    setIsMenuOpen(false);
    setNewPhotosToUpload([]);
    setIsAddPhotosModalOpen(true);
  }, [setIsMenuOpen, setIsAddPhotosModalOpen, setNewPhotosToUpload]);

  const handleOpenEditCollection = useCallback(() => {
    setIsMenuOpen(false);
    setEditCollectionTitle(collection?.title || "");
    setSelectedPhotoIdsToDelete([]);
    setIsEditCollectionModalOpen(true);
  }, [setIsMenuOpen, setIsEditCollectionModalOpen, collection?.title, setEditCollectionTitle, setSelectedPhotoIdsToDelete]);

  const handleOpenDeleteCollection = useCallback(() => {
    setIsMenuOpen(false);
    setIsDeleteCollectionModalOpen(true);
  }, [setIsMenuOpen, setIsDeleteCollectionModalOpen]);

  const handleCloseEditCaption = useCallback(() => {
    Keyboard.dismiss();
    setIsInputFocused(false);
    setCaptionErrors({});
    setIsEditingCaption(false);
  }, [setIsEditingCaption, setCaptionErrors]);

  const handleCloseEditCollection = useCallback(() => {
    Keyboard.dismiss();
    setIsEditTitleFocused(false);
    setSelectedPhotoIdsToDelete([]);
    setEditCollectionErrors({});
    setIsEditCollectionModalOpen(false);
  }, [setIsEditCollectionModalOpen, setSelectedPhotoIdsToDelete, setEditCollectionErrors]);

  const handleCloseAddPhotos = useCallback(() => {
    if (!isPickingPhotos && !isSavingNewPhotos) {
      setNewPhotosToUpload([]);
      setAddPhotosErrors({});
      setIsAddPhotosModalOpen(false);
    }
  }, [isPickingPhotos, isSavingNewPhotos, setIsAddPhotosModalOpen, setNewPhotosToUpload, setAddPhotosErrors]);

  const handleCancelDeleteCollection = useCallback(() => {
    setIsDeleteCollectionModalOpen(false);
  }, [setIsDeleteCollectionModalOpen]);

  const handleCancelDeletePhoto = useCallback(() => {
    setIsDeletePhotoModalOpen(false);
  }, [setIsDeletePhotoModalOpen]);



  return (
    <SafeAreaView
      edges={SAFE_EDGES}
      style={[styles.container, !isDarkMode && styles.containerLight]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000000" : "#FFFFFF"}
      />

      <CollectionGalleryHeader
        collectionTitle={collectionTitle}
        photoCount={photos.length}
        isDarkMode={isDarkMode}
        onGoBack={() => navigation.goBack()}
        onOpenMenu={handleOpenMenu}
        menuButtonRef={menuButtonRef}
      />

      <CollectionPhotoGrid
        photos={photos}
        columns={columns}
        itemDimensions={itemDimensions}
        highlightPhotoIndex={highlightPhotoIndex}
        borderBlinkAnim={borderBlinkAnim}
        pinchRef={pinchRef}
        flatListRef={flatListRef}
        isPinching={isPinching}
        gridOpacity={gridOpacity}
        pinchScale={pinchScale}
        onPinchGesture={handlePinchGesture}
        onPinchStateChange={handlePinchStateChange}
        onSelectPhoto={handleSelectPhoto}
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
      />

      <GalleryMenuModal
        visible={isMenuOpen}
        onClose={handleCloseMenu}
        menuCoords={menuCoords}
        menuOpacity={menuOpacity}
        menuTranslateY={menuTranslateY}
        menuScale={menuScale}
        onAddPhotos={handleOpenAddPhotos}
        onEditCollection={handleOpenEditCollection}
        onDeleteCollection={handleOpenDeleteCollection}
        isDarkMode={isDarkMode}
      />

      <PhotoViewerModal
        visible={selectedPhotoIndex !== null}
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        activeViewerIndex={activeViewerIndex}
        onClose={handleCloseViewer}
        isPinchingViewer={isPinchingViewer}
        setIsPinchingViewer={setIsPinchingViewer}
        viewerFlatListRef={viewerFlatListRef}
        setActiveViewerIndex={setActiveViewerIndex}
        insets={insets}
        isDarkMode={isDarkMode}
      />

      <EditCaptionModal
        visible={isEditingCaption}
        captionText={captionText}
        onChangeCaptionText={(text) => {
          setCaptionText(text);
          if (captionErrors?.caption) {
            setCaptionErrors((prev) => ({ ...prev, caption: null }));
          }
        }}
        isInputFocused={isInputFocused}
        onFocusInput={() => setIsInputFocused(true)}
        onBlurInput={() => setIsInputFocused(false)}
        isSavingCaption={isSavingCaption}
        modalTranslateY={modalTranslateY}
        modalScale={modalScale}
        onClose={handleCloseEditCaption}
        onSave={handleSaveCaption}
        isDarkMode={isDarkMode}
        inputRef={captionInputRef}
        errors={captionErrors}
      />

      <EditCollectionModal
        visible={isEditCollectionModalOpen}
        onClose={handleCloseEditCollection}
        editCollectionTitle={editCollectionTitle}
        onChangeEditCollectionTitle={(text) => {
          setEditCollectionTitle(text);
          if (editCollectionErrors?.title) {
            setEditCollectionErrors((prev) => ({ ...prev, title: null }));
          }
        }}
        isEditTitleFocused={isEditTitleFocused}
        onFocusTitle={() => setIsEditTitleFocused(true)}
        onBlurTitle={() => setIsEditTitleFocused(false)}
        editablePhotos={editablePhotos}
        onRemovePhotoFromEditable={handleTogglePhotoDelete}
        isSavingEdit={isSavingEditCollection}
        onSave={handleSaveEditCollection}
        editModalTranslateY={editModalTranslateY}
        editModalScale={editModalScale}
        isDarkMode={isDarkMode}
        errors={editCollectionErrors}
      />

      <AddPhotosModal
        visible={isAddPhotosModalOpen}
        onClose={handleCloseAddPhotos}
        selectedNewPhotos={newPhotosToUpload}
        onPickNewPhotos={handlePickNewPhotos}
        onRemoveNewPhoto={handleRemoveNewPhoto}
        isAddingPhotos={isSavingNewPhotos}
        isPickingPhotos={isPickingPhotos}
        currentTheme={currentTheme}
        onSave={handleSaveNewPhotos}
        addPhotosModalScale={addPhotosModalScale}
        isDarkMode={isDarkMode}
        errors={addPhotosErrors}
      />

      <DeleteConfirmModal
        visible={isDeleteCollectionModalOpen}
        title="Excluir coleção?"
        message="Tem certeza de que deseja excluir esta coleção? Todas as fotos serão removidas permanentemente."
        isDeleting={isDeletingCollection}
        onConfirm={handleDeleteCollection}
        onCancel={handleCancelDeleteCollection}
        modalScale={deleteModalScale}
        isDarkMode={isDarkMode}
      />

      <DeleteConfirmModal
        visible={isDeletePhotoModalOpen}
        title="Excluir foto?"
        message="Tem certeza de que deseja excluir esta foto da coleção?"
        isDeleting={isDeletingPhoto}
        onConfirm={handleDeletePhoto}
        onCancel={handleCancelDeletePhoto}
        modalScale={deletePhotoModalScale}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
