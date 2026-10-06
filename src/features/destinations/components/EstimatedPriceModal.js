import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SkeletonBox } from "../../../shared/components/Skeleton";
import styles from "../styles/estimatedPriceModal.styles";
import useEstimatedPriceModal, {
  BREAKDOWN_CONFIG,
} from "../hooks/useEstimatedPriceModal";

export default function EstimatedPriceModal({
  visible,
  onClose,
  data = null,
  loading = false,
  currentTheme,
  isDarkMode,
}) {
  const {
    modalRendered,
    showHotelInfo,
    hotelInfoAnim,
    scaleAnim,
    opacityAnim,
    toggleHotelInfo,
    handleClose,
    accentColor,
    seasonText,
  } = useEstimatedPriceModal({
    visible,
    onClose,
    data,
    currentTheme,
  });

  if (!modalRendered) return null;

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
                Referência para {data?.estimated_for?.year || 2026} em {seasonText}
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
                <View style={styles.skeletonWrapper}>
                  <SkeletonBox
                    width={150}
                    height={26}
                    borderRadius={6}
                    isDarkMode={isDarkMode}
                  />
                  <View style={styles.skeletonSpacing}>
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
                    {data?.daily_total?.min != null && data?.daily_total?.max != null
                      ? `R$ ${data?.daily_total?.min} - ${data?.daily_total?.max}`
                      : "R$ ???? - ????"}
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
                      {data?.daily_total?.avg != null
                        ? `Média diária de R$ ${data?.daily_total?.avg} por pessoa`
                        : "Média diária de R$ ???? por pessoa"}
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
                const itemData = data?.breakdown?.[item.key];
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
                          <View style={styles.alignEnd}>
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
                              style={styles.skeletonSmallSpacing}
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
                              {itemData?.min != null && itemData?.max != null
                                ? `R$ ${itemData?.min} - ${itemData?.max}`
                                : "R$ ???? - ????"}
                            </Text>
                            <Text
                              style={[
                                styles.rowAvg,
                                isDarkMode
                                  ? styles.subtitleDark
                                  : styles.subtitleLight,
                              ]}
                            >
                              {itemData?.avg != null
                                ? `Média: R$ ${itemData?.avg}`
                                : "Média: R$ ????"}
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
