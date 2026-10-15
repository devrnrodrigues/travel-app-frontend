import React, { memo, useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, { getSelectedBorder } from "../../styles/flightModals.styles";

export const CURRENCY_MAP = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  AED: "Dirham dos Emirados",
  ARS: "Peso Argentino",
  AUD: "Dólar Australiano",
  AZN: "Manat Azerbaijano",
  BHD: "Dinar do Bahrein",
  BGN: "Lev Búlgaro",
  CAD: "Dólar Canadense",
  CLP: "Peso Chileno",
  CNY: "Yuan Chinês",
  COP: "Peso Colombiano",
  CZK: "Coroa Checa",
  DKK: "Coroa Dinamarquesa",
  EGP: "Libra Egípcia",
  FJD: "Dólar Fijiano",
  GEL: "Lari Georgiano",
  HKD: "Dólar de Hong Kong",
  HUF: "Forint Húngaro",
  INR: "Rúpia Indiana",
  IDR: "Rúpia Indonésia",
  ILS: "Novo Shekel Israelense",
  JPY: "Iene Japonês",
  JOD: "Dinar Jordaniano",
  KZT: "Tenge Cazaque",
  KWD: "Dinar Kuwaitiano",
  MYR: "Ringgit Malaio",
  MXN: "Peso Mexicano",
  MDL: "Leu Moldávio",
  NAD: "Dólar Namibiano",
  TWD: "Novo Dólar Taiwanês",
  NZD: "Dólar Neozelandês",
  NOK: "Coroa Norueguesa",
  OMR: "Rial Omanense",
  PLN: "Złoty Polonês",
  QAR: "Rial Catariano",
  RON: "Leu Romeno",
  RUB: "Rublo Russo",
  SAR: "Rial Saudita",
  SGD: "Dólar de Singapura",
  ZAR: "Rand Sul-Africano",
  KRW: "Won Sul-Coreano",
  SEK: "Coroa Sueca",
  CHF: "Franco Suíço",
  THB: "Baht Tailandês",
  TRY: "Lira Turca",
  UAH: "Hryvnia Ucraniana",
  VND: "Dong Vietnamita",
  XOF: "Franco CFA Ocidental",
};

export const CURRENCY_LIST = [
  { code: "BRL", label: "BRL (Real Brasileiro)", symbol: "R$" },
  { code: "USD", label: "USD (Dólar Americano)", symbol: "US$" },
  { code: "EUR", label: "EUR (Euro)", symbol: "€" },
  { code: "GBP", label: "GBP (Libra Esterlina)", symbol: "£" },
  { code: "AED", label: "AED (Dirham dos Emirados)", symbol: "AED" },
  { code: "ARS", label: "ARS (Peso Argentino)", symbol: "AR$" },
  { code: "AUD", label: "AUD (Dólar Australiano)", symbol: "AUD" },
  { code: "AZN", label: "AZN (Manat Azerbaijano)", symbol: "ман" },
  { code: "BHD", label: "BHD (Dinar do Bahrein)", symbol: "BD" },
  { code: "BGN", label: "BGN (Lev Búlgaro)", symbol: "лв" },
  { code: "CAD", label: "CAD (Dólar Canadense)", symbol: "CAN" },
  { code: "CLP", label: "CLP (Peso Chileno)", symbol: "CH$" },
  { code: "CNY", label: "CNY (Yuan Chinês)", symbol: "CY" },
  { code: "COP", label: "COP (Peso Colombiano)", symbol: "COL$" },
  { code: "CZK", label: "CZK (Coroa Checa)", symbol: "CZK" },
  { code: "DKK", label: "DKK (Coroa Dinamarquesa)", symbol: "DKR" },
  { code: "EGP", label: "EGP (Libra Egípcia)", symbol: "EGP" },
  { code: "FJD", label: "FJD (Dólar Fijiano)", symbol: "FJ$" },
  { code: "GEL", label: "GEL (Lari Georgiano)", symbol: "GEL" },
  { code: "HKD", label: "HKD (Dólar de Hong Kong)", symbol: "HKD" },
  { code: "HUF", label: "HUF (Forint Húngaro)", symbol: "FT" },
  { code: "INR", label: "INR (Rúpia Indiana)", symbol: "RS" },
  { code: "IDR", label: "IDR (Rúpia Indonésia)", symbol: "RP" },
  { code: "ILS", label: "ILS (Novo Shekel Israelense)", symbol: "NIS" },
  { code: "JPY", label: "JPY (Iene Japonês)", symbol: "¥" },
  { code: "JOD", label: "JOD (Dinar Jordaniano)", symbol: "JD" },
  { code: "KZT", label: "KZT (Tenge Cazaque)", symbol: "KZT" },
  { code: "KWD", label: "KWD (Dinar Kuwaitiano)", symbol: "KD" },
  { code: "MYR", label: "MYR (Ringgit Malaio)", symbol: "RIN" },
  { code: "MXN", label: "MXN (Peso Mexicano)", symbol: "MEX" },
  { code: "MDL", label: "MDL (Leu Moldávio)", symbol: "MDL" },
  { code: "NAD", label: "NAD (Dólar Namibiano)", symbol: "N$" },
  { code: "TWD", label: "TWD (Novo Dólar Taiwanês)", symbol: "NT$" },
  { code: "NZD", label: "NZD (Dólar Neozelandês)", symbol: "$NZ" },
  { code: "NOK", label: "NOK (Coroa Norueguesa)", symbol: "NKR" },
  { code: "OMR", label: "OMR (Rial Omanense)", symbol: "RO" },
  { code: "PLN", label: "PLN (Złoty Polonês)", symbol: "ZL" },
  { code: "QAR", label: "QAR (Rial Catariano)", symbol: "QR" },
  { code: "RON", label: "RON (Leu Romeno)", symbol: "lei" },
  { code: "RUB", label: "RUB (Rublo Russo)", symbol: "RUB" },
  { code: "SAR", label: "SAR (Rial Saudita)", symbol: "SR" },
  { code: "SGD", label: "SGD (Dólar de Singapura)", symbol: "S$" },
  { code: "ZAR", label: "ZAR (Rand Sul-Africano)", symbol: "R" },
  { code: "KRW", label: "KRW (Won Sul-Coreano)", symbol: "₩" },
  { code: "SEK", label: "SEK (Coroa Sueca)", symbol: "SKR" },
  { code: "CHF", label: "CHF (Franco Suíço)", symbol: "CHF" },
  { code: "THB", label: "THB (Baht Tailandês)", symbol: "TB" },
  { code: "TRY", label: "TRY (Lira Turca)", symbol: "YTL" },
  { code: "UAH", label: "UAH (Hryvnia Ucraniana)", symbol: "UAH" },
  { code: "VND", label: "VND (Dong Vietnamita)", symbol: "VND" },
  { code: "XOF", label: "XOF (Franco CFA Ocidental)", symbol: "XOF" },
];

