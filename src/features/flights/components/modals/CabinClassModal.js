import React, { memo, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, { getSelectedBorder, getSelectedIconBg } from "../../styles/flightModals.styles";

function CabinClassModalComponent({
  visible,
  onClose,
  onSelectClass,
  cabinClassMap,
  selectedClass,
  currentTheme,
  isDarkMode,
}) {
  const data = useMemo(
    () => Object.keys(cabinClassMap).map((label) => ({ id: cabinClassMap[label], label })),
    [cabinClassMap]
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedClass === item.label;
    const itemBorder = isSelected ? getSelectedBorder(currentTheme.accent) : null;
    const iconBoxBg = isSelected ? getSelectedIconBg(currentTheme.accent) : null;

    return (
      <TouchableOpacity
        style={[
          styles.modalOptionItem,
          !isDarkMode && styles.modalOptionItemLight,
          isSelected && styles.modalOptionItemSelected,
          itemBorder,
        ]}
        onPress={() => {
          onSelectClass(item.label);
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.modalOptionLeft}>
          <View
            style={[
              styles.modalOptionIconBox,
              !isDarkMode && styles.modalOptionIconBoxLight,
              iconBoxBg,
            ]}
          >
            <Feather
              name="layers"
              size={16}
              color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
            />
          </View>
          <Text
            style={[
              styles.modalOptionText,
              !isDarkMode && styles.modalOptionTextLight,
              isSelected && styles.modalOptionTextSelected,
            ]}
          >
            {item.label}
          </Text>
        </View>
        {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && styles.modalSelectTitleLight]}>
              Classe do Voo
            </Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && styles.closeModalButtonTextLight]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export const CabinClassModal = memo(CabinClassModalComponent);
