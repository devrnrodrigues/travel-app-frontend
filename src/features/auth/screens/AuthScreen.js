import React, { useCallback } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import styles from "../auth.styles";
import { useAuth } from "../context/AuthContext";
import useAuthFlip from "../hooks/useAuthFlip";
import useLoginForm from "../hooks/useLoginForm";
import useRegisterForm from "../hooks/useRegisterForm";
import usePasswordValidation from "../hooks/usePasswordValidation";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AuthBackground from "../components/AuthBackground";

GoogleSignin.configure({
  webClientId: "572904383469-dooa41k72e3bfpm61evcr7pgvp7vo62e.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function AuthScreen({ navigation, route, initialMode = "login" }) {
  const { login, register, loginWithGoogle } = useAuth();
  const routeMode = route?.params?.initialMode ?? initialMode;

  const loginForm = useLoginForm({ login, loginWithGoogle });
  const registerForm = useRegisterForm({ register, loginWithGoogle });

  const { requirements: passwordRequirements } = usePasswordValidation(
    registerForm.password,
    registerForm.confirmPassword
  );

  const handleFaceChange = useCallback(() => {
    loginForm.resetFeedback();
    registerForm.resetFeedback();
  }, [loginForm, registerForm]);

  const flip = useAuthFlip(routeMode, handleFaceChange);

  const isAnyLoading =
    loginForm.loading ||
    loginForm.googleLoading ||
    registerForm.loading ||
    registerForm.googleLoading;

  const formContent = (
    <SafeAreaView style={styles.flex1}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.cardWrapper,
            !flip.hasEntered
              ? {
                opacity: flip.entranceFade,
                transform: [
                  { translateY: flip.entranceTranslateY },
                  { scale: flip.entranceScale },
                ],
              }
              : null,
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              {
                height: flip.heightAnim,
                transform: [
                  { perspective: 1200 },
                  { rotateY: flip.rotateY },
                  { scale: flip.cardScale },
                ],
                opacity: flip.cardOpacity,
              },
            ]}
          >
            <View
              style={flip.activeFace === "login" ? styles.faceVisible : styles.faceHidden}
              pointerEvents={flip.activeFace === "login" ? "auto" : "none"}
            >
              <LoginForm
                email={loginForm.email}
                onChangeEmail={(t) => {
                  loginForm.setEmail(t);
                  loginForm.setFeedback({ text: "", type: "" });
                }}
                password={loginForm.password}
                onChangePassword={(t) => {
                  loginForm.setPassword(t);
                  loginForm.setFeedback({ text: "", type: "" });
                }}
                showPassword={loginForm.showPassword}
                onToggleShowPassword={() => loginForm.setShowPassword(!loginForm.showPassword)}
                loading={loginForm.loading}
                googleLoading={loginForm.googleLoading}
                isAnyLoading={isAnyLoading}
                feedback={loginForm.feedback}
                focusedInput={loginForm.focusedInput}
                onFocusInput={loginForm.setFocusedInput}
                onBlurInput={() => loginForm.setFocusedInput(null)}
                onSubmit={loginForm.handleLogin}
                onGoogleSubmit={loginForm.handleGoogleLogin}
                onSwitchToRegister={() => flip.flipTo("register")}
                onLayout={flip.onLoginLayout}
                isEditable={flip.activeFace === "login"}
              />
            </View>

            <View
              style={flip.activeFace === "register" ? styles.faceVisible : styles.faceHidden}
              pointerEvents={flip.activeFace === "register" ? "auto" : "none"}
            >
              <RegisterForm
                name={registerForm.name}
                onChangeName={(t) => {
                  registerForm.setName(t);
                  registerForm.setFeedback({ text: "", type: "" });
                }}
                email={registerForm.email}
                onChangeEmail={(t) => {
                  registerForm.setEmail(t);
                  registerForm.setFeedback({ text: "", type: "" });
                }}
                password={registerForm.password}
                onChangePassword={(t) => {
                  registerForm.setPassword(t);
                  registerForm.setFeedback({ text: "", type: "" });
                }}
                confirmPassword={registerForm.confirmPassword}
                onChangeConfirmPassword={(t) => {
                  registerForm.setConfirmPassword(t);
                  registerForm.setFeedback({ text: "", type: "" });
                }}
                showPassword={registerForm.showPassword}
                onToggleShowPassword={() => registerForm.setShowPassword(!registerForm.showPassword)}
                showConfirmPassword={registerForm.showConfirmPassword}
                onToggleShowConfirmPassword={() =>
                  registerForm.setShowConfirmPassword(!registerForm.showConfirmPassword)
                }
                passwordRequirements={passwordRequirements}
                loading={registerForm.loading}
                googleLoading={registerForm.googleLoading}
                isAnyLoading={isAnyLoading}
                feedback={registerForm.feedback}
                focusedInput={registerForm.focusedInput}
                onFocusInput={registerForm.setFocusedInput}
                onBlurInput={() => registerForm.setFocusedInput(null)}
                onSubmit={registerForm.handleRegister}
                onGoogleSubmit={registerForm.handleGoogleRegister}
                onSwitchToLogin={() => flip.flipTo("login")}
                onLayout={flip.onRegisterLayout}
                isEditable={flip.activeFace === "register"}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AuthBackground />
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" style={styles.flex1}>
          {formContent}
        </KeyboardAvoidingView>
      ) : (
        formContent
      )}
    </View>
  );
}
