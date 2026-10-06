import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

export function useLoginForm({ login, loginWithGoogle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [focusedInput, setFocusedInput] = useState(null);

  const resetFeedback = useCallback(() => {
    setFeedback({ text: "", type: "" });
    setFocusedInput(null);
  }, []);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password) {
      setFeedback({ text: "Preencha todos os campos!", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ text: "", type: "" });

    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      await login(email.trim(), password);
    } catch (err) {
      setFeedback({ text: err.message || "Erro inesperado ao entrar.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    setFeedback({ text: "", type: "" });
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      try {
        await GoogleSignin.signOut();
      } catch {}
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken ?? response.idToken;

      if (!idToken) {
        throw new Error("Não foi possível obter o token de identificação do Google.");
      }

      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      await loginWithGoogle(idToken);
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (err.code === statusCodes.IN_PROGRESS) {
        return;
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setFeedback({ text: "Google Play Services indisponível ou desatualizado.", type: "error" });
        return;
      }
      setFeedback({ text: err.message || "Erro ao entrar com Google.", type: "error" });
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    googleLoading,
    feedback,
    setFeedback,
    focusedInput,
    setFocusedInput,
    resetFeedback,
    handleLogin,
    handleGoogleLogin,
  };
}

export default useLoginForm;
