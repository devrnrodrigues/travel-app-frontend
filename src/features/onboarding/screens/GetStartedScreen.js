import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/getStarted.styles";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function GetStarted({ navigation }) {
  
  const bgScale = useRef(new Animated.Value(1.16)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(28)).current;
  const titleScale = useRef(new Animated.Value(0.92)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(18)).current;

  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      
      Animated.timing(bgScale, {
        toValue: 1.06,
        duration: 1300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.delay(140),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 750,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 750,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.sequence([
        Animated.delay(260),
        Animated.parallel([
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(buttonsTranslateY, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {}
      <AnimatedImage
        source={require("../../../assets/welcome-bg.jpg")}
        style={[
          styles.background,
          {
            transform: [{ scale: bgScale }],
          },
        ]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {}
      <SafeAreaView style={styles.content}>
        <View style={styles.brandContainer}>
          <Animated.Text
            style={[
              styles.appName,
              {
                opacity: titleOpacity,
                transform: [
                  { translateY: titleTranslateY },
                  { scale: titleScale },
                ],
              },
            ]}
          >
            TravelApp
          </Animated.Text>
          <Animated.Text
            style={[
              styles.appTagline,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
              },
            ]}
          >
            Sua próxima aventura começa aqui
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={async () => {
              await AsyncStorage.setItem("hasSeenGetStarted", "true");
              navigation.navigate("Register");
            }}
          >
            <Text style={styles.primaryButtonText}>Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryLink}
            activeOpacity={0.7}
            onPress={async () => {
              await AsyncStorage.setItem("hasSeenGetStarted", "true");
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.secondaryLinkText}>
              Já tem uma conta? <Text style={styles.secondaryLinkHighlight}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
