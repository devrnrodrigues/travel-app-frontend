import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Animated, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0, opacity: 1 },
  { transX: 6, transY: -3, rot: 5.5, scale: 0.94, dim: 0.1, opacity: 1 },
  { transX: -6, transY: -6, rot: -5.5, scale: 0.88, dim: 0.18, opacity: 1 },
  { transX: 4, transY: -9, rot: 3, scale: 0.82, dim: 0.25, opacity: 0.9 },
  { transX: -4, transY: -11, rot: -3, scale: 0.78, dim: 0.32, opacity: 0.85 },
];

export default function usePolaroidStack(item) {
  const navigation = useNavigation();

  const photos = useMemo(() => {
    if (item?.photos && item.photos.length > 0) {
      return item.photos;
    }
    if (item?.coverUrl) {
      return [{ id: "cover", url: item.coverUrl, caption: item.title }];
    }
    return [
      {
        id: "fallback",
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
        caption: item?.title || "Coleção",
      },
    ];
  }, [item?.photos, item?.coverUrl, item?.title]);

  const total = photos.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [zIndices, setZIndices] = useState(() =>
    photos.map((_, i) => Math.max(1, 10 - i))
  );

  const anims = useRef(
    photos.map((_, i) => {
      const cfg =
        i < SLOT_CONFIGS.length
          ? SLOT_CONFIGS[i]
          : SLOT_CONFIGS[SLOT_CONFIGS.length - 1];
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
  }, [total, photos]);

  const handleOpenGallery = useCallback(() => {
    navigation.navigate("CollectionGallery", {
      collection: item,
      highlightPhotoIndex: currentIndex,
    });
  }, [navigation, item, currentIndex]);

  const handlePress = useCallback(
    (e) => {
      const locY = e?.nativeEvent?.locationY;
      if (typeof locY === "number" && locY > 200) {
        handleOpenGallery();
        return;
      }

      if (total <= 1) {
        handleOpenGallery();
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
        const cfg =
          offset < SLOT_CONFIGS.length
            ? SLOT_CONFIGS[offset]
            : SLOT_CONFIGS[SLOT_CONFIGS.length - 1];
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
    },
    [currentIndex, photos, total, anims, handleOpenGallery]
  );

  const handleLongPress = useCallback(() => {
    handleOpenGallery();
  }, [handleOpenGallery]);

  return {
    photos,
    total,
    zIndices,
    anims,
    handlePress,
    handleLongPress,
  };
}
