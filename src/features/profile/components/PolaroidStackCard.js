import React from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import styles, {
  getCardAnimatedStyle,
  getDimOverlayStyle,
} from "../styles/polaroidStackCard.styles";
import usePolaroidStack from "../hooks/usePolaroidStack";

const PolaroidStackCard = React.memo(function PolaroidStackCard({ item }) {
  const { photos, total, zIndices, anims, handlePress, handleLongPress } = usePolaroidStack(item);

  if (!photos || total === 0) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.92}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={280}
      >
        {photos.map((photo, i) => {
          const curAnim = anims[i];
          if (!curAnim) return null;

          return (
            <Animated.View
              key={photo.id || String(i)}
              style={[
                styles.card,
                getCardAnimatedStyle(
                  zIndices[i] || 1,
                  curAnim.transX,
                  curAnim.transY,
                  curAnim.rot,
                  curAnim.scale,
                  curAnim.opacity
                ),
              ]}
            >
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: photo.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.dimOverlay,
                    getDimOverlayStyle(curAnim.dim),
                  ]}
                />
              </View>

              <View style={styles.chinBox}>
                <Text
                  style={styles.chinTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {photo.caption || item?.title || "Memórias"}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
});

export default PolaroidStackCard;
