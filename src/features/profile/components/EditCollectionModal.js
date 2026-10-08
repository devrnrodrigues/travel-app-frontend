import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Image,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  styles,
  getModalTranslateYScaleAnimatedStyle,
} from "../styles/collectionGallery.styles";

const EditCollectionModal = memo(function EditCollectionModal({
  visible,
  onClose,
  editCollectionTitle,
  onChangeEditCollectionTitle,
  isEditTitleFocused,
  onFocusTitle,
  onBlurTitle,
  editablePhotos,
  onRemovePhotoFromEditable,
  isSavingEdit,
  onSave,
  editModalTranslateY,
  editModalScale,
  isDarkMode,
}) {
  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.editDialogOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.collectionModalCard,
            !isDarkMode && styles.collectionModalCardLight,
            getModalTranslateYScaleAnimatedStyle(
              editModalTranslateY,
              editModalScale
            ),
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
            onChangeText={onChangeEditCollectionTitle}
            placeholder="Ex: viagem para europa, praias..."
            placeholderTextColor="#8E8E93"
            onFocus={onFocusTitle}
            onBlur={onBlurTitle}
            style={[
              styles.editDialogInput,
              !isDarkMode && styles.editDialogInputLight,
              isEditTitleFocused &&
                (isDarkMode
                  ? styles.editDialogInputFocused
                  : styles.editDialogInputFocusedLight),
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
                styles.sectionLabelNoMargin,
              ]}
            >
              Fotos da coleção
            </Text>
            <Text style={styles.editPhotosCountText}>
              {editablePhotos.length} foto
              {editablePhotos.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {editablePhotos.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.editPhotosScrollContent}
            >
              {editablePhotos.map((photo, pIdx) => (
                <View
                  key={photo.id || pIdx}
                  style={styles.editPhotoThumbnailWrapper}
                >
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
                    onPress={() => onRemovePhotoFromEditable(photo.id)}
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
              onPress={handleClose}
              activeOpacity={0.7}
              disabled={isSavingEdit}
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
              onPress={onSave}
              activeOpacity={0.8}
              disabled={isSavingEdit}
            >
              {isSavingEdit ? (
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? "#000000" : "#FFFFFF"}
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
  );
});

export default EditCollectionModal;
