import React, { memo } from "react";
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
}) {
  const isBusy = isCreatingCollection || isPickingPhotos;

  const handleRequestClose = () => {
    if (!isBusy) {
      onClose();
    }
  };

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
      <TouchableWithoutFeedback onPress={handleRequestClose}>
        <View style={styles.addCollectionModalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalAvoidingView}
          >
            <TouchableWithoutFeedback>
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
                  isFocused={isCollectionNameFocused}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  maxLength={30}
                  style={styles.collectionNameInputSpacing}
                  placeholder="Ex: viagem para europa, praias..."
                  placeholderTextColor={
                    !isDarkMode
                      ? "rgba(0, 0, 0, 0.40)"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  onFocus={() => setIsCollectionNameFocused(true)}
                  onBlur={() => setIsCollectionNameFocused(false)}
                />

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
                          ? "Toque para adicionar mais fotos"
                          : "Toque para escolher fotos do dispositivo"}
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
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default AddCollectionModal;
