import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/flightResults.styles";

function FlightResultsFooterComponent({ cheapestTicket, formatPriceDisplay, isDarkMode }) {
  return (
    <View
      style={[
        styles.footerPriceRow,
        isDarkMode ? styles.footerPriceRowDark : styles.footerPriceRowLight,
      ]}
    >
      <View style={styles.priceContainer}>
        <Text
          style={[
            styles.priceLabel,
            isDarkMode ? styles.priceLabelDark : styles.priceLabelLight,
          ]}
        >
          Passagens a partir de
        </Text>
        {cheapestTicket?.price ? (
          <Text
            style={[
              styles.priceValue,
              isDarkMode ? styles.priceValueDark : styles.priceValueLight,
            ]}
          >
            {formatPriceDisplay(cheapestTicket.price, cheapestTicket.currency)}
          </Text>
        ) : (
          <Text
            style={[
              styles.priceValue,
              isDarkMode ? styles.priceValueDark : styles.priceValueLight,
            ]}
          >
            —
          </Text>
        )}
      </View>
    </View>
  );
}

export const FlightResultsFooter = memo(FlightResultsFooterComponent);
