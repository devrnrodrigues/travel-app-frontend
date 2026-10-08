import React from "react";
import { View, Animated } from "react-native";
import styles, {
  getTitleAnimatedStyle,
  getTaglineAnimatedStyle,
} from "../styles/getStarted.styles";

const GetStartedBrand = React.memo(function GetStartedBrand({
  titleOpacity,
  titleTranslateY,
  titleScale,
  taglineOpacity,
  taglineTranslateY,
}) {
  return (
    <View style={styles.brandContainer}>
      <Animated.Text
        style={[
          styles.appName,
          getTitleAnimatedStyle(titleOpacity, titleTranslateY, titleScale),
        ]}
      >
        TravelApp
      </Animated.Text>
      <Animated.Text
        style={[
          styles.appTagline,
          getTaglineAnimatedStyle(taglineOpacity, taglineTranslateY),
        ]}
      >
        Sua próxima aventura começa aqui
      </Animated.Text>
    </View>
  );
});

export default GetStartedBrand;
