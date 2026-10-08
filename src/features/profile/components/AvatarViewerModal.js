import React, { memo } from "react";
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  styles,
  getAvatarModalBadgeStyle,
} from "../styles/profile.styles";

const AvatarViewerModal = memo(function AvatarViewerModal({
  visible,
  avatarUrl,
  isUploading,
  accentColor,
  onClose,
  onPickAndUploadAvatar,
}) {
  const handleRequestClose = () => {
    if (!isUploading) {
      onClose();
    }
  };

  const avatarSource = avatarUrl ? { uri: avatarUrl } : null;
  const cameraIconColor = isUploading ? "rgba(255, 255, 255, 0.5)" : "#000000";

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
        <View style={styles.avatarModalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.avatarModalContent}>
              <View style={styles.avatarModalImageWrapper}>
                {avatarSource ? (
                  <Image
                    source={avatarSource}
                    style={styles.avatarModalImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarModalPlaceholder}>
                    <Ionicons name="person" size={120} color={accentColor} />
                  </View>
                )}
                {isUploading && (
                  <View style={styles.avatarUploadingOverlay}>
                    <ActivityIndicator size="large" color={accentColor} />
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={getAvatarModalBadgeStyle(isUploading, accentColor)}
                activeOpacity={0.8}
                disabled={isUploading}
                onPress={onPickAndUploadAvatar}
              >
                <Ionicons
                  name="camera"
                  size={22}
                  color={cameraIconColor}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default AvatarViewerModal;
