import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/getStarted.styles";
import OnboardingBackground from "../components/OnboardingBackground";
import GetStartedBrand from "../components/GetStartedBrand";
import GetStartedActions from "../components/GetStartedActions";
import useGetStarted from "../hooks/useGetStarted";

export default function GetStarted({ navigation }) {
  const {
    bgScale,
    titleOpacity,
    titleTranslateY,
    titleScale,
    taglineOpacity,
    taglineTranslateY,
    buttonsOpacity,
    buttonsTranslateY,
    handleRegister,
    handleLogin,
  } = useGetStarted(navigation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <OnboardingBackground bgScale={bgScale} />

      <SafeAreaView style={styles.content}>
        <GetStartedBrand
          titleOpacity={titleOpacity}
          titleTranslateY={titleTranslateY}
          titleScale={titleScale}
          taglineOpacity={taglineOpacity}
          taglineTranslateY={taglineTranslateY}
        />

        <GetStartedActions
          buttonsOpacity={buttonsOpacity}
          buttonsTranslateY={buttonsTranslateY}
          onRegister={handleRegister}
          onLogin={handleLogin}
        />
      </SafeAreaView>
    </View>
  );
}
