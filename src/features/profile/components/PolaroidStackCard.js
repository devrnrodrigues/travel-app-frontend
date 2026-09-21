import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from "react-native";
import { styles } from "../profile.styles";

const SLOT_CONFIGS = [
  { transX: 0, transY: 0, rot: 0, scale: 1, dim: 0 },
  { transX: 10, transY: -5, rot: 9, scale: 0.92, dim: 0.12 },
  { transX: -10, transY: -8, rot: -9, scale: 0.86, dim: 0.22 },
];

export default function PolaroidStackCard({ item, isDarkMode, currentTheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zIndices, setZIndices] = useState([3, 2, 1]);

  const cardScale = useRef(new Animated.Value(1)).current;

  const anims = useRef(
    item.photos.map((_, i) => {
      const cfg = SLOT_CONFIGS[i % 3];
      return {
        transX: new Animated.Value(cfg.transX),
        transY: new Animated.Value(cfg.transY),
        rot: new Animated.Value(cfg.rot),
        scale: new Animated.Value(cfg.scale),
        dim: new Animated.Value(cfg.dim),
      };
    })
  ).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const nextIndex = (currentIndex + 1) % 3;
    setCurrentIndex(nextIndex);

    const nextZ = item.photos.map((_, i) => {
      const slot = (i + nextIndex) % 3;
      if (slot === 0) return 3;
      if (slot === 1) return 2;
      return 1;
    });
    setZIndices(nextZ);

    const parallelAnimations = item.photos.map((_, i) => {
      const slot = (i + nextIndex) % 3;
      const cfg = SLOT_CONFIGS[slot];
      return Animated.parallel([
        Animated.spring(anims[i].transX, {
          toValue: cfg.transX,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(anims[i].transY, {
          toValue: cfg.transY,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(anims[i].rot, {
          toValue: cfg.rot,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(anims[i].scale, {
          toValue: cfg.scale,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anims[i].dim, {
          toValue: cfg.dim,
          duration: 220,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(parallelAnimations).start();
  }, [currentIndex, item.photos, anims, cardScale]);

  return (
    <Animated.View
      style={[
        styles.galleryCard,
        !isDarkMode && styles.galleryCardLight,
        { transform: [{ scale: cardScale }] },
      ]}
    >
      <View style={styles.galleryCardTouch}>
        <TouchableOpacity
          style={styles.stackContainer}
          activeOpacity={0.94}
          onPress={handlePress}
        >
          {item.photos.map((photo, i) => {
            const rotDeg = anims[i].rot.interpolate({
              inputRange: [-15, 0, 15],
              outputRange: ["-15deg", "0deg", "15deg"],
            });

            return (
              <Animated.View
                key={photo.id}
                style={[
                  styles.stackPhoto,
                  {
                    zIndex: zIndices[i],
                    elevation: zIndices[i] * 2,
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
                  <Text numberOfLines={1} style={styles.photoCaptionText}>
                    {photo.caption}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </TouchableOpacity>

        <View style={styles.cardInfo}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={[
              styles.cardCounter,
              !isDarkMode && styles.cardCounterLight,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.cardCounterText,
                { color: currentTheme?.accent || "#4CAF50" },
              ]}
            >
              Abrir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
