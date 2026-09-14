import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/flightSearch.styles";
import FadeInView from "../../../shared/components/FadeInView";

export default function FlightResults({ tickets, loading, error, onRetry, currentTheme, isDarkMode }) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);

  const cheapestTicket = tickets && tickets.length > 0 ? tickets[0] : null;

  const sanitizeBaggage = (text) => {
    if (!text) return null;
    const clean = String(text).replace(/undefined/gi, "").replace(/0x\s*/gi, "").trim();
    return clean.length > 0 ? clean : "Inclusa";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentTheme.accent} />
        <Text style={[styles.loadingText, !isDarkMode && { color: "#4B5563" }]}>Buscando as melhores ofertas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <FadeInView duration={240} style={styles.errorContainer}>
        <Text style={[styles.errorText, !isDarkMode && { color: "#DC2626" }]}>Não foi possível carregar os voos.</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: currentTheme.accent }]} onPress={onRetry}>
          <Text style={[styles.retryButtonText, { color: "#000000" }]}>Tentar Novamente</Text>
        </TouchableOpacity>
      </FadeInView>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <FadeInView duration={240} style={styles.loadingContainer}>
        <Feather name="alert-circle" size={36} color={!isDarkMode ? "#9CA3AF" : "#6B7280"} style={styles.marginBottom12} />
        <Text style={[styles.loadingText, !isDarkMode && { color: "#4B5563" }]}>Nenhuma oferta encontrada para esta rota.</Text>
      </FadeInView>
    );
  }

  return (
    <FadeInView duration={280} style={styles.flex1}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tickets.map((ticket, index) => (
          <View
            key={`${ticket.id}_${index}`}
            style={[
              styles.ticketCard,
              !isDarkMode && {
                backgroundColor: "#FFFFFF",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.09,
                shadowRadius: 10,
                elevation: 4,
                marginHorizontal: 3,
                marginVertical: 4,
              },
              selectedTicketIndex === index && { borderColor: currentTheme.accent, borderWidth: 2 },
            ]}
          >
            <View style={styles.companyRow}>
              <View style={styles.companyInfo}>
                {ticket.logo ? (
                  <Image
                    source={{ uri: ticket.logo }}
                    style={styles.companyLogo}
                  />
                ) : (
                  <Ionicons name="airplane" size={18} color={currentTheme.accent} style={styles.marginRight6} />
                )}
                {ticket.company ? (
                  <Text style={[styles.companyName, !isDarkMode && { color: "#111827", fontWeight: "700" }]}>
                    {ticket.company}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.stopsBadge,
                  !isDarkMode && {
                    color: "#0D9488",
                    backgroundColor: "rgba(13, 148, 136, 0.12)",
                    fontWeight: "700",
                  },
                ]}
              >
                {ticket.stops}
              </Text>
            </View>

            <View style={styles.flightRoute}>
              <View style={styles.flightInfo}>
                {ticket.departureTime ? (
                  <Text style={[styles.flightTime, !isDarkMode && { color: "#111827", fontWeight: "700" }]}>
                    {ticket.departureTime}
                  </Text>
                ) : null}
                <Text style={[styles.flightLabel, !isDarkMode && { color: "#6B7280" }]}>Ida</Text>
              </View>
              <View style={styles.routeLineContainer}>
                {ticket.duration ? (
                  <Text style={[styles.durationText, !isDarkMode && { color: "#6B7280" }]}>{ticket.duration}</Text>
                ) : null}
                <View
                  style={[
                    styles.routeLine,
                    !isDarkMode && { backgroundColor: "#E5E7EB", height: 1 },
                  ]}
                />
              </View>
              <View style={[styles.flightInfo, { alignItems: "flex-end" }]}>
                {ticket.arrivalTime ? (
                  <Text style={[styles.flightTime, !isDarkMode && { color: "#111827", fontWeight: "700" }]}>
                    {ticket.arrivalTime}
                  </Text>
                ) : null}
                <Text style={[styles.flightLabel, !isDarkMode && { color: "#6B7280" }]}>Chegada</Text>
              </View>
            </View>

            {ticket.hasReturn && ticket.returnDepartureTime ? (
              <View
                style={[
                  styles.flightReturnRow,
                  !isDarkMode && { borderTopColor: "rgba(0, 0, 0, 0.04)" },
                ]}
              >
                <View style={styles.flightInfo}>
                  <Text style={[styles.flightTime, !isDarkMode && { color: "#111827", fontWeight: "700" }]}>
                    {ticket.returnDepartureTime}
                  </Text>
                  <Text style={[styles.flightLabel, !isDarkMode && { color: "#6B7280" }]}>Volta</Text>
                </View>
                <View style={styles.routeLineContainer}>
                  {ticket.returnDuration ? (
                    <Text style={[styles.durationText, !isDarkMode && { color: "#6B7280" }]}>{ticket.returnDuration}</Text>
                  ) : null}
                  <View
                    style={[
                      styles.routeLine,
                      !isDarkMode && { backgroundColor: "#E5E7EB", height: 1 },
                    ]}
                  />
                </View>
                <View style={[styles.flightInfo, { alignItems: "flex-end" }]}>
                  {ticket.returnArrivalTime ? (
                    <Text style={[styles.flightTime, !isDarkMode && { color: "#111827", fontWeight: "700" }]}>
                      {ticket.returnArrivalTime}
                    </Text>
                  ) : null}
                  <Text style={[styles.flightLabel, !isDarkMode && { color: "#6B7280" }]}>Chegada</Text>
                </View>
              </View>
            ) : null}

            {(ticket.baggageInfo || ticket.cabinBagInfo) ? (
              <View style={styles.marginTop10Bottom2}>
                {ticket.baggageInfo ? (
                  <View style={styles.rowCenterMarginBottom4}>
                    <Feather name="briefcase" size={12} color={!isDarkMode ? "#6B7280" : "#8E8E93"} style={styles.marginRight4} />
                    <Text style={!isDarkMode ? styles.flightDetailTextLight : styles.flightDetailTextDark}>
                      Despachada: {sanitizeBaggage(ticket.baggageInfo)}
                    </Text>
                  </View>
                ) : null}
                {ticket.cabinBagInfo ? (
                  <View style={styles.rowCenter}>
                    <Feather name="package" size={12} color={!isDarkMode ? "#6B7280" : "#8E8E93"} style={styles.marginRight4} />
                    <Text style={!isDarkMode ? styles.flightDetailTextLight : styles.flightDetailTextDark}>
                      Mão: {sanitizeBaggage(ticket.cabinBagInfo)}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {ticket.price ? (
              <View
                style={[
                  styles.ticketCardFooter,
                  !isDarkMode && { borderTopColor: "rgba(0, 0, 0, 0.04)" },
                ]}
              >
                <View>
                  <Text style={[styles.cardPriceLabel, !isDarkMode && { color: "#6B7280" }]}>Preço total</Text>
                  <Text style={[styles.cardPriceValue, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>
                    {ticket.currency} {ticket.price}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.cardSelectButton,
                    !isDarkMode && {
                      backgroundColor: "#161616",
                      borderWidth: 0,
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    setSelectedTicketIndex(index);
                    const query = encodeURIComponent(`${ticket.company || "companhia aérea"} passagens`);
                    Linking.openURL(`https://www.google.com/search?q=${query}`);
                  }}
                >
                  <Text style={[styles.cardSelectButtonText, !isDarkMode && { color: "#FFFFFF", fontWeight: "700" }]}>
                    Ver site
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.footerPriceRow,
          !isDarkMode && {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, !isDarkMode && { color: "#6B7280" }]}>Passagens a partir de</Text>
          {cheapestTicket?.price ? (
            <Text style={[styles.priceValue, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>
              {cheapestTicket.currency} {cheapestTicket.price}
            </Text>
          ) : (
            <Text style={[styles.priceValue, !isDarkMode && { color: "#111827" }]}>—</Text>
          )}
        </View>
      </View>
    </FadeInView>
  );
}
