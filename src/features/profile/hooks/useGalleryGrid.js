import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { State } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function useGalleryGrid(highlightPhotoIndex) {
  const [columns, setColumns] = useState(3);
  const [isPinching, setIsPinching] = useState(false);

  const lastChangeTime = useRef(0);
  const pinchRef = useRef(null);
  const flatListRef = useRef(null);
  const pinchScale = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(1)).current;
  const borderBlinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("@gallery_grid_columns")
      .then((saved) => {
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (parsed >= 1 && parsed <= 4) {
            setColumns(parsed);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (highlightPhotoIndex !== undefined && highlightPhotoIndex !== null) {
      Animated.sequence([
        Animated.timing(borderBlinkAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(borderBlinkAnim, {
          toValue: 0.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(borderBlinkAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(borderBlinkAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [highlightPhotoIndex, borderBlinkAnim]);

  const triggerTransitionAnimation = useCallback(() => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch {}
    Animated.sequence([
      Animated.timing(gridOpacity, {
        toValue: 0.82,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [gridOpacity]);

  const handlePinchGesture = useCallback((event) => {
    const { scale } = event.nativeEvent;
    pinchScale.setValue(scale);

    const now = Date.now();
    if (now - lastChangeTime.current < 260) return;

    if (scale > 1.14) {
      setColumns((prev) => {
        if (prev > 1) {
          lastChangeTime.current = now;
          triggerTransitionAnimation();
          const next = prev - 1;
          AsyncStorage.setItem("@gallery_grid_columns", String(next)).catch(() => {});
          return next;
        }
        return prev;
      });
    } else if (scale < 0.86) {
      setColumns((prev) => {
        if (prev < 4) {
          lastChangeTime.current = now;
          triggerTransitionAnimation();
          const next = prev + 1;
          AsyncStorage.setItem("@gallery_grid_columns", String(next)).catch(() => {});
          return next;
        }
        return prev;
      });
    }
  }, [pinchScale, triggerTransitionAnimation]);

  const handlePinchStateChange = useCallback((event) => {
    const { state } = event.nativeEvent;
    if (state === State.ACTIVE) {
      setIsPinching(true);
      lastChangeTime.current = 0;
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      setIsPinching(false);
      Animated.spring(pinchScale, {
        toValue: 1,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }).start();
      lastChangeTime.current = 0;
    }
  }, [pinchScale]);

  const itemDimensions = useMemo(() => {
    const pad = 16;
    if (columns === 1) {
      const w = SCREEN_WIDTH - pad * 2;
      return {
        itemWidth: w,
        itemHeight: Math.round(w * 0.75),
        gap: 14,
        borderRadius: 16,
      };
    }
    if (columns === 2) {
      const g = 12;
      const w = (SCREEN_WIDTH - pad * 2 - g) / 2;
      return {
        itemWidth: w,
        itemHeight: w,
        gap: g,
        borderRadius: 14,
      };
    }
    if (columns === 3) {
      const g = 8;
      const w = (SCREEN_WIDTH - pad * 2 - g * 2) / 3;
      return {
        itemWidth: w,
        itemHeight: w,
        gap: g,
        borderRadius: 10,
      };
    }
    const g = 6;
    const w = (SCREEN_WIDTH - pad * 2 - g * 3) / 4;
    return {
      itemWidth: w,
      itemHeight: w,
      gap: g,
      borderRadius: 6,
    };
  }, [columns]);

  return {
    columns,
    itemDimensions,
    pinchRef,
    flatListRef,
    isPinching,
    gridOpacity,
    pinchScale,
    borderBlinkAnim,
    handlePinchGesture,
    handlePinchStateChange,
  };
}
