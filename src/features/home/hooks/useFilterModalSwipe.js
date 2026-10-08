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
  const isClosingModal = useRef(false);

  useEffect(() => {
    if (visible) {
      isClosingModal.current = false;
      slideAnim.setValue(MODAL_DISMISS_OFFSET);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleCloseModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;
    Animated.timing(slideAnim, {
      toValue: MODAL_DISMISS_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  }, [slideAnim, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return {
    slideAnim,
    panResponder,
    handleCloseModal,
  };
}
