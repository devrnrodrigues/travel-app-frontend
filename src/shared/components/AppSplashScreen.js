import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function AppSplashScreen({ isReady = false, onAnimationEnd }) {
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const exitStarted = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 450,
        delay: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 450,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && minTimeElapsed && !exitStarted.current) {
      exitStarted.current = true;

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.06,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationEnd?.();
      });
    }
  }, [isReady, minTimeElapsed, onAnimationEnd]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Animated.View
        style={[
          styles.centerBox,
          {
            opacity: contentOpacity,
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/android-icon-foreground.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: "center",
          }}
        >
          <Text style={styles.appName}>TravelApp</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 96,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginTop: 8,
  },
});
