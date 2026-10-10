import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  filterModalStyles,
  getActiveItemBorderStyle,
  getActiveItemTextStyle,
  getModalTranslateStyle,
} from "../styles/filterModal.styles";
import useFilterModalSwipe from "../hooks/useFilterModalSwipe";
import { BASE_COUNTRIES_LIST } from "../../../shared/data/countries";
import { SkeletonBox } from "../../../shared/components/Skeleton";

const PAGE_SIZE = 20;
const SKELETON_WIDTHS = [120, 95, 140, 110, 130, 85];

function CountryFilterSkeletonList({ isDarkMode }) {
  return (
    <View style={{ width: "100%", paddingTop: 2 }}>
      {SKELETON_WIDTHS.map((w, idx) => (
        <View
          key={`country-skel-${idx}`}
          style={[
            filterModalStyles.countryItem,
            isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
            { marginBottom: 8 },
          ]}
        >
          <View style={filterModalStyles.rowCenter}>
            <SkeletonBox
              width={24}
              height={18}
              borderRadius={4}
              isDarkMode={isDarkMode}
              style={{ marginRight: 10 }}
            />
            <SkeletonBox
              width={w}
              height={16}
              borderRadius={6}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const CountryFilterModal = React.memo(function CountryFilterModal({
  visible,
  onClose,
  destinations = [],
  selectedCountry,
  onSelectCountry,
  currentTheme,
  isDarkMode,
}) {
  const { slideAnim, fadeAnim, panResponder, handleCloseModal } = useFilterModalSwipe(visible, onClose);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryPage, setCountryPage] = useState(1);
  const [isListReady, setIsListReady] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsListReady(false);
      setSearchQuery("");
      setCountryPage(1);

      const timer = setTimeout(() => {
        setIsListReady(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsListReady(false);
    }
  }, [visible]);

  useEffect(() => {
    setCountryPage(1);
  }, [searchQuery]);

  const allCountriesBase = useMemo(() => {
    if (!destinations || destinations.length === 0) {
      return BASE_COUNTRIES_LIST;
    }
    const existing = new Set(BASE_COUNTRIES_LIST.map((c) => c.key.toLowerCase()));
    const extras = [];

    for (const d of destinations) {
      if (d.location) {
        const parts = d.location.split(",");
        const lastPart = parts[parts.length - 1]?.trim();
        if (lastPart && !existing.has(lastPart.toLowerCase())) {
          existing.add(lastPart.toLowerCase());
          extras.push({
            key: lastPart,
            name: lastPart,
            code: null,
            flag: "📍",
          });
        }
      }
    }

    if (extras.length === 0) return BASE_COUNTRIES_LIST;
    return [...BASE_COUNTRIES_LIST, ...extras];
  }, [destinations]);

  const countriesList = useMemo(() => {
    const allOption = { key: null, name: "Todos os países", code: null, flag: "🌍" };
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filtered = allCountriesBase.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.code && c.code.toLowerCase().includes(query))
      );
      return [allOption, ...filtered];
    }

    const normalizedSelected = selectedCountry ? String(selectedCountry).toLowerCase() : null;
    let activeItem = null;
    const others = [];

    for (const item of allCountriesBase) {
      if (normalizedSelected && item.key.toLowerCase() === normalizedSelected) {
        activeItem = item;
      } else {
        others.push(item);
      }
    }

    if (activeItem) {
      return [activeItem, allOption, ...others];
    }

    return [allOption, ...others];
  }, [allCountriesBase, searchQuery, selectedCountry]);

  const paginatedCountries = useMemo(() => {
    return countriesList.slice(0, countryPage * PAGE_SIZE);
  }, [countriesList, countryPage]);

  const handleLoadMoreCountries = useCallback(() => {
    if (paginatedCountries.length < countriesList.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setCountryPage((prev) => prev + 1);
        setIsLoadingMore(false);
      }, 160);
    }
  }, [paginatedCountries.length, countriesList.length, isLoadingMore]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const renderCountryItem = useCallback(
    ({ item }) => {
      const isSelected =
        (!selectedCountry && item.key === null) ||
        (selectedCountry &&
          item.key &&
          String(selectedCountry).toLowerCase() === String(item.key).toLowerCase());

      return (
        <TouchableOpacity
          key={item.key || "all-countries"}
          onPress={() => {
            onSelectCountry(item.key);
            handleCloseModal();
          }}
          activeOpacity={0.7}
          style={[
            filterModalStyles.countryItem,
            isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
            isSelected && [
              isDarkMode
                ? filterModalStyles.countryItemActiveDark
                : filterModalStyles.countryItemActiveLight,
              getActiveItemBorderStyle(currentTheme.accent),
            ],
          ]}
        >
          <View style={filterModalStyles.rowCenter}>
            <Text style={filterModalStyles.flag18}>{item.flag}</Text>
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
              {item.name}
            </Text>
          </View>
          {isSelected && (
            <Feather name="check" size={18} color={currentTheme.accent} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedCountry, onSelectCountry, handleCloseModal, isDarkMode, currentTheme.accent]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <Text style={{ color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#6B7280", fontSize: 14 }}>
          Nenhum país encontrado
        </Text>
      </View>
    ),
    [isDarkMode]
  );

  const renderListFooter = useCallback(() => {
    if (paginatedCountries.length < countriesList.length) {
      return (
        <View style={{ paddingTop: 4, paddingBottom: 16 }}>
          <View
            style={[
              filterModalStyles.countryItem,
              isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
              { marginBottom: 8, opacity: 0.8 },
            ]}
          >
            <View style={filterModalStyles.rowCenter}>
              <SkeletonBox
                width={24}
                height={18}
                borderRadius={4}
                isDarkMode={isDarkMode}
                style={{ marginRight: 10 }}
              />
              <SkeletonBox
                width={110}
                height={16}
                borderRadius={6}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
          <View
            style={[
              filterModalStyles.countryItem,
              isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
              { marginBottom: 8, opacity: 0.55 },
            ]}
          >
            <View style={filterModalStyles.rowCenter}>
              <SkeletonBox
                width={24}
                height={18}
                borderRadius={4}
                isDarkMode={isDarkMode}
                style={{ marginRight: 10 }}
              />
              <SkeletonBox
                width={85}
                height={16}
                borderRadius={6}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </View>
      );
    }
    return null;
  }, [paginatedCountries.length, countriesList.length, isDarkMode]);

  const keyExtractor = useCallback((item) => item.key || "all-countries", []);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <Animated.View style={[filterModalStyles.overlay, { opacity: fadeAnim }]}>
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

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#F3F4F6",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  height: 42,
                  marginTop: 6,
                  marginBottom: 8,
                }}
              >
                <Feather
                  name="search"
                  size={16}
                  color={isDarkMode ? "rgba(255, 255, 255, 0.45)" : "#9CA3AF"}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar país..."
                  placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.4)" : "#9CA3AF"}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: isDarkMode ? "#FFFFFF" : "#111827",
                    paddingVertical: 0,
                  }}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather
                      name="x-circle"
                      size={16}
                      color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#9CA3AF"}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {!isListReady ? (
                <CountryFilterSkeletonList isDarkMode={isDarkMode} />
              ) : (
                <FlatList
                  data={paginatedCountries}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  style={filterModalStyles.countryListScroll}
                  keyboardShouldPersistTaps="handled"
                  onEndReached={handleLoadMoreCountries}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={15}
                  maxToRenderPerBatch={15}
                  windowSize={5}
                  renderItem={renderCountryItem}
                  ListFooterComponent={renderListFooter}
                  ListEmptyComponent={renderEmptyComponent}
                />
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default CountryFilterModal;
