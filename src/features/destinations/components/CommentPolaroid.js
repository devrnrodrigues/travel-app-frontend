import React, { useState, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0, opacity: 1 },
  { transX: 5, transY: -2.5, rot: 5, scale: 0.94, dim: 0.1, opacity: 1 },
  { transX: -5, transY: -5, rot: -5, scale: 0.88, dim: 0.18, opacity: 1 },
];

export const MOCK_COMMENT_PHOTOS = [
  {
    id: "cp1",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: "cp2",
    url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: "cp3",
    url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1000&auto=format&fit=crop&q=80",
  },
];

export default function CommentPolaroid({
  photos = MOCK_COMMENT_PHOTOS,
  onOpenViewer,
}) {
  const total = photos.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [zIndices, setZIndices] = useState(() =>
    photos.map((_, i) => {
      const offset = (i + total) % total;
      if (offset === 0) return 10;
      if (offset === 1) return 9;
      if (offset === 2) return 8;
      return 1;
    })
  );

  const anims = useRef(
    photos.map((_, i) => {
      const offset = (i + total) % total;
      const cfg = offset < 3 ? SLOT_CONFIGS[offset] : SLOT_CONFIGS[2];
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

  const handlePress = useCallback(() => {
    if (total <= 1) return;

    const nextIndex = (currentIndex + 1) % total;
    setCurrentIndex(nextIndex);

    const nextZ = photos.map((_, i) => {
      const offset = (i - nextIndex + total) % total;
      if (offset === 0) return 10;
      if (offset === 1) return 9;
      if (offset === 2) return 8;
      return 1;
    });
    setZIndices(nextZ);

    const useNative = Platform.OS !== "web";
    const parallelAnimations = photos.map((_, i) => {
      const offset = (i - nextIndex + total) % total;
      const cfg = offset < 3 ? SLOT_CONFIGS[offset] : SLOT_CONFIGS[2];
      return Animated.parallel([
        Animated.spring(anims[i].transX, {
          toValue: cfg.transX,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(anims[i].transY, {
          toValue: cfg.transY,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(anims[i].rot, {
          toValue: cfg.rot,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.spring(anims[i].scale, {
          toValue: cfg.scale,
          friction: 7,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.timing(anims[i].dim, {
          toValue: cfg.dim,
          duration: 220,
          useNativeDriver: useNative,
        }),
        Animated.timing(anims[i].opacity, {
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
                  elevation: zIndices[i] === 10 ? 2 : 1,
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
            </Animated.View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
}

const polaroidStyles = StyleSheet.create({
  wrapper: {
    width: 80,
    height: 98,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 2,
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
    width: 70,
    height: 86,
    backgroundColor: "#FFFFFF",
    paddingTop: 3.5,
    paddingHorizontal: 3.5,
    paddingBottom: 10,
    borderRadius: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
  },
  imageBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2a303c",
    overflow: "hidden",
    borderRadius: 1,
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
});
