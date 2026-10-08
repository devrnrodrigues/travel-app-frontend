import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Animated,
  PanResponder,
  Keyboard,
  Dimensions,
  Easing,
} from "react-native";
import { ALL_COUNTRIES } from "../data/countries";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Math.max(
  WINDOW_HEIGHT,
  Dimensions.get("screen").height || 0,
  900
);
const MODAL_DISMISS_OFFSET = SCREEN_HEIGHT + 50;
const COUNTRIES_PAGE_SIZE = 20;

export default function useEditProfileModal({
  visible,
  onClose,
  isDarkMode,
  toggleThemeMode,
  nationality,
  setNationality,
}) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSearchingCountry, setIsSearchingCountry] = useState(false);
  const [hasTypedNationality, setHasTypedNationality] = useState(false);
  const [countryPage, setCountryPage] = useState(1);
  const [isThemeLoading, setIsThemeLoading] = useState(false);

  const blurTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isClosingModal = useRef(false);

  const countryListAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(MODAL_DISMISS_OFFSET)).current;
  const iconRotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  const isNationalityFocused = focusedInput === "nationality";

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.timing(countryListAnim, {
      toValue: isNationalityFocused ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isNationalityFocused, countryListAnim]);

  const countryListHeight = countryListAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48],
  });

  const countryListOpacity = countryListAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const countryListMargin = countryListAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  useEffect(() => {
    Animated.timing(iconRotateAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode, iconRotateAnim]);

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (visible) {
      isClosingModal.current = false;
      modalSlideAnim.setValue(MODAL_DISMISS_OFFSET);
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, modalSlideAnim]);

  const handleCloseModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;
    Keyboard.dismiss();
    Animated.timing(modalSlideAnim, {
      toValue: MODAL_DISMISS_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  }, [modalSlideAnim, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseModal();
        } else {
          Animated.spring(modalSlideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNationalityFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setHasTypedNationality(false);
    setFocusedInput("nationality");
  }, []);

  const handleNationalityBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setFocusedInput((prev) => (prev === "nationality" ? null : prev));
    }, 200);
  }, []);

  const handleNationalityChange = useCallback((text) => {
    setHasTypedNationality(true);
    setNationality(text);
    setIsSearchingCountry(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearchingCountry(false);
    }, 180);
  }, [setNationality]);

  const handleSelectCountry = useCallback((label) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setNationality(label);
    setHasTypedNationality(false);
  }, [setNationality]);

  const filteredCountries = useMemo(() => {
    if (!hasTypedNationality) {
      return ALL_COUNTRIES;
    }
    const query = (nationality || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!query) {
      return ALL_COUNTRIES;
    }

    return ALL_COUNTRIES.filter((item) => {
      const labelNorm = item.label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const countryNorm = item.country
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return labelNorm.includes(query) || countryNorm.includes(query);
    });
  }, [nationality, hasTypedNationality]);

  useEffect(() => {
    setCountryPage(1);
  }, [nationality, hasTypedNationality]);

  const paginatedCountries = useMemo(() => {
    return filteredCountries.slice(0, countryPage * COUNTRIES_PAGE_SIZE);
  }, [filteredCountries, countryPage]);

  const handleLoadMoreCountries = useCallback(() => {
    if (paginatedCountries.length < filteredCountries.length) {
      setCountryPage((prev) => prev + 1);
    }
  }, [paginatedCountries.length, filteredCountries.length]);

  const handleToggleTheme = useCallback(async () => {
    if (isThemeLoading) return;
    setIsThemeLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await toggleThemeMode();
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch (e) {
      console.error(e);
    } finally {
      setIsThemeLoading(false);
    }
  }, [isThemeLoading, toggleThemeMode]);

  return {
    focusedInput,
    setFocusedInput,
    isNationalityFocused,
    isSearchingCountry,
    hasTypedNationality,
    countryListHeight,
    countryListOpacity,
    countryListMargin,
    paginatedCountries,
    filteredCountries,
    handleNationalityFocus,
    handleNationalityBlur,
    handleNationalityChange,
    handleSelectCountry,
    handleLoadMoreCountries,
    modalSlideAnim,
    handleCloseModal,
    panResponder,
    iconRotation,
    isThemeLoading,
    handleToggleTheme,
  };
}
