import { Animated, ImageSourcePropType } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface GetStartedScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export interface OnboardingBackgroundProps {
  source?: ImageSourcePropType;
  bgScale: Animated.Value;
  overlayStyle?: any;
}

export interface GetStartedBrandProps {
  titleOpacity: Animated.Value;
  titleTranslateY: Animated.Value;
  titleScale: Animated.Value;
  taglineOpacity: Animated.Value;
  taglineTranslateY: Animated.Value;
}

export interface GetStartedActionsProps {
  buttonsOpacity: Animated.Value;
  buttonsTranslateY: Animated.Value;
  onRegister: () => void;
  onLogin: () => void;
}

export interface WelcomeHeroProps {
  textOpacity: Animated.Value;
  textTranslateY: Animated.Value;
}

export interface WelcomeSwipeButtonProps {
  bottomOpacity: Animated.Value;
  bottomTranslateY: Animated.Value;
  arrowAnim: Animated.Value;
  combinedTranslateY: Animated.AnimatedAddition<number>;
  onGestureEvent: (...args: any[]) => void;
  onHandlerStateChange: (event: any) => void;
}

export interface UseGetStartedReturn {
  bgScale: Animated.Value;
  titleOpacity: Animated.Value;
  titleTranslateY: Animated.Value;
  titleScale: Animated.Value;
  taglineOpacity: Animated.Value;
  taglineTranslateY: Animated.Value;
  buttonsOpacity: Animated.Value;
  buttonsTranslateY: Animated.Value;
  handleRegister: () => Promise<void>;
  handleLogin: () => Promise<void>;
}

export interface UseWelcomeReturn {
  bgScale: Animated.Value;
  textOpacity: Animated.Value;
  textTranslateY: Animated.Value;
  bottomOpacity: Animated.Value;
  bottomTranslateY: Animated.Value;
  arrowAnim: Animated.Value;
  combinedTranslateY: Animated.AnimatedAddition<number>;
  onGestureEvent: (...args: any[]) => void;
  onHandlerStateChange: (event: any) => Promise<void>;
}
