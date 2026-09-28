import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  ActivityIndicator, TextInput, ImageBackground, StyleSheet,
  Animated, BackHandler, Easing, KeyboardAvoidingView, Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { searchFlights, CABIN_CLASS_MAP, SORT_MAP, getAirportsApi } from "../api/flightApi";
import FlightResults from "./FlightResultsScreen";
import styles from "../flightSearch.styles";
import { useTheme } from "../../../theme/ThemeContext";
import FadeInView from "../../../shared/components/FadeInView";
import {
  DestinationModal,
  CabinClassModal,
  CurrencyModal,
  CalendarModal,
  SortModal,
  ChildAgeModal,
  CURRENCY_MAP,
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

  const formatDateDisplay = (dateStr) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

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
  const [tripType, setTripType] = useState("ROUND_TRIP");
  const [sortOption, setSortOption] = useState("Mais Econômico");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [onlyDirect, setOnlyDirect] = useState(false);
  const directAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(directAnim, {
      toValue: onlyDirect ? 1 : 0,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [onlyDirect]);

  const switchTrackBg = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      !isDarkMode ? "#E5E7EB" : "#27272A",
      currentTheme.accent,
    ],
  });

  const switchThumbTranslate = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const switchThumbBg = directAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      !isDarkMode ? "#FFFFFF" : "#A1A1AA",
      "#000000",
    ],
  });
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [childrenAges, setChildrenAges] = useState([]);
  const [childAgeModalVisible, setChildAgeModalVisible] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates?.height || 280;
      setKeyboardPadding(height + 40);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardPadding(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToOffset = (offset) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }, 200);
  };

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
      if (sortModalVisible) {
        setSortModalVisible(false);
        return true;
      }
      if (childAgeModalVisible) {
        setChildAgeModalVisible(false);
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
  }, [searchSubmitted, destinationModalVisible, classModalVisible, currencyModalVisible, calendarModalVisible, sortModalVisible, childAgeModalVisible]);

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

  const handleAdultsChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (cleanText === "") {
      setAdults("");
      return;
    }
    let val = parseInt(cleanText, 10);
    const childCount = parseInt(children, 10) || 0;
    const maxAdults = Math.max(1, 9 - childCount);
    if (val > maxAdults) {
      val = maxAdults;
    }
    if (val < 1) {
      val = 1;
    }
    setAdults(String(val));
    setFormErrors((prev) => ({ ...prev, adults: null }));

    const maxChildren = Math.max(0, 9 - val);
    if (childCount > maxChildren) {
      setChildren(String(maxChildren));
      setChildrenAges((prev) => prev.slice(0, maxChildren));
    }
  };

  const handleChildrenChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (cleanText === "") {
      setChildren("");
      setChildrenAges([]);
      return;
    }
    const adultCount = parseInt(adults, 10) || 1;
    const maxChildren = Math.max(0, 9 - adultCount);
    let count = parseInt(cleanText, 10);
    if (count > maxChildren) {
      count = maxChildren;
    }
    setChildren(String(count));
    setChildrenAges((prev) => {
      const next = [];
      for (let i = 0; i < count; i++) {
        next.push(prev[i] !== undefined ? prev[i] : 7);
      }
      return next;
    });
    setFormErrors((prev) => ({ ...prev, children: null }));
  };

  const handleSearchFlights = async () => {
    const errors = {};
    if (!originAirport) {
      errors.origin = "Preencha o aeroporto de origem";
    }
    if (!destinationAirport) {
      errors.destination = "Preencha o aeroporto de destino";
    }
    if (!departDate) {
      errors.departDate = "Preencha a data de ida";
    }
    if (tripType === "ROUND_TRIP" && !returnDate) {
      errors.returnDate = "Preencha a data de volta";
    }
    const adultCount = parseInt(adults, 10) || 0;
    if (adultCount < 1) {
      errors.adults = "Mínimo de 1 adulto";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.origin) {
        scrollToOffset(70);
      } else if (errors.destination) {
        scrollToOffset(140);
      } else if (errors.departDate || errors.returnDate) {
        scrollToOffset(220);
      } else if (errors.adults) {
        scrollToOffset(tripType === "ROUND_TRIP" ? 360 : 300);
      }
      return;
    }
    setFormErrors({});
    setSearchSubmitted(true);
    setLoading(true);
    setError(false);
    setTickets([]);
    try {
      const result = await searchFlights({
        fromIata: originAirport.codigo_iata,
        toIata: destinationAirport.codigo_iata,
        departDate,
        returnDate: tripType === "ROUND_TRIP" ? returnDate : null,
        adults: adults || "1",
        children: childrenAges.length > 0 ? childrenAges.join(",") : "0",
        cabinClass,
        currency,
        sort: sortOption,
        onlyDirect,
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flex1}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.flex1}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardPadding }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets={true}
            >
              <View style={[styles.tripTypeContainer, !isDarkMode && styles.tripTypeContainerLight]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.tripTypeTab,
                    tripType === "ROUND_TRIP" && { backgroundColor: currentTheme.accent },
                  ]}
                  onPress={() => setTripType("ROUND_TRIP")}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      tripType === "ROUND_TRIP"
                        ? { color: "#000000", fontWeight: "700" }
                        : !isDarkMode ? { color: "#6B7280" } : { color: "#8E8E93" },
                    ]}
                  >
                    Ida e Volta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.tripTypeTab,
                    tripType === "ONE_WAY" && { backgroundColor: currentTheme.accent },
                  ]}
                  onPress={() => setTripType("ONE_WAY")}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      tripType === "ONE_WAY"
                        ? { color: "#000000", fontWeight: "700" }
                        : !isDarkMode ? { color: "#6B7280" } : { color: "#8E8E93" },
                    ]}
                  >
                    Somente Ida
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>Aeroporto de Origem</Text>
              <View
                style={[
                  styles.inputSearchContainer,
                  formErrors.origin && { borderColor: "#EF4444", borderWidth: 1, borderRadius: 16, marginBottom: 4 },
                ]}
              >
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
                  onChangeText={(text) => {
                    setOriginInput(text);
                    if (!text) setOriginAirport(null);
                    setFormErrors((prev) => ({ ...prev, origin: null }));
                  }}
                  placeholder="Ex: São Paulo"
                  placeholderTextColor={!isDarkMode ? "#9CA3AF" : "#8E8E93"}
                  onFocus={() => scrollToOffset(70)}
                />
                {loadingOrigin && (
                  <ActivityIndicator size="small" color={currentTheme.accent} style={styles.inputSpinner} />
                )}
              </View>
              {formErrors.origin && (
                <Text style={styles.fieldErrorText}>{formErrors.origin}</Text>
              )}
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
                        setFormErrors((prev) => ({ ...prev, origin: null }));
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
                  formErrors.destination && { borderColor: "#EF4444", borderWidth: 1, marginBottom: 4 },
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: formErrors.destination ? 1 : 0,
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
              {formErrors.destination && (
                <Text style={styles.fieldErrorText}>{formErrors.destination}</Text>
              )}

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>DATA DE IDA</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectContainerRow,
                  formErrors.departDate && { borderColor: "#EF4444", borderWidth: 1, marginBottom: 4 },
                  !isDarkMode && {
                    backgroundColor: "#F7F8F9",
                    borderWidth: formErrors.departDate ? 1 : 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  },
                ]}
                onPress={() => handleOpenCalendar("IDA")}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>
                  {departDate ? formatDateDisplay(departDate) : "Selecione a data"}
                </Text>
                <Feather name="calendar" size={18} color="#8E8E93" />
              </TouchableOpacity>
              {formErrors.departDate && (
                <Text style={styles.fieldErrorText}>{formErrors.departDate}</Text>
              )}

              {tripType === "ROUND_TRIP" && (
                <>
                  <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>DATA DE VOLTA</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.selectContainerRow,
                      formErrors.returnDate && { borderColor: "#EF4444", borderWidth: 1, marginBottom: 4 },
                      !isDarkMode && {
                        backgroundColor: "#F7F8F9",
                        borderWidth: formErrors.returnDate ? 1 : 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        elevation: 1,
                      },
                    ]}
                    onPress={() => handleOpenCalendar("VOLTA")}
                  >
                    <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>
                      {returnDate ? formatDateDisplay(returnDate) : "Selecione a data"}
                    </Text>
                    <Feather name="calendar" size={18} color="#8E8E93" />
                  </TouchableOpacity>
                  {formErrors.returnDate && (
                    <Text style={styles.fieldErrorText}>{formErrors.returnDate}</Text>
                  )}
                </>
              )}

              <View style={styles.rowInputs}>
                <View style={styles.inputCol}>
                  <Text style={[styles.labelCol, !isDarkMode && { color: "#6B7280", fontWeight: "800" }]}>ADULTOS</Text>
                  <TextInput
                    style={[
                      styles.inputCenter,
                      formErrors.adults && { borderColor: "#EF4444", borderWidth: 1 },
                      !isDarkMode && {
                        backgroundColor: "#F7F8F9",
                        color: "#111827",
                        borderWidth: formErrors.adults ? 1 : 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        elevation: 1,
                      },
                    ]}
                    value={adults}
                    onChangeText={handleAdultsChange}
                    keyboardType="numeric"
                    onFocus={() => scrollToOffset(tripType === "ROUND_TRIP" ? 360 : 300)}
                  />
                  {formErrors.adults && (
                    <Text style={[styles.fieldErrorText, { textAlign: "center", marginTop: 4, marginBottom: 0 }]}>
                      {formErrors.adults}
                    </Text>
                  )}
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
                    onChangeText={handleChildrenChange}
                    keyboardType="numeric"
                    onFocus={() => scrollToOffset(tripType === "ROUND_TRIP" ? 400 : 340)}
                  />
                </View>
              </View>

              {(parseInt(adults, 10) || 0) + (parseInt(children, 10) || 0) >= 9 && (
                <Text style={styles.fieldLimitNotice}>
                  Limite máximo de 9 passageiros atingido (adultos + crianças).
                </Text>
              )}

              {childrenAges.length > 0 && (
                <View style={styles.childrenAgesWrapper}>
                  <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>
                    IDADE DAS CRIANÇAS
                  </Text>
                  <View style={styles.childrenAgesGrid}>
                    {childrenAges.map((age, idx) => (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        style={[
                          styles.childAgeCard,
                          !isDarkMode && styles.childAgeCardLight,
                        ]}
                        onPress={() => {
                          setSelectedChildIndex(idx);
                          setChildAgeModalVisible(true);
                        }}
                      >
                        <Text style={styles.childAgeCardLabel}>Criança {idx + 1}</Text>
                        <View style={styles.childAgeValueRow}>
                          <Text style={[styles.childAgeCardValue, !isDarkMode && { color: "#111827" }]}>
                            {age === 0 ? "Menos de 1 ano" : `${age} ${age === 1 ? "ano" : "anos"}`}
                          </Text>
                          <Feather name="chevron-down" size={16} color={!isDarkMode ? "#6B7280" : "#8E8E93"} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={[styles.inputLabel, !isDarkMode && { color: "#111827", fontWeight: "800" }]}>CRITÉRIO DE BUSCA</Text>
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
                onPress={() => setSortModalVisible(true)}
                activeOpacity={0.6}
              >
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>{sortOption}</Text>
                <Feather name="chevron-down" size={18} color="#8E8E93" />
              </TouchableOpacity>

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
                <Text style={[styles.inputText, !isDarkMode && { color: "#111827" }]}>
                  {`${currency} (${CURRENCY_MAP[currency] || currency})`}
                </Text>
                <Feather name="chevron-down" size={18} color="#8E8E93" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOnlyDirect((prev) => !prev)}
                style={[
                  styles.directToggleContainer,
                  !isDarkMode && styles.directToggleContainerLight,
                ]}
              >
                <View style={styles.directToggleLeft}>
                  <Feather
                    name="send"
                    size={16}
                    color={onlyDirect ? currentTheme.accent : (!isDarkMode ? "#6B7280" : "#8E8E93")}
                  />
                  <Text style={[styles.directToggleText, !isDarkMode && { color: "#111827" }]}>
                    Apenas voos diretos
                  </Text>
                </View>
                <Animated.View
                  style={[
                    styles.switchTrack,
                    { backgroundColor: switchTrackBg },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [{ translateX: switchThumbTranslate }],
                        backgroundColor: switchThumbBg,
                      },
                    ]}
                  />
                </Animated.View>
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
          </KeyboardAvoidingView>
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
        onSelectAirport={(airport) => {
          setDestinationAirport(airport);
          setFormErrors((prev) => ({ ...prev, destination: null }));
        }}
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
          if (target === "IDA") {
            setDepartDate(newDate);
            setFormErrors((prev) => ({ ...prev, departDate: null }));
          } else {
            setReturnDate(newDate);
            setFormErrors((prev) => ({ ...prev, returnDate: null }));
          }
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelectSort={setSortOption}
        sortMap={SORT_MAP}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
      <ChildAgeModal
        visible={childAgeModalVisible}
        onClose={() => setChildAgeModalVisible(false)}
        childIndex={selectedChildIndex}
        currentAge={childrenAges[selectedChildIndex] !== undefined ? childrenAges[selectedChildIndex] : 7}
        onSelectAge={(newAge) => {
          setChildrenAges((prev) => {
            const next = [...prev];
            next[selectedChildIndex] = newAge;
            return next;
          });
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
    </Animated.View>
  );
}
