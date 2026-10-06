import React, { memo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import FadeInView from "../../../shared/components/FadeInView";
import styles, { getAccentBg } from "../styles/flightResults.styles";

function FlightResultsLoadingComponent({ currentTheme, isDarkMode }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={currentTheme.accent} />
      <Text
        style={[
          styles.loadingText,
          isDarkMode ? styles.loadingTextDark : styles.loadingTextLight,
        ]}
      >
        Buscando as melhores ofertas...
      </Text>
    </View>
  );
}

function FlightResultsErrorComponent({ onRetry, currentTheme, isDarkMode }) {
  const retryBtnBg = getAccentBg(currentTheme.accent);

  return (
    <FadeInView duration={240} style={styles.errorContainer}>
      <Text
        style={[
          styles.errorText,
          isDarkMode ? styles.errorTextDark : styles.errorTextLight,
        ]}
      >
        Não foi possível carregar os voos.
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, retryBtnBg]}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </FadeInView>
  );
}

function FlightResultsEmptyComponent({ isDarkMode }) {
  return (
    <FadeInView duration={240} style={styles.loadingContainer}>
      <Feather
        name="alert-circle"
        size={36}
        color={!isDarkMode ? "#9CA3AF" : "#6B7280"}
        style={styles.emptyIconMargin}
      />
      <Text
        style={[
          styles.loadingText,
          isDarkMode ? styles.loadingTextDark : styles.loadingTextLight,
        ]}
      >
        Nenhuma oferta encontrada para esta rota.
      </Text>
    </FadeInView>
  );
}

export const FlightResultsLoading = memo(FlightResultsLoadingComponent);
export const FlightResultsError = memo(FlightResultsErrorComponent);
export const FlightResultsEmpty = memo(FlightResultsEmptyComponent);
