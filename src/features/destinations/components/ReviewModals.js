import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Animated,
  Easing,
  Keyboard,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import reviewStyles from "../styles/reviews.styles";

export function ReviewFormModal({
  visible,
  onClose,
  editingReviewId,
  initialPhotos = [],
  openedFromAvaliarBtn,
  selectedRating,
  setSelectedRating,
  inputComment,
  setInputComment,
  isSubmitting,
  onSubmit,
  currentTheme,
  isDarkMode,
}) {
  const [photosList, setPhotosList] = useState([]);
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const commentFocusAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;
  const modalTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (editingReviewId && Array.isArray(initialPhotos)) {
        setPhotosList(
          initialPhotos.map((p) => ({
            id: p.id,
            uri: p.url,
            isExisting: true,
          }))
        );
      } else {
        setPhotosList([]);
      }
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
    }
  }, [visible]);

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

  const handleCommentFocus = useCallback(() => {
    setIsCommentFocused(true);
    Animated.timing(commentFocusAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [commentFocusAnim]);

  const handleCommentBlur = useCallback(() => {
    setIsCommentFocused(false);
    Animated.timing(commentFocusAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [commentFocusAnim]);

  const handlePickImages = async () => {
    if (photosList.length >= 5) {
      Alert.alert("Limite atingido", "Você pode anexar no máximo 5 fotos.");
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para anexar fotos."
        );
        return;
      }

      const remaining = 5 - photosList.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newItems = result.assets.map((a) => ({
          uri: a.uri,
          isExisting: false,
        }));
        setPhotosList((prev) => [...prev, ...newItems].slice(0, 5));
      }
    } catch {
      Alert.alert("Erro", "Não foi possível selecionar as fotos.");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setPhotosList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={reviewStyles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />
        <Animated.View
          style={[
            reviewStyles.formCard,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
            {
              transform: [
                { translateY: modalTranslateY },
                { scale: modalScale },
              ],
            },
          ]}
        >
          <View style={[reviewStyles.modalHeader, { alignItems: "flex-start" }]}>
            <View style={reviewStyles.flex1MarginRight10}>
              <Text style={[reviewStyles.modalTitle, !isDarkMode && { color: "#000000" }]}>
                {editingReviewId ? "Editar Avaliação" : "Nova Avaliação"}
              </Text>
              {editingReviewId && openedFromAvaliarBtn && (
                <Text style={!isDarkMode ? reviewStyles.editedInfoTextLight : reviewStyles.editedInfoTextDark}>
                  * Você já avaliou esse destino.
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
              style={reviewStyles.marginTop2}
            >
              <Ionicons name="close-circle" size={24} color={!isDarkMode ? "#000000" : "rgba(255,255,255,0.6)"} />
            </TouchableOpacity>
          </View>

          <Text style={[reviewStyles.formLabel, !isDarkMode && { color: "#222222" }]}>Sua nota para este local:</Text>
          <View style={reviewStyles.starsRow}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => setSelectedRating(num)} style={reviewStyles.marginRight8}>
                <Ionicons
                  name={num <= selectedRating ? "star" : "star-outline"}
                  size={32}
                  color={currentTheme.accent}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View
            style={[
              reviewStyles.input,
              !isDarkMode && reviewStyles.inputLight,
              {
                height: 90,
                borderWidth: 1.5,
                borderColor: commentFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["transparent", currentTheme.accent],
                }),
                paddingHorizontal: 0,
                paddingVertical: 0,
              },
            ]}
          >
            <TextInput
              placeholder="Escreva sua experiência..."
              placeholderTextColor={!isDarkMode ? "rgba(0, 0, 0, 0.40)" : "#FFFFFF"}
              value={inputComment}
              onChangeText={setInputComment}
              multiline
              onFocus={handleCommentFocus}
              onBlur={handleCommentBlur}
              style={[reviewStyles.reviewModalTextInput, !isDarkMode && reviewStyles.reviewModalTextInputLight]}
            />
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePickImages}
            style={[
              reviewStyles.addImageButton,
              !isDarkMode && reviewStyles.addImageButtonLight,
            ]}
          >
            <Ionicons
              name="images-outline"
              size={18}
              color={currentTheme.accent}
            />
            <Text
              style={[
                reviewStyles.addImageButtonText,
                !isDarkMode && reviewStyles.addImageButtonTextLight,
              ]}
            >
              {photosList.length > 0
                ? `Fotos (${photosList.length}/5)`
                : "Adicionar fotos"}
            </Text>
          </TouchableOpacity>

          {photosList.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={reviewStyles.selectedImagesScroll}
              contentContainerStyle={reviewStyles.selectedImagesContent}
            >
              {photosList.map((item, index) => (
                <View key={(item.id || item.uri) + index} style={reviewStyles.selectedImageWrapper}>
                  <Image source={{ uri: item.uri }} style={reviewStyles.selectedImageThumbnail} />
                  <TouchableOpacity
                    style={reviewStyles.removeImageBadge}
                    onPress={() => handleRemoveImage(index)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="close" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              const keptPhotoIds = photosList.filter((p) => p.isExisting).map((p) => p.id);
              const newImages = photosList.filter((p) => !p.isExisting).map((p) => p.uri);
              onSubmit({
                keptPhotoIds,
                newImages,
                allPhotos: photosList,
                clearPhotos: keptPhotoIds.length === 0,
              });
            }}
            disabled={isSubmitting}
            style={[reviewStyles.submitBtn, { backgroundColor: currentTheme.accent }]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={[reviewStyles.submitBtnText, { color: "#FFFFFF" }]}>
                {editingReviewId ? "Salvar Alterações" : "Publicar"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function DeleteReviewModal({
  visible,
  onClose,
  onConfirm,
  isDeleting,
  isDarkMode,
}) {
  const modalScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      modalScale.setValue(0.92);
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={() => !isDeleting && onClose()}
    >
      <View style={reviewStyles.dialogOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => !isDeleting && onClose()}
        />
        <Animated.View
          style={[
            reviewStyles.dialogCard,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
            {
              transform: [{ scale: modalScale }],
            },
          ]}
        >
          <View style={reviewStyles.dialogContentSection}>
            <Text
              style={[
                reviewStyles.dialogTitle,
                { color: !isDarkMode ? "#000000" : "#FFFFFF" },
              ]}
            >
              Excluir comentário?
            </Text>
            <Text
              style={[
                reviewStyles.dialogMessage,
                { color: !isDarkMode ? "#555555" : "rgba(255, 255, 255, 0.85)" },
              ]}
            >
              Deseja realmente remover sua avaliação deste destino?
            </Text>
          </View>

          <TouchableOpacity
            style={[
              reviewStyles.dialogActionButton,
              { borderTopColor: !isDarkMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" },
            ]}
            onPress={onConfirm}
            disabled={isDeleting}
            activeOpacity={0.65}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Text style={reviewStyles.dialogDeleteText}>Excluir</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              reviewStyles.dialogActionButton,
              reviewStyles.dialogLastButton,
              { borderTopColor: !isDarkMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" },
            ]}
            onPress={onClose}
            disabled={isDeleting}
            activeOpacity={0.65}
          >
            <Text
              style={[
                reviewStyles.dialogCancelText,
                { color: !isDarkMode ? "#000000" : "#FFFFFF" },
              ]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
