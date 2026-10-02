import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0, opacity: 1 },
  { transX: 6, transY: -3, rot: 5.5, scale: 0.94, dim: 0.1, opacity: 1 },
  { transX: -6, transY: -6, rot: -5.5, scale: 0.88, dim: 0.18, opacity: 1 },
  { transX: 4, transY: -9, rot: 3, scale: 0.82, dim: 0.25, opacity: 0.9 },
  { transX: -4, transY: -11, rot: -3, scale: 0.78, dim: 0.32, opacity: 0.85 },
];

const PolaroidStackCard = React.memo(function PolaroidStackCard({
  item,
  isDarkMode,
  currentTheme,
}) {
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
  }, [total]);

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

  if (!photos || total === 0) return null;

  return (
    <View style={polaroidStyles.wrapper}>
      <TouchableOpacity
        style={polaroidStyles.touchable}
        activeOpacity={0.92}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={280}
      >
        {photos.map((photo, i) => {
          const curAnim = anims[i] || {
            transX: new Animated.Value(0),
            transY: new Animated.Value(0),
            rot: new Animated.Value(0),
            scale: new Animated.Value(1),
            dim: new Animated.Value(0),
            opacity: new Animated.Value(1),
          };

          const rotDeg = curAnim.rot.interpolate({
            inputRange: [-15, 0, 15],
            outputRange: ["-15deg", "0deg", "15deg"],
          });

          return (
            <Animated.View
              key={photo.id || String(i)}
              pointerEvents="none"
              style={[
                polaroidStyles.card,
                {
                  zIndex: zIndices[i] || 1,
                  elevation: Platform.OS === "android" ? 1 : 0,
                  opacity: curAnim.opacity,
                  transform: [
                    { translateX: curAnim.transX },
                    { translateY: curAnim.transY },
                    { rotate: rotDeg },
                    { scale: curAnim.scale },
                  ],
                },
              ]}
            >
              <View style={polaroidStyles.imageBox}>
                <Image
                  source={{ uri: photo.url }}
                  style={polaroidStyles.image}
                  resizeMode="cover"
                />
                <Animated.View
                  pointerEvents="none"
                  style={[
                    polaroidStyles.dimOverlay,
                    { opacity: curAnim.dim },
                  ]}
                />
              </View>

              <View style={polaroidStyles.chinBox}>
                <Text numberOfLines={1} style={polaroidStyles.chinTitle}>
                  {item?.title || photo.caption || "Coleção"}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
});

const polaroidStyles = StyleSheet.create({
  wrapper: {
    width: 180,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  card: {
    position: "absolute",
    width: 162,
    height: 240,
    backgroundColor: "#FFFFFF",
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 4,
    borderRadius: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  imageBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2a303c",
    overflow: "hidden",
    borderRadius: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  chinBox: {
    height: 36,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  chinTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: "#1c1917",
    textAlign: "center",
    lineHeight: 21,
  },
});

export default PolaroidStackCard;
