import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/welcome.styles";
import OnboardingBackground from "../components/OnboardingBackground";
import WelcomeHero from "../components/WelcomeHero";
import WelcomeSwipeButton from "../components/WelcomeSwipeButton";
import useWelcome from "../hooks/useWelcome";

export default function Welcome({ navigation }) {
  const {
    bgScale,
    textOpacity,
    textTranslateY,
    bottomOpacity,
    bottomTranslateY,
    arrowAnim,
    combinedTranslateY,
    onGestureEvent,
    onHandlerStateChange,
  } = useWelcome(navigation);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <OnboardingBackground bgScale={bgScale} isWelcome={true} />

      <SafeAreaView style={styles.content}>
        <WelcomeHero
          textOpacity={textOpacity}
          textTranslateY={textTranslateY}
        />

        <WelcomeSwipeButton
          bottomOpacity={bottomOpacity}
          bottomTranslateY={bottomTranslateY}
          arrowAnim={arrowAnim}
          combinedTranslateY={combinedTranslateY}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        />
      </SafeAreaView>
    </View>
  );
}
