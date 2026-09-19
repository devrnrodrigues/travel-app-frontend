import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  ActivityIndicator, TextInput, ImageBackground, StyleSheet,
  Animated, BackHandler, Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { searchFlights, CABIN_CLASS_MAP, getAirportsApi } from "../api/flightApi";
import FlightResults from "./FlightResultsScreen";
import styles from "../flightSearch.styles";
import { useTheme } from "../../../theme/ThemeContext";
import FadeInView from "../../../shared/components/FadeInView";
import {
  DestinationModal,
  CabinClassModal,
  CurrencyModal,
  CalendarModal,
} from "../components/FlightModals";

export default function DetailsTicket({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const { currentTheme, item: selectedItem } = route.params || {
    currentTheme: { colors: ["#FFF"], accent: "#249689" },
    item: { title: "Destino", image_url: "" },
  };

  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const isExitingRef = useRef(false);

  const getPresetDates = () => {
    const today = new Date();
    const dep = new Date(today); dep.setDate(today.getDate() + 1);
    const ret = new Date(dep); ret.setDate(dep.getDate() + 30);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { defaultDeparture: fmt(dep), defaultReturning: fmt(ret) };
  };
  const { defaultDeparture, defaultReturning } = getPresetDates();

  const [originInput, setOriginInput] = useState("");
  const [originAirport, setOriginAirport] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [allAirports, setAllAirports] = useState([]);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [destinationModalVisible, setDestinationModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [departDate, setDepartDate] = useState(defaultDeparture);
  const [returnDate, setReturnDate] = useState(defaultReturning);
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [cabinClass, setCabinClass] = useState("Econômica");
  const [currency, setCurrency] = useState("BRL");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("IDA");

  useEffect(() => {
    Animated.timing(screenFadeAnim, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoBack = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Main");
      }
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      if (destinationModalVisible) {
        setDestinationModalVisible(false);
        return true;
      }
      if (classModalVisible) {
        setClassModalVisible(false);
        return true;
      }
      if (currencyModalVisible) {
        setCurrencyModalVisible(false);
        return true;
      }
      if (calendarModalVisible) {
        setCalendarModalVisible(false);
        return true;
      }
      if (searchSubmitted) {
        setSearchSubmitted(false);
        return true;
      }
      handleGoBack();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [searchSubmitted, destinationModalVisible, classModalVisible, currencyModalVisible, calendarModalVisible]);

  const headerImageSource = React.useMemo(() => {
    const candidate =
      selectedItem?.image_url ||
      selectedItem?.image ||
      selectedItem?.imageUrl ||
      selectedItem?.imagem ||
      selectedItem?.cover ||
      currentTheme?.bg;

    if (candidate) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return { uri: candidate };
      }
      if (typeof candidate === "number" || (typeof candidate === "object" && candidate?.uri)) {
        return candidate;
      }
    }
    return require("../../../assets/welcome-bg.jpg");
  }, [selectedItem, currentTheme]);

  useEffect(() => {
    let isMounted = true;
    const loadAirports = async () => {
      setLoadingDestination(true);
      try {
        const airports = await getAirportsApi();
        if (!isMounted) return;
        setAllAirports(airports);

        const targetIata =
          selectedItem?.nearestAirportIata ||
          selectedItem?.nearest_airport_iata ||
          selectedItem?.nearestAirport?.iataCode;

        let match = null;
        if (targetIata) {
          match = airports.find((a) => a.codigo_iata === targetIata);
        }
        if (!match && selectedItem?.title) {
          const titleLower = selectedItem.title.toLowerCase();
          match = airports.find(
            (a) =>
              (a.cidade && titleLower.includes(a.cidade.toLowerCase())) ||
              (a.nome_aeroporto && a.nome_aeroporto.toLowerCase().includes(titleLower))
          );
        }

        if (match) {
          setDestinationOptions([match]);
          setDestinationAirport(match);
        } else if (airports.length > 0) {
          setDestinationOptions(airports.slice(0, 10));
          setDestinationAirport(airports[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoadingDestination(false);
      }
    };

    loadAirports();
    return () => {
      isMounted = false;
    };
  }, [selectedItem]);

  useEffect(() => {
    if (
      originInput.trim() === "" ||
      (originAirport && originInput === `${originAirport.nome_aeroporto} (${originAirport.codigo_iata})`)
    ) {
      setOriginSuggestions([]);
      return;
    }
    const query = originInput.trim().toLowerCase();
    const matches = allAirports
      .filter(
        (item) =>
          (item.nome_aeroporto && item.nome_aeroporto.toLowerCase().includes(query)) ||
          (item.cidade && item.cidade.toLowerCase().includes(query)) ||
          (item.codigo_iata && item.codigo_iata.toLowerCase().includes(query))
      )
      .slice(0, 5);
    setOriginSuggestions(matches);
  }, [originInput, originAirport, allAirports]);

  const handleSearchFlights = async () => {
    if (!originAirport || !destinationAirport) return;
    setSearchSubmitted(true);
    setLoading(true);
    setError(false);
    setTickets([]);
    try {
      const result = await searchFlights({
        fromIata: originAirport.codigo_iata,
        toIata: destinationAirport.codigo_iata,
        departDate,
        returnDate,
        adults,
        children,
        cabinClass,
        currency,
      });
      if (!result.length) setError(true);
      else setTickets(result);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCalendar = (target) => {
    setCalendarTarget(target);
    setCalendarModalVisible(true);
  };

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {
          backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
          opacity: screenFadeAnim,
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={headerImageSource}
        style={styles.topHeaderSection}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.58)"]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity
            style={[
              styles.roundButton,
              !isDarkMode
                ? { backgroundColor: "rgba(255, 255, 255, 0.8)", shadowColor: "#000", shadowOpacity: 0.1 }
                : { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            ]}
            onPress={() => (searchSubmitted ? setSearchSubmitted(false) : handleGoBack())}
            activeOpacity={0.7}
          >
            <Feather
              name="chevron-left"
              size={24}
              color={!isDarkMode ? "#000000" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <View style={styles.emptyView} />
        </SafeAreaView>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {searchSubmitted ? "Ofertas\nEncontradas" : `Voos para\n${selectedItem?.title || "o Destino"}`}
        </Text>
      </ImageBackground>

      <View
        style={[
          styles.infoBottomSection,
          !isDarkMode && {
            backgroundColor: "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 8,
          },
        ]}
      >
        {!searchSubmitted ? (
          <>
            <ScrollView
              style={styles.flex1}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>Aeroporto de Origem</Text>
              <View style={styles.inputSearchContainer}>
                <TextInput
                  style={[
                    styles.textInputField,
                    !isDarkMode && {
                      backgroundColor: "#F7F8F9",
                      color: "#111827",
                      borderWidth: 0,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                      elevation: 1,
                    },
                  ]}
                  value={originInput}
                  onChangeText={setOriginInput}
                  placeholder="Ex: São Paulo"
                  placeholderTextColor={!isDarkMode ? "#9CA3AF" : "#8E8E93"}
                />
                {loadingOrigin && (
                  <ActivityIndicator size="small" color={currentTheme.accent} style={styles.inputSpinner} />
                )}
              </View>
              {originSuggestions.length > 0 && (
                <FadeInView
                  duration={200}
                  style={[
                    styles.autocompleteContainer,
                    !isDarkMode && {
                      backgroundColor: "#FFFFFF",
                      borderWidth: 0,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    },
                  ]}
                >
                  {originSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(0,0,0,0.04)" }]}
                      onPress={() => {
                        setOriginAirport(item);
                        setOriginInput(`${item.nome_aeroporto} (${item.codigo_iata})`);
                        setOriginSuggestions([]);
                      }}
                    >
                      <Feather name="map-pin" size={14} color={!isDarkMode ? "#6B7280" : "#8E8E93"} style={styles.marginRight8} />
                      <Text style={[styles.autocompleteText, !isDarkMode && { color: "#111827" }]}>
                        {item.nome_aeroporto} ({item.codigo_iata}) - {item.cidade}/{item.estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </FadeInView>
              )}

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>Aeroporto de Destino</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => setDestinationModalVisible(true)}
                disabled={loadingDestination}
                activeOpacity={0.6}
              >
                {loadingDestination ? (
                  <ActivityIndicator size="small" color={currentTheme.accent} />
                ) : (
                  <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>
                    {destinationAirport
                      ? `${destinationAirport.nome_aeroporto} (${destinationAirport.codigo_iata})`
                      : "Nenhum aeroporto encontrado"}
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>DATA DE IDA</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => handleOpenCalendar("IDA")}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>{departDate}</Text>
                <Feather name="calendar" size={18} color="#8E8E93" />
              </TouchableOpacity>

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>DATA DE VOLTA</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => handleOpenCalendar("VOLTA")}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>{returnDate}</Text>
                <Feather name="calendar" size={18} color="#8E8E93" />
              </TouchableOpacity>

              <View style={styles.rowInputs}>
                <View style={styles.inputCol}>
                  <Text style={[styles.labelCol, !isDarkMode && { color: "#6B7280", fontWeight: "800" }]}>ADULTOS</Text>
                  <TextInput
                    style={[
                      styles.inputCenter,
                      !isDarkMode && {
                        backgroundColor: "#F7F8F9",
                        color: "#111827",
                        borderWidth: 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        elevation: 1,
                      },
                    ]}
                    value={adults}
                    onChangeText={setAdults}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.labelCol, !isDarkMode && { color: "#6B7280", fontWeight: "800" }]}>CRIANÇAS</Text>
                  <TextInput
                    style={[
                      styles.inputCenter,
                      !isDarkMode && {
                        backgroundColor: "#F7F8F9",
                        color: "#111827",
                        borderWidth: 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        elevation: 1,
                      },
                    ]}
                    value={children}
                    onChangeText={setChildren}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>CLASSE DO VOO</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => setClassModalVisible(true)}
                activeOpacity={0.6}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>{cabinClass}</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>TIPO DE MOEDA</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => setCurrencyModalVisible(true)}
                activeOpacity={0.6}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>{currency}</Text>
              </TouchableOpacity>
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
                <Text style={[styles.priceLabel, !isDarkMode && { color: "#6B7280" }]}>Localização</Text>
                <Text style={[styles.priceValue, { fontSize: 16 }, !isDarkMode && { color: "#111827", fontWeight: "800" }]} numberOfLines={1}>
                  {selectedItem?.location || selectedItem?.title || "Pronto para buscar"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !isDarkMode
                    ? { backgroundColor: "#000000", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }
                    : { backgroundColor: currentTheme.accent },
                ]}
                onPress={handleSearchFlights}
                activeOpacity={0.8}
              >
                <Feather name="search" size={24} color={!isDarkMode ? "#FFFFFF" : "#000"} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <FlightResults
            tickets={tickets}
            loading={loading}
            error={error}
            onRetry={handleSearchFlights}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          />
        )}
      </View>

      <DestinationModal
        visible={destinationModalVisible}
        onClose={() => setDestinationModalVisible(false)}
        destinationOptions={destinationOptions}
        onSelectAirport={setDestinationAirport}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CabinClassModal
        visible={classModalVisible}
        onClose={() => setClassModalVisible(false)}
        onSelectClass={setCabinClass}
        cabinClassMap={CABIN_CLASS_MAP}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        onSelectCurrency={setCurrency}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CalendarModal
        visible={calendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        target={calendarTarget}
        departDate={departDate}
        returnDate={returnDate}
        onSelectDate={(newDate, target) => {
          if (target === "IDA") setDepartDate(newDate);
          else setReturnDate(newDate);
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
    </Animated.View>
  );
}
