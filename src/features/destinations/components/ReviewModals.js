import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import reviewStyles from "../styles/reviews.styles";

export function ReviewFormModal({
  visible,
  onClose,
  editingReviewId,
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
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const commentFocusAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={reviewStyles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
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
                <TouchableOpacity onPress={onClose} style={reviewStyles.marginTop2}>
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
                  Adicionar fotos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSubmit}
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={() => !isDeleting && onClose()}
    >
      <TouchableWithoutFeedback onPress={() => !isDeleting && onClose()}>
        <View style={reviewStyles.dialogOverlay}>
          <TouchableWithoutFeedback>
            <View
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
