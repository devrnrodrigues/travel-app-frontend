import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styles from "../styles/favoriteDeleteModal.styles";

export const FavoriteDeleteModal = React.memo(function FavoriteDeleteModal({
  itemToDelete,
  isDeleting,
  lastItemTitleRef,
  isDarkMode,
  confirmDelete,
  cancelDelete,
}) {
  const visible = !!itemToDelete;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={cancelDelete}
    >
      <TouchableWithoutFeedback onPress={cancelDelete}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialogCard,
                !isDarkMode && styles.dialogCardLight,
              ]}
            >
              <View style={styles.contentSection}>
                <Text
                  style={[
                    styles.title,
                    !isDarkMode && styles.titleLight,
                  ]}
                >
                  Remover dos favoritos?
                </Text>
                <Text
                  style={[
                    styles.message,
                    !isDarkMode && styles.messageLight,
                  ]}
                >
                  Deseja remover "
                  {itemToDelete?.title || lastItemTitleRef?.current}
                  " da sua lista de destinos salvos?
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !isDarkMode && styles.actionButtonLight,
                ]}
                onPress={confirmDelete}
                disabled={isDeleting}
                activeOpacity={0.65}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Text style={styles.deleteText}>Excluir</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.lastButton,
                  !isDarkMode && styles.actionButtonLight,
                ]}
                onPress={cancelDelete}
                disabled={isDeleting}
                activeOpacity={0.65}
              >
                <Text
                  style={[
                    styles.cancelText,
                    !isDarkMode && styles.cancelTextLight,
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
});

export default FavoriteDeleteModal;
