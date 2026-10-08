import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing } from "react-native";
import { State } from "react-native-gesture-handler";
import { useAuth } from "../../../context/AuthContext";

export default function useWelcome(navigation) {
  const { markWelcomeSeen } = useAuth();
  const translateY = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const bounceLoop = useRef(null);

  const bgScale = useRef(new Animated.Value(1.15)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(35)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(45)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const startBounce = useCallback(() => {
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
  }, [bounceAnim]);

  const stopBounce = useCallback(() => {
    if (bounceLoop.current) {
      bounceLoop.current.stop();
    }
    bounceAnim.setValue(0);
  }, [bounceAnim]);

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
  }, [
    bgScale,
    textOpacity,
    textTranslateY,
    bottomOpacity,
    bottomTranslateY,
    arrowAnim,
    startBounce,
    stopBounce,
  ]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = useCallback(
    async (event) => {
      const { state, translationY: ty } = event.nativeEvent;

      if (state === State.BEGAN || state === State.ACTIVE) {
        stopBounce();
      }

      if (state === State.END) {
        if (ty < -80) {
          stopBounce();
          await markWelcomeSeen();
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
    },
    [stopBounce, startBounce, markWelcomeSeen, navigation, translateY]
  );

  const combinedTranslateY = Animated.add(
    translateY.interpolate({
      inputRange: [-100, 0],
      outputRange: [-100, 0],
      extrapolate: "clamp",
    }),
    bounceAnim
  );

  return {
    bgScale,
    textOpacity,
    textTranslateY,
    bottomOpacity,
    bottomTranslateY,
    arrowAnim,
    combinedTranslateY,
    onGestureEvent,
    onHandlerStateChange,
  };
}
