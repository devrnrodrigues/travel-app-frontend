import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  filterModalStyles,
  getActiveItemBorderStyle,
  getActiveItemTextStyle,
  getModalTranslateStyle,
} from "../styles/filterModal.styles";
import useFilterModalSwipe from "../hooks/useFilterModalSwipe";

const CategoryFilterModal = React.memo(function CategoryFilterModal({
  visible,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  currentTheme,
  isDarkMode,
}) {
  const { slideAnim, panResponder, handleCloseModal } = useFilterModalSwipe(visible, onClose);

  const orderedCategories = useMemo(() => {
    const allOption = { key: null, name: "Todas as categorias" };
    if (!categories || categories.length === 0) {
      return [allOption];
    }

    const normalizedSelected = selectedCategory ? String(selectedCategory).toLowerCase() : null;
    let activeItem = null;
    const others = [];

    for (const cat of categories) {
      const catKey = cat?.slug || cat?.name || String(cat);
      const catName = cat?.name || cat?.title || catKey;
      const itemObj = { key: catKey, name: catName };

      if (
        normalizedSelected &&
        (catKey.toLowerCase() === normalizedSelected || catName.toLowerCase() === normalizedSelected)
      ) {
        activeItem = itemObj;
      } else {
        others.push(itemObj);
      }
    }

    if (activeItem) {
      return [activeItem, allOption, ...others];
    }

    return [allOption, ...others];
  }, [categories, selectedCategory]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={filterModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                filterModalStyles.sheet,
                isDarkMode ? filterModalStyles.sheetDark : filterModalStyles.sheetLight,
                getModalTranslateStyle(slideAnim),
              ]}
            >
              <View {...panResponder.panHandlers} style={filterModalStyles.dragHandleArea}>
                <View
                  style={[
                    filterModalStyles.indicator,
                    isDarkMode ? filterModalStyles.indicatorDark : filterModalStyles.indicatorLight,
                  ]}
                />
                <View style={filterModalStyles.header}>
                  <View>
                    <Text
                      style={[
                        filterModalStyles.title,
                        isDarkMode ? filterModalStyles.titleDark : filterModalStyles.titleLight,
                      ]}
                    >
                      Filtrar por Categoria
                    </Text>
                    <Text
                      style={[
                        filterModalStyles.subtitle,
                        isDarkMode ? filterModalStyles.subtitleDark : filterModalStyles.subtitleLight,
                      ]}
                    >
                      Selecione o tipo de experiência que busca
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={filterModalStyles.countryListScroll}
              >
                {orderedCategories.map((item) => {
                  const isSelected =
                    (!selectedCategory && item.key === null) ||
                    (selectedCategory &&
                      item.key &&
                      String(selectedCategory).toLowerCase() === String(item.key).toLowerCase());

                  return (
                    <TouchableOpacity
                      key={item.key || "all-categories"}
                      onPress={() => {
                        onSelectCategory(item.key);
                        handleCloseModal();
                      }}
                      activeOpacity={0.7}
                      style={[
                        filterModalStyles.countryItem,
                        isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
                        isSelected && [
                          isDarkMode ? filterModalStyles.countryItemActiveDark : filterModalStyles.countryItemActiveLight,
                          getActiveItemBorderStyle(currentTheme.accent),
                        ],
                      ]}
                    >
                      <View style={filterModalStyles.rowCenter}>
                        <Feather
                          name={item.key === null ? "compass" : "grid"}
                          size={16}
                          color={isSelected ? currentTheme.accent : !isDarkMode ? "#000000" : "#FFFFFF"}
                          style={filterModalStyles.marginRight6}
                        />
                        <Text
                          style={[
                            filterModalStyles.countryName,
                            isDarkMode ? filterModalStyles.countryNameDark : filterModalStyles.countryNameLight,
                            isSelected && [
                              filterModalStyles.countryNameActive,
                              getActiveItemTextStyle(currentTheme.accent),
                            ],
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <Feather name="check" size={18} color={currentTheme.accent} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default CategoryFilterModal;
