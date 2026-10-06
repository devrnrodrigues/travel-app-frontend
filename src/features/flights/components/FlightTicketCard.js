import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles, {
  getTicketCardBorder,
  getSelectButtonDarkStyle,
  getSelectButtonTextDarkStyle,
} from "../styles/flightTicketCard.styles";

function FlightTicketCardComponent({
  ticket,
  index,
  isSelected,
  currentTheme,
  isDarkMode,
  onSelectTicket,
  sanitizeBaggage,
  formatPriceDisplay,
}) {
  const cardBorder = isSelected
    ? [styles.ticketCardSelected, getTicketCardBorder(currentTheme.accent)]
    : null;

  return (
    <View
      style={[
        styles.ticketCard,
        isDarkMode ? styles.ticketCardDark : styles.ticketCardLight,
        cardBorder,
      ]}
    >
      <View style={styles.companyRow}>
        <View style={styles.companyInfo}>
          {ticket.logo ? (
            <Image source={{ uri: ticket.logo }} style={styles.companyLogo} />
          ) : (
            <Ionicons
              name="airplane"
              size={18}
              color={currentTheme.accent}
              style={styles.fallbackAirplaneIcon}
            />
          )}
          {ticket.company ? (
            <Text
              style={[
                styles.companyName,
                isDarkMode ? styles.companyNameDark : styles.companyNameLight,
              ]}
            >
              {ticket.company}
            </Text>
          ) : null}
        </View>
        <Text
          style={[
            styles.stopsBadge,
            isDarkMode ? styles.stopsBadgeDark : styles.stopsBadgeLight,
          ]}
        >
          {ticket.stops}
        </Text>
      </View>

      <View style={styles.flightRoute}>
        <View style={styles.flightInfo}>
          {ticket.departureTime ? (
            <Text
              style={[
                styles.flightTime,
                isDarkMode ? styles.flightTimeDark : styles.flightTimeLight,
              ]}
            >
              {ticket.departureTime}
            </Text>
          ) : null}
          <Text
            style={[
              styles.flightLabel,
              isDarkMode ? styles.flightLabelDark : styles.flightLabelLight,
            ]}
          >
            Ida
          </Text>
        </View>
        <View style={styles.routeLineContainer}>
          {ticket.duration ? (
            <Text
              style={[
                styles.durationText,
                isDarkMode ? styles.durationTextDark : styles.durationTextLight,
              ]}
            >
              {ticket.duration}
            </Text>
          ) : null}
          <View
            style={[
              styles.routeLine,
              isDarkMode ? styles.routeLineDark : styles.routeLineLight,
            ]}
          />
        </View>
        <View style={styles.flightInfoEnd}>
          {ticket.arrivalTime ? (
            <Text
              style={[
                styles.flightTime,
                isDarkMode ? styles.flightTimeDark : styles.flightTimeLight,
              ]}
            >
              {ticket.arrivalTime}
            </Text>
          ) : null}
          <Text
            style={[
              styles.flightLabel,
              isDarkMode ? styles.flightLabelDark : styles.flightLabelLight,
            ]}
          >
            Chegada
          </Text>
        </View>
      </View>

      {ticket.hasReturn && ticket.returnDepartureTime ? (
        <View
          style={[
            styles.flightReturnRow,
            isDarkMode ? styles.flightReturnRowDark : styles.flightReturnRowLight,
          ]}
        >
          <View style={styles.flightInfo}>
            <Text
              style={[
                styles.flightTime,
                isDarkMode ? styles.flightTimeDark : styles.flightTimeLight,
              ]}
            >
              {ticket.returnDepartureTime}
            </Text>
            <Text
              style={[
                styles.flightLabel,
                isDarkMode ? styles.flightLabelDark : styles.flightLabelLight,
              ]}
            >
              Volta
            </Text>
          </View>
          <View style={styles.routeLineContainer}>
            {ticket.returnDuration ? (
              <Text
                style={[
                  styles.durationText,
                  isDarkMode ? styles.durationTextDark : styles.durationTextLight,
                ]}
              >
                {ticket.returnDuration}
              </Text>
            ) : null}
            <View
              style={[
                styles.routeLine,
                isDarkMode ? styles.routeLineDark : styles.routeLineLight,
              ]}
            />
          </View>
          <View style={styles.flightInfoEnd}>
            {ticket.returnArrivalTime ? (
              <Text
                style={[
                  styles.flightTime,
                  isDarkMode ? styles.flightTimeDark : styles.flightTimeLight,
                ]}
              >
                {ticket.returnArrivalTime}
              </Text>
            ) : null}
            <Text
              style={[
                styles.flightLabel,
                isDarkMode ? styles.flightLabelDark : styles.flightLabelLight,
              ]}
            >
              Chegada
            </Text>
          </View>
        </View>
      ) : null}

      {(ticket.baggageInfo || ticket.cabinBagInfo) ? (
        <View style={styles.baggageContainer}>
          {ticket.baggageInfo ? (
            <View style={styles.baggageRow}>
              <Feather
                name="briefcase"
                size={12}
                color={!isDarkMode ? "#6B7280" : "#8E8E93"}
                style={styles.baggageIcon}
              />
              <Text style={isDarkMode ? styles.baggageTextDark : styles.baggageTextLight}>
                {sanitizeBaggage(ticket.baggageInfo, "Despachada:")}
              </Text>
            </View>
          ) : null}
          {ticket.cabinBagInfo ? (
            <View style={styles.baggageRowLast}>
              <Feather
                name="package"
                size={12}
                color={!isDarkMode ? "#6B7280" : "#8E8E93"}
                style={styles.baggageIcon}
              />
              <Text style={isDarkMode ? styles.baggageTextDark : styles.baggageTextLight}>
                {sanitizeBaggage(ticket.cabinBagInfo, "Mão:")}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {ticket.price ? (
        <View
          style={[
            styles.ticketCardFooter,
            isDarkMode ? styles.ticketCardFooterDark : styles.ticketCardFooterLight,
          ]}
        >
          <View>
            <Text
              style={[
                styles.cardPriceLabel,
                isDarkMode ? styles.cardPriceLabelDark : styles.cardPriceLabelLight,
              ]}
            >
              Preço total
            </Text>
            <Text
              style={[
                styles.cardPriceValue,
                isDarkMode ? styles.cardPriceValueDark : styles.cardPriceValueLight,
              ]}
            >
              {formatPriceDisplay(ticket.price, ticket.currency)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.cardSelectButton,
              isDarkMode ? styles.cardSelectButtonDark : styles.cardSelectButtonLight,
              isDarkMode && getSelectButtonDarkStyle(currentTheme.accent),
            ]}
            onPress={() => onSelectTicket(index, ticket)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.cardSelectButtonText,
                isDarkMode ? styles.cardSelectButtonTextDark : styles.cardSelectButtonTextLight,
                isDarkMode && getSelectButtonTextDarkStyle(currentTheme.accent),
              ]}
            >
              Ver site
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export const FlightTicketCard = memo(FlightTicketCardComponent);
