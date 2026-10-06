import { useState, useEffect, useRef, useCallback } from "react";
import { Animated, Easing } from "react-native";

export const BREAKDOWN_CONFIG = [
  {
    key: "hotel_per_room",
    title: "Hospedagem",
  },
  {
    key: "food",
    title: "Alimentação",
  },
  {
    key: "activities",
    title: "Passeios",
  },
  {
    key: "transport",
    title: "Transporte local",
  },
];

export function useEstimatedPriceModal({ visible, onClose, data, currentTheme }) {
  const [modalRendered, setModalRendered] = useState(visible);
  const [showHotelInfo, setShowHotelInfo] = useState(false);
  const hotelInfoAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleHotelInfo = useCallback(() => {
    if (!showHotelInfo) {
      setShowHotelInfo(true);
      Animated.timing(hotelInfoAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(hotelInfoAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        setShowHotelInfo(false);
      });
    }
  }, [showHotelInfo, hotelInfoAnim]);

  useEffect(() => {
    if (visible) {
      setModalRendered(true);
      setShowHotelInfo(false);
      hotelInfoAnim.setValue(0);
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalRendered) {
      setShowHotelInfo(false);
      hotelInfoAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalRendered(false);
      });
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setShowHotelInfo(false);
    hotelInfoAnim.setValue(0);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalRendered(false);
      onClose();
    });
  }, [hotelInfoAnim, scaleAnim, opacityAnim, onClose]);

  const accentColor = currentTheme?.accent || "#3B82F6";
  const seasonText =
    data?.estimated_for?.season === "typical"
      ? "temporada típica"
      : data?.estimated_for?.season || "temporada típica";

  return {
    modalRendered,
    showHotelInfo,
    hotelInfoAnim,
    scaleAnim,
    opacityAnim,
    toggleHotelInfo,
    handleClose,
    accentColor,
    seasonText,
  };
}

export default useEstimatedPriceModal;
