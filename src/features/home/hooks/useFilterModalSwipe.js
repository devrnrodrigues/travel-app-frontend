import { useRef, useEffect, useCallback } from "react";
import { Animated, PanResponder, Dimensions, Easing } from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Math.max(
  WINDOW_HEIGHT,
  Dimensions.get("screen").height || 0,
  900
);
const MODAL_DISMISS_OFFSET = SCREEN_HEIGHT + 50;

export default function useFilterModalSwipe(visible, onClose) {
  const slideAnim = useRef(new Animated.Value(MODAL_DISMISS_OFFSET)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isClosingModal = useRef(false);

  useEffect(() => {
    if (visible) {
      isClosingModal.current = false;
      slideAnim.setValue(MODAL_DISMISS_OFFSET);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleCloseModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: MODAL_DISMISS_OFFSET,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  }, [slideAnim, fadeAnim, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
          const fraction = Math.max(0, 1 - gestureState.dy / 300);
          fadeAnim.setValue(fraction);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseModal();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              damping: 24,
              stiffness: 220,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return {
    slideAnim,
    fadeAnim,
    panResponder,
    handleCloseModal,
  };
}
