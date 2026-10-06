import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import polaroidStyles from "../styles/commentPolaroid.styles";
import usePolaroidStack from "../hooks/usePolaroidStack";

export default function CommentPolaroid({
  photos = [],
  onOpenViewer,
}) {
  const {
    total,
    zIndices,
    anims,
    handlePress,
    handleLongPress,
  } = usePolaroidStack(photos, onOpenViewer);

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
                  elevation: zIndices[i] != null ? Math.min(3, Math.max(1, Math.round(zIndices[i] / 3))) : 2,
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
