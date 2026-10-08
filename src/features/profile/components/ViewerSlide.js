import React, { useRef, useEffect, memo } from "react";
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import {
  styles,
  getViewerSlideAnimatedStyle,
} from "../styles/collectionGallery.styles";

const ViewerSlide = memo(function ViewerSlide({
  item,
  onToggleControls,
  onPinchActiveChange,
}) {
  const baseScale = useRef(1);
  const currentScale = useRef(1);
  const scale = useRef(new Animated.Value(1)).current;
  const lastTap = useRef(0);

  useEffect(() => {
    baseScale.current = 1;
    currentScale.current = 1;
    scale.setValue(1);
  }, [item?.id, scale]);

  const handlePinchGesture = (event) => {
    const s = event?.nativeEvent?.scale;
    if (typeof s === "number" && !isNaN(s) && s > 0) {
      const nextScale = Math.max(1, Math.min(baseScale.current * s, 4.5));
      scale.setValue(nextScale);
      currentScale.current = nextScale;
    }
  };

  const handlePinchStateChange = (event) => {
    const { state } = event.nativeEvent;
    if (state === State.ACTIVE) {
      onPinchActiveChange?.(true);
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      baseScale.current = currentScale.current;
      if (baseScale.current <= 1.05) {
        baseScale.current = 1;
        currentScale.current = 1;
        scale.setValue(1);
        onPinchActiveChange?.(false);
      } else {
        onPinchActiveChange?.(true);
      }
    }
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      lastTap.current = 0;
      if (baseScale.current > 1.05) {
        baseScale.current = 1;
        currentScale.current = 1;
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onPinchActiveChange?.(false);
        });
      } else {
        baseScale.current = 2.5;
        currentScale.current = 2.5;
        Animated.timing(scale, {
          toValue: 2.5,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onPinchActiveChange?.(true);
        });
      }
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current !== 0 && Date.now() - lastTap.current >= 260) {
          lastTap.current = 0;
          onToggleControls();
        }
      }, 280);
    }
  };

  return (
    <View style={styles.modalSlide}>
      <PinchGestureHandler
        onGestureEvent={handlePinchGesture}
        onHandlerStateChange={handlePinchStateChange}
      >
        <Animated.View style={getViewerSlideAnimatedStyle(scale)}>
          <TouchableWithoutFeedback onPress={handleTap}>
            <Image
              source={{ uri: item.url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
});

export default ViewerSlide;
