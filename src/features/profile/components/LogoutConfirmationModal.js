import React, { memo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import dialogStyles from "../styles/dialog.styles";

const LogoutConfirmationModal = memo(function LogoutConfirmationModal({
  visible,
  isLoggingOut,
  isDarkMode,
  onConfirm,
  onCancel,
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
        <View style={dialogStyles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                dialogStyles.dialogCard,
                !isDarkMode && dialogStyles.dialogCardLight,
              ]}
            >
              <View style={dialogStyles.contentSection}>
                <Text
                  style={[
                    dialogStyles.title,
                    !isDarkMode && dialogStyles.titleLight,
                  ]}
                >
                  Sair da conta?
                </Text>
                <Text
                  style={[
                    dialogStyles.message,
                    !isDarkMode && dialogStyles.messageLight,
                  ]}
                >
                  Tem certeza de que deseja sair? Você precisará fazer login
                  novamente para acessar seus dados.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  dialogStyles.actionButton,
                  !isDarkMode && dialogStyles.actionButtonLight,
                ]}
                onPress={onConfirm}
                disabled={isLoggingOut}
                activeOpacity={0.65}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Text style={dialogStyles.deleteText}>Sair</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  dialogStyles.actionButton,
                  dialogStyles.lastButton,
                  !isDarkMode && dialogStyles.actionButtonLight,
                ]}
                onPress={onCancel}
                disabled={isLoggingOut}
                activeOpacity={0.65}
              >
                <Text
                  style={[
                    dialogStyles.cancelText,
                    !isDarkMode && dialogStyles.cancelTextLight,
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

export default LogoutConfirmationModal;
