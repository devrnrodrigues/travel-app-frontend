import React, { memo, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, { getSelectedBorder, getSelectedIconBg } from "../../styles/flightModals.styles";

function ChildAgeModalComponent({
  visible,
  onClose,
  childIndex,
  currentAge,
  onSelectAge,
  currentTheme,
  isDarkMode,
}) {
  const ages = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        age: i,
        label: i === 0 ? "Bebê (< 1 ano / colo)" : `${i} ${i === 1 ? "ano" : "anos"}`,
      })),
    []
  );

  const renderItem = ({ item }) => {
    const isSelected = currentAge === item.age;
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
          onSelectAge(item.age);
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
              name="user"
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
              Idade da Criança {childIndex + 1}
            </Text>
          </View>
          <FlatList
            data={ages}
            keyExtractor={(item) => String(item.age)}
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

export const ChildAgeModal = memo(ChildAgeModalComponent);
