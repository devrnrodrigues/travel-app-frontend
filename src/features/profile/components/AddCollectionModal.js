import React, { memo, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedProfileInput from "./AnimatedProfileInput";
import {
  styles,
  getAddCollectionPhotoBoxDynamicStyle,
  getAddCollectionSaveBtnDynamicStyle,
} from "../styles/profile.styles";

const HIT_SLOP_6 = { top: 6, bottom: 6, left: 6, right: 6 };

const AddCollectionModal = memo(function AddCollectionModal({
  visible,
  onClose,
  isDarkMode,
  currentTheme,
  newCollectionName,
  setNewCollectionName,
  isCollectionNameFocused,
  setIsCollectionNameFocused,
  selectedCollectionPhotos,
  isPickingPhotos,
  isCreatingCollection,
  onPickPhotos,
  onRemovePhoto,
  onSaveCollection,
  formErrors,
  setFormErrors,
}) {
  const [internalFocused, setInternalFocused] = useState(false);
  const isInputFocused =
    isCollectionNameFocused !== undefined
      ? isCollectionNameFocused
      : internalFocused;

  const handleInputFocus = useCallback(() => {
    if (typeof setIsCollectionNameFocused === "function") {
      setIsCollectionNameFocused(true);
    } else {
      setInternalFocused(true);
    }
  }, [setIsCollectionNameFocused]);

  const handleInputBlur = useCallback(() => {
    if (typeof setIsCollectionNameFocused === "function") {
      setIsCollectionNameFocused(false);
    } else {
      setInternalFocused(false);
    }
  }, [setIsCollectionNameFocused]);

  const isBusy = isCreatingCollection || isPickingPhotos;

  const handleRequestClose = () => {
    if (!isBusy) {
      onClose();
    }
  };

  const handleNameChange = useCallback(
    (text) => {
      setNewCollectionName(text);
      if (formErrors?.title && typeof setFormErrors === "function") {
        setFormErrors((prev) => ({ ...prev, title: null }));
      }
    },
    [setNewCollectionName, formErrors, setFormErrors]
  );

  const hasPhotos = selectedCollectionPhotos.length > 0;
  const photoCountText = `${selectedCollectionPhotos.length} foto${
    selectedCollectionPhotos.length > 1 ? "s" : ""
  } selecionada${selectedCollectionPhotos.length > 1 ? "s" : ""}`;

  const iconCircleBg = {
    backgroundColor: `${currentTheme.accent}22`,
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleRequestClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.addCollectionModalOverlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleRequestClose}
        />
        <View
          style={[
            styles.addCollectionModalCard,
            !isDarkMode && styles.addCollectionModalCardLight,
          ]}
        >
                <View style={styles.addCollectionModalHeader}>
                  <Text
                    style={[
                      styles.addCollectionModalTitle,
                      !isDarkMode && styles.addCollectionModalTitleLight,
                    ]}
                  >
                    Adicionar coleção
                  </Text>
                </View>

                <Text
                  style={[
                    styles.addCollectionSectionTitle,
                    !isDarkMode && styles.addCollectionSectionTitleLight,
                    styles.sectionTitleMargin,
                  ]}
                >
                  Nome
                </Text>
                <AnimatedProfileInput
                  isFocused={isInputFocused}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  maxLength={30}
                  charCount={newCollectionName.length}
                  style={styles.collectionNameInputSpacing}
                  placeholder="Título da coleção"
                  placeholderTextColor={
                    !isDarkMode
                      ? "rgba(0, 0, 0, 0.40)"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                  value={newCollectionName}
                  onChangeText={handleNameChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  hasError={!!formErrors?.title}
                />
                {formErrors?.title && (
                  <Text style={styles.modalFieldErrorText}>{formErrors.title}</Text>
                )}

                <Text
                  style={[
                    styles.addCollectionSectionTitle,
                    !isDarkMode && styles.addCollectionSectionTitleLight,
                    styles.photosSectionTitleMargin,
                  ]}
                >
                  Fotos
                </Text>
                <TouchableOpacity
                  style={getAddCollectionPhotoBoxDynamicStyle(
                    hasPhotos,
                    isDarkMode
                  )}
                  activeOpacity={0.75}
                  disabled={isBusy}
                  onPress={onPickPhotos}
                >
                  {isPickingPhotos ? (
                    <View style={styles.pickingPhotosWrapper}>
                      <ActivityIndicator
                        size="small"
                        color={currentTheme.accent}
                        style={styles.pickingPhotosIndicator}
                      />
                      <Text
                        style={[
                          styles.addCollectionPhotoTitle,
                          !isDarkMode && styles.addCollectionPhotoTitleLight,
                        ]}
                      >
                        Processando fotos...
                      </Text>
                    </View>
                  ) : (
                    <>
                      {!hasPhotos && (
                        <View
                          style={[
                            styles.addCollectionPhotoIconCircle,
                            iconCircleBg,
                          ]}
                        >
                          <Ionicons
                            name="cloud-upload-outline"
                            size={26}
                            color={currentTheme.accent}
                          />
                        </View>
                      )}
                      <Text
                        style={[
                          styles.addCollectionPhotoTitle,
                          !isDarkMode && styles.addCollectionPhotoTitleLight,
                        ]}
                      >
                        {hasPhotos ? photoCountText : "Inserir fotos"}
                      </Text>
                      <Text
                        style={[
                          styles.addCollectionPhotoSubtitle,
                          !isDarkMode && styles.addCollectionPhotoSubtitleLight,
                        ]}
                      >
                        {hasPhotos
                          ? selectedCollectionPhotos.length >= 10
                            ? "Limite de 10 fotos atingido"
                            : "Toque para adicionar mais fotos (máx. 10)"
                          : "Toque para escolher até 10 fotos"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {hasPhotos && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.selectedCollectionImagesScroll}
                    contentContainerStyle={
                      styles.selectedCollectionImagesContent
                    }
                  >
                    {selectedCollectionPhotos.map((uri, index) => (
                      <View
                        key={`${uri}_${index}`}
                        style={styles.selectedCollectionImageWrapper}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.selectedCollectionImageThumbnail}
                        />
                        <TouchableOpacity
                          style={styles.removeCollectionImageBadge}
                          onPress={() => onRemovePhoto(index)}
                          activeOpacity={0.7}
                          hitSlop={HIT_SLOP_6}
                        >
                          <Ionicons name="close" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {formErrors?.submit && (
                  <Text style={styles.modalFieldErrorText}>{formErrors.submit}</Text>
                )}

                <View style={styles.addCollectionModalActions}>
                  <TouchableOpacity
                    style={[
                      styles.addCollectionCancelBtn,
                      !isDarkMode && styles.addCollectionCancelBtnLight,
                    ]}
                    activeOpacity={0.7}
                    disabled={isBusy}
                    onPress={handleRequestClose}
                  >
                    <Text
                      style={[
                        styles.addCollectionCancelText,
                        !isDarkMode && styles.addCollectionCancelTextLight,
                      ]}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={getAddCollectionSaveBtnDynamicStyle(
                      currentTheme.accent,
                      isBusy
                    )}
                    activeOpacity={0.8}
                    disabled={isBusy}
                    onPress={onSaveCollection}
                  >
                    {isCreatingCollection ? (
                      <ActivityIndicator size="small" color="#000000" />
                    ) : (
                      <Text style={styles.addCollectionSaveText}>Salvar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
  );
});

export default AddCollectionModal;
