import { useState, useRef, useCallback, useEffect } from "react";
import { Animated, Platform } from "react-native";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0, opacity: 1 },
  { transX: 5, transY: -2.5, rot: 5.5, scale: 0.94, dim: 0.1, opacity: 1 },
  { transX: -5, transY: -5, rot: -5.5, scale: 0.88, dim: 0.18, opacity: 1 },
  { transX: 3, transY: -7, rot: 3, scale: 0.82, dim: 0.25, opacity: 0.9 },
  { transX: -3, transY: -9, rot: -3, scale: 0.78, dim: 0.3, opacity: 0.85 },
];

export function usePolaroidStack(photos = [], onOpenViewer) {
  const total = photos.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [zIndices, setZIndices] = useState(() =>
    photos.map((_, i) => Math.max(1, 10 - i))
  );

  const anims = useRef(
    photos.map((_, i) => {
      const cfg = i < SLOT_CONFIGS.length ? SLOT_CONFIGS[i] : SLOT_CONFIGS[SLOT_CONFIGS.length - 1];
      return {
        transX: new Animated.Value(cfg.transX),
        transY: new Animated.Value(cfg.transY),
        rot: new Animated.Value(cfg.rot),
        scale: new Animated.Value(cfg.scale),
        dim: new Animated.Value(cfg.dim),
        opacity: new Animated.Value(cfg.opacity),
      };
    })
  ).current;

  useEffect(() => {
    setCurrentIndex(0);
    setZIndices(photos.map((_, i) => Math.max(1, 10 - i)));
  }, [total]);

  const handlePress = useCallback(() => {
    if (total <= 1) {
      if (onOpenViewer) {
        onOpenViewer(photos, 0);
      }
      return;
    }

    const nextIndex = (currentIndex + 1) % total;
    setCurrentIndex(nextIndex);

    const nextZ = photos.map((_, i) => {
      const offset = (i - nextIndex + total) % total;
      return Math.max(1, 10 - offset);
    });
    setZIndices(nextZ);

    const useNative = Platform.OS !== "web";
    const parallelAnimations = photos.map((_, i) => {
      const offset = (i - nextIndex + total) % total;
      const cfg = offset < SLOT_CONFIGS.length ? SLOT_CONFIGS[offset] : SLOT_CONFIGS[SLOT_CONFIGS.length - 1];
      const curAnim = anims[i];
      if (!curAnim) return Animated.delay(0);

      return Animated.parallel([
        Animated.spring(curAnim.transX, {
          toValue: cfg.transX,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(curAnim.transY, {
          toValue: cfg.transY,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(curAnim.rot, {
          toValue: cfg.rot,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(curAnim.scale, {
          toValue: cfg.scale,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.timing(curAnim.dim, {
          toValue: cfg.dim,
          duration: 220,
          useNativeDriver: useNative,
        }),
        Animated.timing(curAnim.opacity, {
          toValue: cfg.opacity,
          duration: 220,
          useNativeDriver: useNative,
        }),
      ]);
    });

    Animated.parallel(parallelAnimations).start();
  }, [currentIndex, photos, total, anims]);

  const handleLongPress = useCallback(() => {
    if (onOpenViewer) {
      onOpenViewer(photos, currentIndex);
    }
  }, [photos, currentIndex, onOpenViewer]);

  return {
    total,
    currentIndex,
    zIndices,
    anims,
    handlePress,
    handleLongPress,
  };
}

export default usePolaroidStack;
