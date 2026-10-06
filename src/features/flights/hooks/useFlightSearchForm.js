import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Platform, Keyboard } from "react-native";
import { searchFlights, getAirportsApi } from "../api/flightApi";

export function useFlightSearchForm({ selectedItem, currentTheme }) {
  const getPresetDates = () => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(today.getDate() + 1);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + 30);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { defaultDeparture: fmt(dep), defaultReturning: fmt(ret) };
  };

  const { defaultDeparture, defaultReturning } = useMemo(() => getPresetDates(), []);

  const formatDateDisplay = useCallback((dateStr) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }, []);

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
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [childrenAges, setChildrenAges] = useState([]);
  const [childAgeModalVisible, setChildAgeModalVisible] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [cabinClass, setCabinClass] = useState("Econômica");
  const [currency, setCurrency] = useState("BRL");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("IDA");

  const scrollViewRef = useRef(null);

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

  const scrollToOffset = useCallback((offset) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }, 200);
  }, []);

  const headerImageSource = useMemo(() => {
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
          selectedItem?.iata ||
          selectedItem?.nearestAirportIata ||
          selectedItem?.nearest_airport_iata ||
          selectedItem?.nearestAirport?.iataCode;

        let match = null;
        if (targetIata) {
          const upperIata = String(targetIata).trim().toUpperCase();
          match = airports.find(
            (a) =>
              (a.codigo_iata && a.codigo_iata.toUpperCase() === upperIata) ||
              (a.iataCode && a.iataCode.toUpperCase() === upperIata)
          );
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
      } catch {
        if (isMounted) setError(true);
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
      (originAirport && originInput === `${originAirport.nome_aeroporto || originAirport.name} (${originAirport.codigo_iata || originAirport.iataCode})`)
    ) {
      setOriginSuggestions([]);
      return;
    }
    const query = originInput.trim().toLowerCase();
    const matches = allAirports
      .filter(
        (item) =>
          (item.nome_aeroporto && item.nome_aeroporto.toLowerCase().includes(query)) ||
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.cidade && item.cidade.toLowerCase().includes(query)) ||
          (item.city && item.city.toLowerCase().includes(query)) ||
          (item.codigo_iata && item.codigo_iata.toLowerCase().includes(query)) ||
          (item.iataCode && item.iataCode.toLowerCase().includes(query))
      )
      .slice(0, 5);
    setOriginSuggestions(matches);
  }, [originInput, originAirport, allAirports]);

  const handleAdultsChange = useCallback((text) => {
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
  }, [children]);

  const handleChildrenChange = useCallback((text) => {
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
  }, [adults]);

  const handleSearchFlights = useCallback(async () => {
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
        fromIata: originAirport.codigo_iata || originAirport.iataCode,
        toIata: destinationAirport.codigo_iata || destinationAirport.iataCode,
        departDate,
        returnDate: tripType === "ROUND_TRIP" ? returnDate : null,
        adults: adults || "1",
        children: childrenAges.length > 0 ? childrenAges.join(",") : "0",
        cabinClass,
        currency,
        sort: sortOption,
        onlyDirect,
      });
      setTickets(result || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [
    originAirport,
    destinationAirport,
    departDate,
    returnDate,
    tripType,
    adults,
    childrenAges,
    cabinClass,
    currency,
    sortOption,
    onlyDirect,
    scrollToOffset,
  ]);

  const handleOpenCalendar = useCallback((target) => {
    setCalendarTarget(target);
    setCalendarModalVisible(true);
  }, []);

  return {
    originInput,
    setOriginInput,
    originAirport,
    setOriginAirport,
    originSuggestions,
    setOriginSuggestions,
    loadingOrigin,
    setLoadingOrigin,
    destinationAirport,
    setDestinationAirport,
    destinationOptions,
    loadingDestination,
    destinationModalVisible,
    setDestinationModalVisible,
    classModalVisible,
    setClassModalVisible,
    currencyModalVisible,
    setCurrencyModalVisible,
    sortModalVisible,
    setSortModalVisible,
    calendarModalVisible,
    setCalendarModalVisible,
    calendarTarget,
    childAgeModalVisible,
    setChildAgeModalVisible,
    selectedChildIndex,
    setSelectedChildIndex,
    departDate,
    setDepartDate,
    returnDate,
    setReturnDate,
    tripType,
    setTripType,
    sortOption,
    setSortOption,
    onlyDirect,
    setOnlyDirect,
    adults,
    children,
    childrenAges,
    setChildrenAges,
    cabinClass,
    setCabinClass,
    currency,
    setCurrency,
    formErrors,
    setFormErrors,
    searchSubmitted,
    setSearchSubmitted,
    tickets,
    loading,
    error,
    handleAdultsChange,
    handleChildrenChange,
    handleSearchFlights,
    handleOpenCalendar,
    formatDateDisplay,
    scrollViewRef,
    keyboardPadding,
    scrollToOffset,
    headerImageSource,
  };
}