const BATCH_SIZE = 15;

function CurrencyModalComponent({
  visible,
  onClose,
  onSelectCurrency,
  selectedCurrency,
  currentTheme,
  isDarkMode,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedCount, setDisplayedCount] = useState(BATCH_SIZE);

  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return CURRENCY_LIST;
    return CURRENCY_LIST.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const displayedCurrencies = useMemo(() => {
    return filteredCurrencies.slice(0, displayedCount);
  }, [filteredCurrencies, displayedCount]);

  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
    setDisplayedCount(BATCH_SIZE);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (displayedCount < filteredCurrencies.length) {
      setDisplayedCount((prev) => Math.min(prev + BATCH_SIZE, filteredCurrencies.length));
    }
  }, [displayedCount, filteredCurrencies.length]);

  const handleModalClose = useCallback(() => {
    setSearchQuery("");
    setDisplayedCount(BATCH_SIZE);
    onClose();
  }, [onClose]);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedCurrency === item.code;
      const itemBorder = isSelected ? getSelectedBorder(currentTheme.accent) : null;

      return (
        <TouchableOpacity
          style={[
            styles.modalOptionItem,
            !isDarkMode && styles.modalOptionItemLight,
            isSelected && styles.modalOptionItemSelected,
            itemBorder,
          ]}
          onPress={() => {
            onSelectCurrency(item.code);
            handleModalClose();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.modalOptionLeft}>
            <View style={styles.modalOptionSymbolBox}>
              <Text
                style={[
                  styles.symbolBadgeText,
                  !isDarkMode && styles.symbolBadgeTextLight,
                  isSelected && { color: currentTheme.accent },
                ]}
                numberOfLines={1}
              >
                {item.symbol}
              </Text>
            </View>
            <Text
              style={[
                styles.modalOptionText,
                !isDarkMode && styles.modalOptionTextLight,
                isSelected && styles.modalOptionTextSelected,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
          {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
        </TouchableOpacity>
      );
    },
    [selectedCurrency, currentTheme.accent, isDarkMode, onSelectCurrency, handleModalClose]
  );

  const keyExtractor = useCallback((item) => item.code, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && styles.modalSelectTitleLight]}>
              Tipo de Moeda
            </Text>
          </View>

          <View style={[styles.searchContainer, !isDarkMode && styles.searchContainerLight]}>
            <Feather
              name="search"
              size={16}
              color={isDarkMode ? "rgba(255, 255, 255, 0.45)" : "#9CA3AF"}
            />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearchChange}
              maxLength={50}
              placeholder="Buscar moeda..."
              placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.4)" : "#9CA3AF"}
              style={[styles.searchInput, !isDarkMode && styles.searchInputLight]}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearchChange("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name="x"
                  size={16}
                  color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#6B7280"}
                />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={displayedCurrencies}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            initialNumToRender={BATCH_SIZE}
            maxToRenderPerBatch={BATCH_SIZE}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={[styles.emptyListText, !isDarkMode && styles.emptyListTextLight]}>
                  Nenhuma moeda encontrada
                </Text>
              </View>
            }
          />

          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={handleModalClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && styles.closeModalButtonTextLight]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export const CurrencyModal = memo(CurrencyModalComponent);
