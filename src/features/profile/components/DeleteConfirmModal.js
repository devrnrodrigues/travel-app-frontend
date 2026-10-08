import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from "react-native";
import {
  styles,
  getModalScaleAnimatedStyle,
} from "../styles/collectionGallery.styles";

const DeleteConfirmModal = memo(function DeleteConfirmModal({
  visible,
  title,
  message,
  boldText,
  isDeleting,
  onConfirm,
  onCancel,
  modalScale,
  isDarkMode,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.confirmOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.confirmCard,
                !isDarkMode && styles.confirmCardLight,
                modalScale && getModalScaleAnimatedStyle(modalScale),
              ]}
            >
              <View style={styles.confirmContentSection}>
                <Text
                  style={[
                    styles.confirmTitle,
                    !isDarkMode && styles.confirmTitleLight,
                  ]}
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.confirmMessage,
                    !isDarkMode && styles.confirmMessageLight,
                  ]}
                >
                  {message}
                  {boldText ? (
                    <Text
                      style={[
                        styles.confirmBoldText,
                        !isDarkMode && styles.confirmBoldTextLight,
                      ]}
                    >
                      {boldText}
                    </Text>
                  ) : null}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmActionButton,
                  !isDarkMode && styles.confirmActionButtonLight,
                ]}
                onPress={onConfirm}
                disabled={isDeleting}
                activeOpacity={0.65}
              >
                {isDeleting ? (
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
                onPress={onCancel}
                disabled={isDeleting}
                activeOpacity={0.65}
              >
                <Text
                  style={[
                    styles.confirmCancelText,
                    !isDarkMode && styles.confirmCancelTextLight,
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default DeleteConfirmModal;
