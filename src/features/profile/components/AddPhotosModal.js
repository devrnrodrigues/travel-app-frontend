import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  styles,
  getModalScaleAnimatedStyle,
} from "../styles/collectionGallery.styles";

const AddPhotosModal = memo(function AddPhotosModal({
  visible,
  onClose,
  selectedNewPhotos,
  onPickNewPhotos,
  onRemoveNewPhoto,
  isAddingPhotos,
  onSave,
  addPhotosModalScale,
  isDarkMode,
}) {
  const photoCountText = `${selectedNewPhotos.length} foto${
    selectedNewPhotos.length !== 1 ? "s" : ""
  } selecionada${selectedNewPhotos.length !== 1 ? "s" : ""}`;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.editDialogOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.collectionModalCard,
            !isDarkMode && styles.collectionModalCardLight,
            getModalScaleAnimatedStyle(addPhotosModalScale),
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
            onPress={onPickNewPhotos}
            disabled={isAddingPhotos}
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
                ? photoCountText
                : "Toque para escolher fotos do dispositivo"}
            </Text>
          </TouchableOpacity>

          {selectedNewPhotos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.editPhotosScrollContent,
                styles.scrollContentMarginTop10,
              ]}
            >
              {selectedNewPhotos.map((uri, idx) => (
                <View
                  key={`${uri}_${idx}`}
                  style={styles.editPhotoThumbnailWrapper}
                >
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
                    onPress={() => onRemoveNewPhoto(idx)}
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
              onPress={onClose}
              activeOpacity={0.7}
              disabled={isAddingPhotos}
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
              disabled={isAddingPhotos || selectedNewPhotos.length === 0}
              onPress={onSave}
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
  );
});

export default AddPhotosModal;
