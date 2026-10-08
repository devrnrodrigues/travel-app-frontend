import React, { memo } from "react";
import {
  Modal,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  styles,
  getMenuDropdownAnimatedStyle,
} from "../styles/collectionGallery.styles";

const GalleryMenuModal = memo(function GalleryMenuModal({
  visible,
  onClose,
  menuCoords,
  menuOpacity,
  menuTranslateY,
  menuScale,
  onAddPhotos,
  onEditCollection,
  onDeleteCollection,
  isDarkMode,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.menuBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.menuDropdown,
            !isDarkMode && styles.menuDropdownLight,
            getMenuDropdownAnimatedStyle(
              menuCoords.top,
              menuCoords.left,
              menuOpacity,
              menuTranslateY,
              menuScale
            ),
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onAddPhotos}
          >
            <Ionicons
              name="images-outline"
              size={16}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
              style={styles.menuItemIcon}
            />
            <Text
              style={[
                styles.menuItemText,
                !isDarkMode && styles.menuItemTextLight,
              ]}
            >
              Adicionar fotos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onEditCollection}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
              style={styles.menuItemIcon}
            />
            <Text
              style={[
                styles.menuItemText,
                !isDarkMode && styles.menuItemTextLight,
              ]}
            >
              Editar coleção
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onDeleteCollection}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#FF453A"
              style={styles.menuItemIcon}
            />
            <Text
              style={[
                styles.menuItemText,
                styles.menuItemTextDanger,
              ]}
            >
              Excluir coleção
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
});

export default GalleryMenuModal;
