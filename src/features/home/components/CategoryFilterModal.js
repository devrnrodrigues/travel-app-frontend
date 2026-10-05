import React, { useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
  Easing,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import styles, { countryModalStyles } from "../home.styles";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Math.max(
  WINDOW_HEIGHT,
  Dimensions.get("screen").height || 0,
  900
);
const MODAL_DISMISS_OFFSET = SCREEN_HEIGHT + 50;

export default function CategoryFilterModal({
  visible,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  currentTheme,
  isDarkMode,
}) {
  const categoryModalSlideAnim = useRef(new Animated.Value(MODAL_DISMISS_OFFSET)).current;
  const isClosingModal = useRef(false);

  useEffect(() => {
    if (visible) {
      isClosingModal.current = false;
      categoryModalSlideAnim.setValue(MODAL_DISMISS_OFFSET);
      Animated.spring(categoryModalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, categoryModalSlideAnim]);

  const handleCloseCategoryModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;
    Animated.timing(categoryModalSlideAnim, {
      toValue: MODAL_DISMISS_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  }, [categoryModalSlideAnim, onClose]);

  const categoryPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          categoryModalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseCategoryModal();
        } else {
          Animated.spring(categoryModalSlideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
      onRequestClose={handleCloseCategoryModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseCategoryModal}>
        <View style={countryModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                countryModalStyles.sheet,
                {
                  transform: [{ translateY: categoryModalSlideAnim }],
                },
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
              <View {...categoryPanResponder.panHandlers} style={countryModalStyles.dragHandleArea}>
                <View
                  style={[
                    countryModalStyles.indicator,
                    !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                  ]}
                />
                <View style={countryModalStyles.header}>
                  <View>
                    <Text
                      style={[
                        countryModalStyles.title,
                        !isDarkMode && { color: "#000000" },
                      ]}
                    >
                      Filtrar por Categoria
                    </Text>
                    <Text
                      style={[
                        countryModalStyles.subtitle,
                        !isDarkMode && { color: "rgba(0, 0, 0, 0.5)" },
                      ]}
                    >
                      Selecione o tipo de experiência que busca
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.countryListScroll}
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
                        handleCloseCategoryModal();
                      }}
                      activeOpacity={0.7}
                      style={[
                        countryModalStyles.countryItem,
                        !isDarkMode && { backgroundColor: "#F7F7F9" },
                        isSelected && [
                          styles.countryItemActive,
                          !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.06)" },
                          { borderColor: currentTheme.accent },
                        ],
                      ]}
                    >
                      <View style={styles.rowCenter}>
                        <Feather
                          name={item.key === null ? "compass" : "grid"}
                          size={16}
                          color={isSelected ? currentTheme.accent : !isDarkMode ? "#000" : "#FFF"}
                          style={styles.marginRight6}
                        />
                        <Text
                          style={[
                            countryModalStyles.countryName,
                            !isDarkMode && { color: "#000000" },
                            isSelected && { color: currentTheme.accent, fontWeight: "bold" },
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
}
