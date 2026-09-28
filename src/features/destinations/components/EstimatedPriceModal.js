import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { SkeletonBox } from "../../../shared/components/Skeleton";

const { width } = Dimensions.get("window");

export const MOCK_ESTIMATED_PRICE = {
  currency: "BRL",
  basis: {
    hotel: "per_room_per_night",
    food: "per_person_per_day",
    activities: "per_person_per_day",
    transport: "per_person_per_day",
  },
  daily_total: {
    min: 250,
    max: 740,
    avg: 495,
  },
  breakdown: {
    hotel_per_room: {
      min: 150,
      max: 400,
      avg: 275,
    },
    food: {
      min: 80,
      max: 180,
      avg: 130,
    },
    activities: {
      min: 0,
      max: 100,
      avg: 50,
    },
    transport: {
      min: 20,
      max: 60,
      avg: 40,
    },
  },
  estimated_for: {
    year: 2026,
    season: "typical",
  },
};

const BREAKDOWN_CONFIG = [
  {
    key: "hotel_per_room",
    title: "Hospedagem",
  },
  {
    key: "food",
    title: "Alimentação",
  },
  {
    key: "activities",
    title: "Passeios",
  },
  {
    key: "transport",
    title: "Transporte local",
  },
];

export default function EstimatedPriceModal({
  visible,
  onClose,
  data = MOCK_ESTIMATED_PRICE,
  currentTheme,
  isDarkMode,
}) {
  const [modalRendered, setModalRendered] = useState(visible);
  const [loading, setLoading] = useState(true);
  const [showHotelInfo, setShowHotelInfo] = useState(false);
  const hotelInfoAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleHotelInfo = () => {
    if (!showHotelInfo) {
      setShowHotelInfo(true);
      Animated.timing(hotelInfoAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(hotelInfoAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        setShowHotelInfo(false);
      });
    }
  };

  useEffect(() => {
    if (visible) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      setModalRendered(true);
      setShowHotelInfo(false);
      hotelInfoAnim.setValue(0);
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalRendered) {
      setShowHotelInfo(false);
      hotelInfoAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalRendered(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    setShowHotelInfo(false);
    hotelInfoAnim.setValue(0);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalRendered(false);
      onClose();
    });
  };

  if (!modalRendered) return null;

  const accentColor = currentTheme?.accent || "#3B82F6";
  const seasonText =
    data.estimated_for?.season === "typical"
      ? "temporada típica"
      : data.estimated_for?.season || "temporada média";

  return (
    <Modal
      visible={modalRendered}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        />

        <Animated.View
          onStartShouldSetResponder={() => true}
          style={[
            styles.card,
            isDarkMode ? styles.cardDark : styles.cardLight,
            {
              zIndex: 1,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text
                style={[
                  styles.title,
                  isDarkMode ? styles.textLight : styles.textDark,
                ]}
              >
                Diária estimada
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isDarkMode ? styles.subtitleDark : styles.subtitleLight,
                ]}
              >
                Referência para {data.estimated_for?.year || 2026} em {seasonText}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather
                name="x"
                size={22}
                color={isDarkMode ? "#A1A1AA" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroSection}>
              <Text
                style={[
                  styles.heroLabel,
                  isDarkMode ? styles.subtitleDark : styles.subtitleLight,
                ]}
              >
                Faixa diária total
              </Text>
              {loading ? (
                <View style={{ marginVertical: 4 }}>
                  <SkeletonBox
                    width={150}
                    height={26}
                    borderRadius={6}
                    isDarkMode={isDarkMode}
                  />
                  <View style={{ marginTop: 8 }}>
                    <SkeletonBox
                      width={180}
                      height={14}
                      borderRadius={4}
                      isDarkMode={isDarkMode}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <Text
                    style={[
                      styles.heroValue,
                      isDarkMode ? styles.textLight : styles.textDark,
                    ]}
                  >
                    R$ {data.daily_total?.min} - {data.daily_total?.max}
                  </Text>
                  <View style={styles.avgRow}>
                    <View
                      style={[
                        styles.avgDot,
                        { backgroundColor: accentColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.avgText,
                        isDarkMode ? styles.subtitleDark : styles.subtitleLight,
                      ]}
                    >
                      Média diária de R$ {data.daily_total?.avg} por pessoa
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View
              style={[
                styles.separator,
                isDarkMode ? styles.separatorDark : styles.separatorLight,
              ]}
            />

            <Text
              style={[
                styles.sectionHeading,
                isDarkMode ? styles.textLight : styles.textDark,
              ]}
            >
              Composição diária
            </Text>

            <View style={styles.breakdownList}>
              {BREAKDOWN_CONFIG.map((item, index) => {
                const itemData = data.breakdown?.[item.key];
                if (!itemData) return null;
                const isLast = index === BREAKDOWN_CONFIG.length - 1;

                return (
                  <View
                    key={item.key}
                    style={[
                      styles.breakdownRowWrapper,
                      !isLast &&
                        (isDarkMode
                          ? styles.rowBorderDark
                          : styles.rowBorderLight),
                    ]}
                  >
                    <View style={styles.breakdownRow}>
                      {item.key === "hotel_per_room" ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={toggleHotelInfo}
                          style={styles.rowLeft}
                        >
                          <View style={styles.titleColumn}>
                            <View style={styles.titleWithInfoRow}>
                              <Text
                                style={[
                                  styles.rowTitle,
                                  isDarkMode ? styles.textLight : styles.textDark,
                                ]}
                              >
                                {item.title}
                              </Text>
                              <View style={styles.infoIconButton}>
                                <Feather
                                  name="info"
                                  size={14}
                                  color={
                                    showHotelInfo
                                      ? accentColor
                                      : isDarkMode
                                      ? "#71717A"
                                      : "#9CA3AF"
                                  }
                                />
                              </View>
                            </View>

                            {showHotelInfo && (
                              <Animated.View
                                style={[
                                  styles.hotelInfoContainer,
                                  {
                                    opacity: hotelInfoAnim,
                                    maxHeight: hotelInfoAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0, 24],
                                    }),
                                    transform: [
                                      {
                                        translateY: hotelInfoAnim.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [-2, 0],
                                        }),
                                      },
                                    ],
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.hotelInfoText,
                                    isDarkMode
                                      ? styles.subtitleDark
                                      : styles.subtitleLight,
                                  ]}
                                >
                                  Estimativa por quarto/noite.
                                </Text>
                              </Animated.View>
                            )}
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.rowLeft}>
                          <Text
                            style={[
                              styles.rowTitle,
                              isDarkMode ? styles.textLight : styles.textDark,
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                      )}

                      <View style={styles.rowRight}>
                        {loading ? (
                          <View style={{ alignItems: "flex-end" }}>
                            <SkeletonBox
                              width={95}
                              height={17}
                              borderRadius={4}
                              isDarkMode={isDarkMode}
                            />
                            <SkeletonBox
                              width={65}
                              height={12}
                              borderRadius={3}
                              isDarkMode={isDarkMode}
                              style={{ marginTop: 5 }}
                            />
                          </View>
                        ) : (
                          <>
                            <Text
                              style={[
                                styles.rowRange,
                                isDarkMode ? styles.textLight : styles.textDark,
                              ]}
                            >
                              R$ {itemData.min} - {itemData.max}
                            </Text>
                            <Text
                              style={[
                                styles.rowAvg,
                                isDarkMode
                                  ? styles.subtitleDark
                                  : styles.subtitleLight,
                              ]}
                            >
                              Média: R$ {itemData.avg}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View
              style={[
                styles.disclaimerContainer,
                isDarkMode
                  ? styles.disclaimerContainerDark
                  : styles.disclaimerContainerLight,
              ]}
            >
              <Text
                style={[
                  styles.disclaimerText,
                  isDarkMode ? styles.disclaimerDark : styles.disclaimerLight,
                ]}
              >
                * Valores estimados para planejamento. Os preços podem variar conforme época, localização, disponibilidade e perfil da viagem. Para consultar passagens aéreas, clique no ícone de passagens.
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "82%",
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  cardDark: {
    backgroundColor: "#000000",
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
  textLight: {
    color: "#FFFFFF",
  },
  textDark: {
    color: "#111827",
  },
  subtitleDark: {
    color: "#A1A1AA",
  },
  subtitleLight: {
    color: "#6B7280",
  },
  scrollContent: {
    paddingBottom: 4,
  },
  heroSection: {
    marginTop: 4,
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  avgDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  avgText: {
    fontSize: 13,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
  },
  separatorDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  separatorLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  breakdownList: {
    marginBottom: 14,
  },
  breakdownRowWrapper: {
    paddingVertical: 13,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: {
    justifyContent: "center",
  },
  titleWithInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIconButton: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  hotelInfoContainer: {
    marginTop: 2,
    overflow: "hidden",
  },
  hotelInfoText: {
    fontSize: 11,
    lineHeight: 15,
  },
  rowBorderDark: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  rowBorderLight: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
  },
  rowLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    textAlign: "left",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowRange: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  rowAvg: {
    fontSize: 12,
    marginTop: 2,
  },
  disclaimerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  disclaimerContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  disclaimerContainerLight: {
    backgroundColor: "#F4F4F5",
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  disclaimerDark: {
    color: "#A1A1AA",
  },
  disclaimerLight: {
    color: "#6B7280",
  },
});
