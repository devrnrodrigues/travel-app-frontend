import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
  BackHandler,
  StyleSheet,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../../config/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../auth.styles";
import Message from "../../../shared/components/Message";

function AnimatedInputContainer({ isFocused, children, style }) {
  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.14)", "rgba(255, 255, 255, 0.25)"],
  });

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "rgba(255, 255, 255, 0.70)"],
  });

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const DEFAULT_LOGIN_HEIGHT = 485;
const DEFAULT_REGISTER_HEIGHT = 785;

export default function AuthScreen({ navigation, route, initialMode = "login" }) {
  
  const routeMode = route?.params?.initialMode || route?.params?.mode || initialMode;
  const [activeFace, setActiveFace] = useState(routeMode === "register" ? "register" : "login");
  const isFlipping = useRef(false);

  const measuredLogin = useRef(false);
  const measuredRegister = useRef(false);

  const loginHeight = useRef(DEFAULT_LOGIN_HEIGHT);
  const registerHeight = useRef(DEFAULT_REGISTER_HEIGHT);
  const heightAnim = useRef(
    new Animated.Value(
      routeMode === "register" ? DEFAULT_REGISTER_HEIGHT : DEFAULT_LOGIN_HEIGHT
    )
  ).current;

  const flipAnim = useRef(new Animated.Value(0)).current;
  const [hasEntered, setHasEntered] = useState(false);

  const entranceFade = useRef(new Animated.Value(1)).current;
  const entranceTranslateY = useRef(new Animated.Value(35)).current;
  const entranceScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceFade, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(entranceTranslateY, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(entranceScale, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setHasEntered(true);
    });
  }, []);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginGoogleLoading, setLoginGoogleLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerGoogleLoading, setRegisterGoogleLoading] = useState(false);

  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [focusedInput, setFocusedInput] = useState(null);

  const isAnyLoading =
    loginLoading || loginGoogleLoading || registerLoading || registerGoogleLoading;

  const onLoginLayout = (e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 100) {
      loginHeight.current = h + 44;
      measuredLogin.current = true;
      if (activeFace === "login" && !isFlipping.current) {
        Animated.timing(heightAnim, {
          toValue: loginHeight.current,
          duration: 180,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const onRegisterLayout = (e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 100) {
      registerHeight.current = h + 44;
      measuredRegister.current = true;
      if (activeFace === "register" && !isFlipping.current) {
        Animated.timing(heightAnim, {
          toValue: registerHeight.current,
          duration: 180,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const passwordRequirements = [
    {
      id: "min",
      label: "No mínimo 6 caracteres",
      valid: registerPassword.length >= 6,
    },
    {
      id: "letter",
      label: "Pelo menos uma letra",
      valid: /[a-zA-Z]/.test(registerPassword),
    },
    {
      id: "number",
      label: "Pelo menos um número",
      valid: /[0-9]/.test(registerPassword),
    },
    {
      id: "upper",
      label: "Pelo menos uma letra maiúscula",
      valid: /[A-Z]/.test(registerPassword),
    },
    {
      id: "special",
      label: "Pelo menos um caractere especial (!@#$%^&*)",
      valid: /[^A-Za-z0-9]/.test(registerPassword),
    },
    {
      id: "match",
      label: "As senhas coincidem",
      valid: registerPassword.length > 0 && registerPassword === registerConfirmPassword,
    },
  ];

  useEffect(() => {
    const onBackPress = () => {
      if (activeFace === "register") {
        flipTo("login");
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [activeFace]);

  const flipTo = (target) => {
    if (isFlipping.current || target === activeFace) return;
    isFlipping.current = true;
    Keyboard.dismiss();
    setFocusedInput(null);
    setFeedback({ text: "", type: "" });

    flipAnim.setValue(0);

    const targetHeight =
      target === "register"
        ? (measuredRegister.current
          ? registerHeight.current
          : Math.max(registerHeight.current, DEFAULT_REGISTER_HEIGHT))
        : (measuredLogin.current
          ? loginHeight.current
          : Math.max(loginHeight.current, DEFAULT_LOGIN_HEIGHT));

    let faceSwapped = false;
    const listenerId = flipAnim.addListener(({ value }) => {
      if (!faceSwapped && value >= 0.5) {
        faceSwapped = true;
        setActiveFace(target);
      }
    });

    Animated.parallel([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 560,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: targetHeight,
        duration: 560,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      flipAnim.removeListener(listenerId);
      if (!faceSwapped) {
        setActiveFace(target);
      }
      isFlipping.current = false;
      heightAnim.setValue(targetHeight);
      flipAnim.setValue(0);
    });
  };

  const rotateY = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: ["0deg", "90deg", "-90deg", "0deg"],
    })
  ).current;

  const cardScale = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.91, 1],
    })
  ).current;

  const cardOpacity = useRef(
    flipAnim.interpolate({
      inputRange: [0, 0.46, 0.5, 0.54, 1],
      outputRange: [1, 0.85, 0, 0.85, 1],
    })
  ).current;

  async function handleLogin() {
    if (!loginEmail.trim() || !loginPassword) {
      setFeedback({ text: "Preencha todos os campos!", type: "error" });
      return;
    }

    setLoginLoading(true);
    setFeedback({ text: "", type: "" });

    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        setFeedback({ text: error.message, type: "error" });
      }
    } catch (err) {
      setFeedback({ text: err.message || "Erro inesperado ao entrar.", type: "error" });
    } finally {
      setLoginLoading(false);
    }
  }

  function handleGoogleLogin() {
    setLoginGoogleLoading(true);
    setFeedback({ text: "", type: "" });
  }

  async function handleRegister() {
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword || !registerConfirmPassword) {
      setFeedback({ text: "Por favor, preencha todos os campos.", type: "error" });
      return;
    }
    if (registerPassword.length < 6) {
      setFeedback({ text: "A senha deve ter pelo menos 6 caracteres.", type: "error" });
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setFeedback({ text: "As senhas não coincidem.", type: "error" });
      return;
    }

    setRegisterLoading(true);
    setFeedback({ text: "", type: "" });

    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      const { error } = await supabase.auth.signUp({
        email: registerEmail.trim(),
        password: registerPassword,
        options: { data: { full_name: registerName.trim() } },
      });

      if (error) {
        setFeedback({ text: error.message, type: "error" });
      } else {
        setFeedback({
          text: "Cadastro realizado com sucesso! Verifique seu e-mail.",
          type: "success",
        });
        
        setTimeout(() => flipTo("login"), 2000);
      }
    } catch (err) {
      setFeedback({ text: err.message || "Erro inesperado no cadastro.", type: "error" });
    } finally {
      setRegisterLoading(false);
    }
  }

  function handleGoogleRegister() {
    setRegisterGoogleLoading(true);
    setFeedback({ text: "", type: "" });
  }

  const renderLoginFace = () => (
    <View style={styles.faceContainer} onLayout={onLoginLayout}>
      <Text style={styles.headerText}>Bem-vindo</Text>
      <Text style={styles.subHeaderText}>Faça login para continuar sua jornada!</Text>

      <Message message={feedback.text} type={feedback.type} />

      <AnimatedInputContainer isFocused={focusedInput === "loginEmail"}>
        <Ionicons
          name="mail-outline"
          size={19}
          color={focusedInput === "loginEmail" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={activeFace === "login" && !isAnyLoading}
          onFocus={() => setFocusedInput("loginEmail")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setLoginEmail(t);
            setFeedback({ text: "", type: "" });
          }}
          value={loginEmail}
        />
      </AnimatedInputContainer>

      <AnimatedInputContainer isFocused={focusedInput === "loginPassword"}>
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color={focusedInput === "loginPassword" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry={!showLoginPassword}
          editable={activeFace === "login" && !isAnyLoading}
          onFocus={() => setFocusedInput("loginPassword")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setLoginPassword(t);
            setFeedback({ text: "", type: "" });
          }}
          value={loginPassword}
        />
        <TouchableOpacity
          onPress={() => setShowLoginPassword(!showLoginPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showLoginPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={focusedInput === "loginPassword" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          />
        </TouchableOpacity>
      </AnimatedInputContainer>

      <TouchableOpacity
        style={[styles.button, isAnyLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {loginLoading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continue com</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, isAnyLoading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {loginGoogleLoading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            <Image
              source={require("../../../assets/google-icon.png")}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Fazer login com o Google</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não tem uma conta?</Text>
        <TouchableOpacity
          onPress={() => flipTo("register")}
          disabled={isAnyLoading}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRegisterFace = () => (
    <View style={styles.faceContainer} onLayout={onRegisterLayout}>
      <Text style={styles.headerText}>Criar Conta</Text>
      <Text style={styles.subHeaderText}>Cadastre-se para explorar destinos incríveis!</Text>

      <Message message={feedback.text} type={feedback.type} />

      <AnimatedInputContainer isFocused={focusedInput === "registerName"}>
        <Ionicons
          name="person-outline"
          size={19}
          color={focusedInput === "registerName" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          editable={activeFace === "register" && !isAnyLoading}
          onFocus={() => setFocusedInput("registerName")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setRegisterName(t);
            setFeedback({ text: "", type: "" });
          }}
          value={registerName}
        />
      </AnimatedInputContainer>

      <AnimatedInputContainer isFocused={focusedInput === "registerEmail"}>
        <Ionicons
          name="mail-outline"
          size={19}
          color={focusedInput === "registerEmail" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={activeFace === "register" && !isAnyLoading}
          onFocus={() => setFocusedInput("registerEmail")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setRegisterEmail(t);
            setFeedback({ text: "", type: "" });
          }}
          value={registerEmail}
        />
      </AnimatedInputContainer>

      <AnimatedInputContainer isFocused={focusedInput === "registerPassword"}>
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color={focusedInput === "registerPassword" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry={!showRegisterPassword}
          editable={activeFace === "register" && !isAnyLoading}
          onFocus={() => setFocusedInput("registerPassword")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setRegisterPassword(t);
            setFeedback({ text: "", type: "" });
          }}
          value={registerPassword}
        />
        <TouchableOpacity
          onPress={() => setShowRegisterPassword(!showRegisterPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showRegisterPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={focusedInput === "registerPassword" ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)"}
          />
        </TouchableOpacity>
      </AnimatedInputContainer>

      <AnimatedInputContainer isFocused={focusedInput === "registerConfirmPassword"}>
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color={
            focusedInput === "registerConfirmPassword"
              ? "#FFFFFF"
              : "rgba(255, 255, 255, 0.85)"
          }
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry={!showRegisterConfirmPassword}
          editable={activeFace === "register" && !isAnyLoading}
          onFocus={() => setFocusedInput("registerConfirmPassword")}
          onBlur={() => setFocusedInput(null)}
          onChangeText={(t) => {
            setRegisterConfirmPassword(t);
            setFeedback({ text: "", type: "" });
          }}
          value={registerConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showRegisterConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={
              focusedInput === "registerConfirmPassword"
                ? "#FFFFFF"
                : "rgba(255, 255, 255, 0.85)"
            }
          />
        </TouchableOpacity>
      </AnimatedInputContainer>

      <View style={styles.passwordRequirements}>
        <Text style={styles.requirementsTitle}>REQUISITOS DA SENHA:</Text>
        {passwordRequirements.map((req) => (
          <View key={req.id} style={styles.requirementItem}>
            <Ionicons
              name={req.valid ? "checkmark-circle" : "close-circle"}
              size={15}
              color={req.valid ? "#00E676" : "#FF3B30"}
            />
            <Text
              style={[
                styles.requirementText,
                { color: req.valid ? "#00E676" : "#FF3B30", fontWeight: "600" },
              ]}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isAnyLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {registerLoading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continue com</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, isAnyLoading && styles.buttonDisabled]}
        onPress={handleGoogleRegister}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {registerGoogleLoading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            <Image
              source={require("../../../assets/google-icon.png")}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Cadastrar com o Google</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já possui uma conta?</Text>
        <TouchableOpacity
          onPress={() => flipTo("login")}
          disabled={isAnyLoading}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.footerLink}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
            !hasEntered
              ? {
                  opacity: entranceFade,
                  transform: [
                    { translateY: entranceTranslateY },
                    { scale: entranceScale },
                  ],
                }
              : null,
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              {
                height: heightAnim,
                overflow: "hidden",
                transform: [
                  { perspective: 1200 },
                  { rotateY },
                  { scale: cardScale },
                ],
                opacity: cardOpacity,
              },
            ]}
          >
            {}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                Keyboard.dismiss();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Main" }],
                });
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={19} color="rgba(255, 255, 255, 0.85)" />
            </TouchableOpacity>

            <View
              style={activeFace === "login" ? styles.faceVisible : styles.faceHidden}
              pointerEvents={activeFace === "login" ? "auto" : "none"}
            >
              {renderLoginFace()}
            </View>

            <View
              style={activeFace === "register" ? styles.faceVisible : styles.faceHidden}
              pointerEvents={activeFace === "register" ? "auto" : "none"}
            >
              {renderRegisterFace()}
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {}
      <View style={styles.backgroundWrapper} pointerEvents="none">
        <Image
          source={require("../../../assets/welcome-bg.jpg")}
          style={styles.background}
          resizeMode="cover"
          blurRadius={3}
        />
        <View style={styles.overlay} />
      </View>

      {}
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
