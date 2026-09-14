import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  ActivityIndicator, TextInput, Modal, Image, ImageBackground, FlatList, Dimensions, StyleSheet,
  Animated, BackHandler, Easing,
} from "react-native";
const { width } = Dimensions.get("window");
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { searchFlights, CABIN_CLASS_MAP } from "../api/flightApi";
import FlightResults from "./FlightResultsScreen";
import styles from "../styles/flightSearch.styles";
import { useTheme } from "../../../theme/ThemeContext";
import { supabase } from "../../../config/supabase";
import FadeInView from "../../../shared/components/FadeInView";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

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
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());

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
    if (selectedItem?.title) fetchDestinationAirports(selectedItem.title);
  }, [selectedItem]);

  useEffect(() => {
    if (
      originInput.trim() === "" ||
      (originAirport && originInput === `${originAirport.nome_aeroporto} (${originAirport.codigo_iata})`)
    ) {
      setOriginSuggestions([]);
      return;
    }
    setLoadingOrigin(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from("aeroportos_origem")
          .select("*")
          .or(`nome_aeroporto.ilike.%${originInput}%,cidade.ilike.%${originInput}%,codigo_iata.ilike.%${originInput}%`)
          .limit(5);
        if (data) setOriginSuggestions(data);
      } catch (e) { console.error(e); }
      finally { setLoadingOrigin(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [originInput, originAirport]);

  const fetchDestinationAirports = async (title) => {
    setLoadingDestination(true);
    try {
      const { data } = await supabase
        .from("aeroportos_destino").select("*").eq("destino_title", title);
      if (data) {
        setDestinationOptions(data);
        if (data.length > 0) setDestinationAirport(data[0]);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingDestination(false); }
  };

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
    const dateStr = target === "IDA" ? departDate : returnDate;
    const [year, month] = dateStr.split("-").map(Number);
    setCurrentCalendarYear(year);
    setCurrentCalendarMonth(month - 1);
    setCalendarTarget(target);
    setCalendarModalVisible(true);
  };

  const changeMonth = (dir) => {
    let m = currentCalendarMonth + dir;
    let y = currentCalendarYear;
    if (m > 11) { m = 0; y++; } else if (m < 0) { m = 11; y--; }
    setCurrentCalendarMonth(m);
    setCurrentCalendarYear(y);
  };

  const generateCalendarDays = () => {
    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push({ dayStr: "", isEmpty: true });
    for (let i = 1; i <= totalDays; i++)
      days.push({ dayStr: String(i).padStart(2, "0"), isEmpty: false });
    return days;
  };

  const handleSelectDay = (dayStr) => {
    const m = String(currentCalendarMonth + 1).padStart(2, "0");
    const newDate = `${currentCalendarYear}-${m}-${dayStr}`;
    if (calendarTarget === "IDA") setDepartDate(newDate);
    else setReturnDate(newDate);
    setCalendarModalVisible(false);
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

      <Modal visible={destinationModalVisible} transparent animationType="fade" statusBarTranslucent={true} navigationBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDestinationContent,
              !isDarkMode && {
                backgroundColor: "rgba(100, 100, 100, 0.82)",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}
          >
            <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#FFFFFF" }]}>
              Selecione o Aeroporto de Chegada
            </Text>
            <FlatList
              data={destinationOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                  onPress={() => { setDestinationAirport(item); setDestinationModalVisible(false); }}
                >
                  <Feather name="navigation" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                  <Text style={[styles.autocompleteText, !isDarkMode && { color: "#FFFFFF" }]}>
                    {item.nome_aeroporto} ({item.codigo_iata})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setDestinationModalVisible(false)}>
              <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(255, 255, 255, 0.75)" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={classModalVisible} transparent animationType="fade" statusBarTranslucent={true} navigationBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDestinationContent,
              !isDarkMode && {
                backgroundColor: "rgba(100, 100, 100, 0.82)",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}
          >
            <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#FFFFFF" }]}>
              Selecione a Classe do Voo
            </Text>
            <FlatList
              data={Object.keys(CABIN_CLASS_MAP).map((label) => ({ id: CABIN_CLASS_MAP[label], label }))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                  onPress={() => { setCabinClass(item.label); setClassModalVisible(false); }}
                >
                  <Feather name="layers" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                  <Text style={[styles.autocompleteText, !isDarkMode && { color: "#FFFFFF" }]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setClassModalVisible(false)}>
              <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(255, 255, 255, 0.75)" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={currencyModalVisible} transparent animationType="fade" statusBarTranslucent={true} navigationBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDestinationContent,
              !isDarkMode && {
                backgroundColor: "rgba(100, 100, 100, 0.82)",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}
          >
            <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#FFFFFF" }]}>
              Selecione o Tipo de Moeda
            </Text>
            <FlatList
              data={["BRL", "USD", "EUR", "AED", "GBP"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                  onPress={() => { setCurrency(item); setCurrencyModalVisible(false); }}
                >
                  <Feather name="dollar-sign" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                  <Text style={[styles.autocompleteText, !isDarkMode && { color: "#FFFFFF" }]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setCurrencyModalVisible(false)}>
              <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(255, 255, 255, 0.75)" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={calendarModalVisible} transparent animationType="fade" statusBarTranslucent={true} navigationBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              !isDarkMode && {
                backgroundColor: "rgba(100, 100, 100, 0.82)",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}
          >
            <View style={styles.calendarSelectorRow}>
              <TouchableOpacity
                style={[styles.calendarNavButton, !isDarkMode && { backgroundColor: "rgba(255, 255, 255, 0.15)" }]}
                onPress={() => changeMonth(-1)}
              >
                <Feather name="chevron-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={[styles.calendarTitleText, !isDarkMode && { color: "#FFFFFF" }]}>
                {MONTH_NAMES[currentCalendarMonth]} {currentCalendarYear}
              </Text>
              <TouchableOpacity
                style={[styles.calendarNavButton, !isDarkMode && { backgroundColor: "rgba(255, 255, 255, 0.15)" }]}
                onPress={() => changeMonth(1)}
              >
                <Feather name="chevron-right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarHeaderRow}>
              {WEEKDAYS.map((day, i) => (
                <Text key={i} style={[styles.calendarHeaderCell, !isDarkMode && { color: "rgba(255, 255, 255, 0.7)" }]}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((item, index) => {
                const today = new Date(); today.setHours(0, 0, 0, 0);
                const cellDate = new Date(currentCalendarYear, currentCalendarMonth, Number(item.dayStr));
                const isPast = !item.isEmpty && cellDate < today;
                const fullDate = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${item.dayStr}`;
                const isSelected = !item.isEmpty &&
                  (calendarTarget === "IDA" ? departDate : returnDate) === fullDate;
                return (
                  <TouchableOpacity
                    key={index}
                    disabled={item.isEmpty || isPast}
                    style={[
                      styles.calendarDay,
                      isSelected && [styles.calendarDayActive, { backgroundColor: currentTheme.accent }],
                    ]}
                    onPress={() => handleSelectDay(item.dayStr)}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      !isDarkMode && { color: "#FFFFFF" },
                      isSelected && styles.calendarDayTextActive,
                      isPast && (styles.calendarDayTextDisabled || { color: "rgba(255, 255, 255, 0.35)" }),
                      item.isEmpty && styles.calendarDayTextEmpty,
                    ]}>
                      {item.dayStr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setCalendarModalVisible(false)}>
              <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#6B7280" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}
