import React from "react";
import { View, Text, Animated } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import styles, {
  getBottomAnimatedStyle,
  getArrowAnimatedStyle,
  getButtonTranslateStyle,
} from "../styles/welcome.styles";

const WelcomeSwipeButton = React.memo(function WelcomeSwipeButton({
  bottomOpacity,
  bottomTranslateY,
  arrowAnim,
  combinedTranslateY,
  onGestureEvent,
  onHandlerStateChange,
}) {
  const arrowOpacity = arrowAnim.interpolate({
    inputRange: [-8, 0],
    outputRange: [1, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.bottomContainer,
        getBottomAnimatedStyle(bottomOpacity, bottomTranslateY),
      ]}
    >
      <View style={styles.swipeTrack}>
        <Animated.View
          style={[
            styles.arrows,
            getArrowAnimatedStyle(arrowAnim, arrowOpacity),
          ]}
        >
          <Text style={styles.arrow}>^</Text>
          <Text style={styles.arrow}>^</Text>
        </Animated.View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.button,
              getButtonTranslateStyle(combinedTranslateY),
            ]}
          >
            <Text style={styles.buttonText}>Go</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Animated.View>
  );
});

export default WelcomeSwipeButton;
