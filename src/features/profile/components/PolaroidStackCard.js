import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { styles } from "../profile.styles";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0, opacity: 1 },
  { transX: 7, transY: -4, rot: 5.5, scale: 0.94, dim: 0.12, opacity: 1 },
  { transX: -7, transY: -6, rot: -5.5, scale: 0.88, dim: 0.22, opacity: 1 },
  { transX: 0, transY: -8, rot: 0, scale: 0.82, dim: 0.3, opacity: 0 },
];

export default function PolaroidStackCard({ item, isDarkMode, currentTheme }) {
  const navigation = useNavigation();
  const [, setTick] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setTick((t) => t + 1);
    }, [])
  );
  const photos = item.photos || [];
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
      const cfg = offset < 3 ? SLOT_CONFIGS[offset] : SLOT_CONFIGS[3];
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
      const cfg = offset < 3 ? SLOT_CONFIGS[offset] : SLOT_CONFIGS[3];
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
    navigation.navigate("CollectionGallery", {
      collection: item,
      highlightPhotoIndex: currentIndex,
    });
  }, [currentIndex, navigation, item]);

  return (
    <View
      style={[
        styles.galleryCard,
        !isDarkMode && styles.galleryCardLight,
      ]}
    >
      <View style={styles.galleryCardTouch}>
        <TouchableOpacity
          style={styles.stackContainer}
          activeOpacity={0.94}
          onPress={handlePress}
          onLongPress={handleLongPress}
          delayLongPress={300}
        >
          {photos.map((photo, i) => {
            const rotDeg = anims[i].rot.interpolate({
              inputRange: [-15, 0, 15],
              outputRange: ["-15deg", "0deg", "15deg"],
            });

            return (
              <Animated.View
                key={photo.id}
                pointerEvents="none"
                style={[
                  styles.stackPhoto,
                  {
                    zIndex: zIndices[i] || 1,
                    elevation: (zIndices[i] || 1) * 2,
                    opacity: anims[i].opacity,
                    transform: [
                      { translateX: anims[i].transX },
                      { translateY: anims[i].transY },
                      { rotate: rotDeg },
                      { scale: anims[i].scale },
                    ],
                  },
                ]}
              >
                <View style={styles.photoMediaBox}>
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.photoImg}
                    resizeMode="cover"
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.photoDimOverlay,
                      { opacity: anims[i].dim },
                    ]}
                  />
                </View>
                <View style={styles.photoCaptionBox}>
                  <Text
                    numberOfLines={2}
                    style={styles.photoCaptionText}
                  >
                    {photo.caption}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </TouchableOpacity>

        <View style={styles.cardInfo}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("CollectionGallery", { collection: item })
            }
          >
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cardCounter,
              !isDarkMode && styles.cardCounterLight,
            ]}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("CollectionGallery", { collection: item })
            }
          >
            <Text
              style={[
                styles.cardCounterText,
                { color: currentTheme?.accent || (isDarkMode ? "#FFFFFF" : "#000000") },
              ]}
            >
              Abrir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
