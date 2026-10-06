import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/details.styles";
import { SkeletonBox } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";

function DestinationFooterComponent({
  footerPriceBg,
  insetsBottom = 0,
  isDarkMode,
  currentTheme,
  loadingPrice,
  costEstimates,
  onOpenPriceModal,
  onNavigateTicket,
}) {
  return (
    <Animated.View
      style={[
        styles.footerPriceRow,
        !isDarkMode ? styles.footerPriceRowLight : styles.footerPriceRowDark,
        {
          backgroundColor: footerPriceBg,
          paddingBottom: Math.max(insetsBottom + 12, 28),
        },
      ]}
    >
      <View style={styles.priceContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenPriceModal}
          style={styles.priceHelpTouchable}
        >
          <Text style={[styles.priceLabel, !isDarkMode && styles.priceLabelLight]}>
            Diária estimada
          </Text>
          <Feather
            name="help-circle"
            size={14}
            color={currentTheme?.accent || "#3B82F6"}
            style={styles.priceHelpIcon}
          />
        </TouchableOpacity>
        <FadeInView duration={200}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenPriceModal}
          >
            {loadingPrice ? (
              <View style={styles.priceSkeletonWrapper}>
                <SkeletonBox
                  width={130}
                  height={22}
                  borderRadius={6}
                  isDarkMode={isDarkMode}
                />
              </View>
            ) : (
              <Text style={[styles.priceValue, !isDarkMode && styles.priceValueLight]}>
                {costEstimates?.daily_total?.min != null && costEstimates?.daily_total?.max != null
                  ? `R$ ${costEstimates.daily_total.min} - ${costEstimates.daily_total.max}`
                  : "R$ ???? - ????"}
              </Text>
            )}
          </TouchableOpacity>
        </FadeInView>
      </View>
      <TouchableOpacity
        style={[
          styles.actionButton,
          !isDarkMode
            ? styles.actionButtonLight
            : { backgroundColor: currentTheme.accent },
        ]}
        activeOpacity={0.8}
        onPress={onNavigateTicket}
      >
        <Image
          source={require("../../../../assets/airplane-ticket.webp")}
          style={[
            styles.actionButtonIcon,
            !isDarkMode ? styles.actionButtonIconLight : styles.actionButtonIconDark,
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export const DestinationFooter = memo(DestinationFooterComponent);
export default DestinationFooter;
