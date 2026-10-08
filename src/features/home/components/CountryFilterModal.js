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

const POPULAR_COUNTRIES = [
  "Todos os países",
  "Brasil",
  "Estados Unidos",
  "França",
  "Itália",
  "Japão",
  "Espanha",
  "Grécia",
  "Tailândia",
  "Portugal",
  "Suíça",
  "Argentina",
  "Indonésia",
  "Egito",
  "Reino Unido",
  "Canadá",
];

const CountryFilterModal = React.memo(function CountryFilterModal({
  visible,
  onClose,
  destinations = [],
  selectedCountry,
  onSelectCountry,
  currentTheme,
  isDarkMode,
}) {
  const { slideAnim, panResponder, handleCloseModal } = useFilterModalSwipe(visible, onClose);

  const countriesList = useMemo(() => {
    const list = [...POPULAR_COUNTRIES];
    const existing = new Set(list.map((c) => c.toLowerCase()));
    for (const d of destinations) {
      if (d.location) {
        const parts = d.location.split(",");
        const lastPart = parts[parts.length - 1]?.trim();
        if (lastPart && !existing.has(lastPart.toLowerCase())) {
          existing.add(lastPart.toLowerCase());
          list.push(lastPart);
        }
      }
    }
    return list;
  }, [destinations]);

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
                      Filtrar por País
                    </Text>
                    <Text
                      style={[
                        filterModalStyles.subtitle,
                        isDarkMode ? filterModalStyles.subtitleDark : filterModalStyles.subtitleLight,
                      ]}
                    >
                      Escolha um destino pelo mundo
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={filterModalStyles.countryListScroll}
              >
                {countriesList.map((countryName) => {
                  const isSelected =
                    (!selectedCountry && countryName === "Todos os países") ||
                    selectedCountry === countryName;
                  return (
                    <TouchableOpacity
                      key={countryName}
                      onPress={() => {
                        if (countryName === "Todos os países") {
                          onSelectCountry(null);
                        } else {
                          onSelectCountry(countryName);
                        }
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
                        {countryName === "Todos os países" ? (
                          <Text style={filterModalStyles.flag18}>🌍</Text>
                        ) : (
                          isSelected && (
                            <Text style={filterModalStyles.flag16}>📍</Text>
                          )
                        )}
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
                          {countryName}
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

export default CountryFilterModal;
