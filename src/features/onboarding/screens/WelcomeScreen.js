import React, { useRef, useEffect } from "react";
import { View, Text, Image, StatusBar, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import styles from "../styles/welcome.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../config/supabase";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Welcome({ navigation }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const bounceLoop = useRef(null);

  const bgScale = useRef(new Animated.Value(1.15)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(35)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(45)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const startBounce = () => {
    bounceAnim.setValue(0);
    bounceLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -9,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 460,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ])
    );
    bounceLoop.current.start();
  };

  const stopBounce = () => {
    if (bounceLoop.current) {
      bounceLoop.current.stop();
    }
    bounceAnim.setValue(0);
  };

  useEffect(() => {
    
    Animated.parallel([
      Animated.timing(bgScale, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(250),
        Animated.parallel([
          Animated.timing(bottomOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bottomTranslateY, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: -8,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    arrowLoop.start();

    startBounce();

    return () => {
      stopBounce();
      arrowLoop.stop();
    };
  }, []);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = async (event) => {
    const { state, translationY: ty } = event.nativeEvent;

    if (state === State.BEGAN || state === State.ACTIVE) {
      stopBounce();
    }

    if (state === State.END) {
      if (ty < -80) {
        stopBounce();
        await AsyncStorage.setItem("hasSeenWelcome", "true");
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id) {
            await AsyncStorage.setItem(`hasSeenWelcome_${user.id}`, "true");
          }
        } catch (_) {}
        navigation.replace("Main");

        Animated.timing(translateY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        }).start(() => {
          startBounce();
        });
      }
    } else if (state === State.CANCELLED || state === State.FAILED) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        startBounce();
      });
    }
  };

  const combinedTranslateY = Animated.add(
    translateY.interpolate({
      inputRange: [-100, 0],
      outputRange: [-100, 0],
      extrapolate: "clamp",
    }),
    bounceAnim
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Explore Lugares{"\n"}Incríveis Pelo Mundo</Text>
          <Text style={styles.subtitle}>Vamos tornar sua vida melhor</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: bottomOpacity,
              transform: [{ translateY: bottomTranslateY }],
            },
          ]}
        >
          <View style={styles.swipeTrack}>
            <Animated.View
              style={[
                styles.arrows,
                {
                  transform: [{ translateY: arrowAnim }],
                  opacity: arrowAnim.interpolate({
                    inputRange: [-8, 0],
                    outputRange: [1, 0.4],
                  }),
                },
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
                  {
                    transform: [{ translateY: combinedTranslateY }],
                  },
                ]}
              >
                <Text style={styles.buttonText}>Go</Text>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
