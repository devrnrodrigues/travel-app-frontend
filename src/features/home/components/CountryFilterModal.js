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

export default function CountryFilterModal({
  visible,
  onClose,
  destinations = [],
  selectedCountry,
  onSelectCountry,
  currentTheme,
  isDarkMode,
}) {
  const countryModalSlideAnim = useRef(new Animated.Value(MODAL_DISMISS_OFFSET)).current;
  const isClosingModal = useRef(false);

  useEffect(() => {
    if (visible) {
      isClosingModal.current = false;
      countryModalSlideAnim.setValue(MODAL_DISMISS_OFFSET);
      Animated.spring(countryModalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, countryModalSlideAnim]);

  const handleCloseCountryModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;
    Animated.timing(countryModalSlideAnim, {
      toValue: MODAL_DISMISS_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  }, [countryModalSlideAnim, onClose]);

  const countryPanResponder = useRef(
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
          countryModalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseCountryModal();
        } else {
          Animated.spring(countryModalSlideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
      onRequestClose={handleCloseCountryModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseCountryModal}>
        <View style={countryModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                countryModalStyles.sheet,
                {
                  transform: [{ translateY: countryModalSlideAnim }],
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
              <View {...countryPanResponder.panHandlers} style={countryModalStyles.dragHandleArea}>
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
                      Filtrar por País
                    </Text>
                    <Text
                      style={[
                        countryModalStyles.subtitle,
                        !isDarkMode && { color: "rgba(0, 0, 0, 0.5)" },
                      ]}
                    >
                      Escolha um destino pelo mundo
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.countryListScroll}
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
                        handleCloseCountryModal();
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
                        {countryName === "Todos os países" ? (
                          <Text style={styles.flag18}>🌍</Text>
                        ) : (
                          isSelected && (
                            <Text style={styles.flag16}>📍</Text>
                          )
                        )}
                        <Text
                          style={[
                            countryModalStyles.countryName,
                            !isDarkMode && { color: "#000000" },
                            isSelected && { color: currentTheme.accent, fontWeight: "bold" },
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
}
