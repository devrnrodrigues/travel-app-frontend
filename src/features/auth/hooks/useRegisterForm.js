import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

export function useRegisterForm({ register, loginWithGoogle }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [focusedInput, setFocusedInput] = useState(null);

  const resetFeedback = useCallback(() => {
    setFeedback({ text: "", type: "" });
    setFocusedInput(null);
  }, []);

  const handleRegister = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setFeedback({ text: "Por favor, preencha todos os campos.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setFeedback({ text: "A senha deve ter pelo menos 6 caracteres.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ text: "As senhas não coincidem.", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ text: "", type: "" });

    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      await register({
        fullName: name.trim(),
        email: email.trim(),
        password,
      });
      setFeedback({
        text: "Cadastro realizado com sucesso!",
        type: "success",
      });
    } catch (err) {
      setFeedback({ text: err.message || "Erro inesperado no cadastro.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword, register]);

  const handleGoogleRegister = useCallback(async () => {
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
      setFeedback({ text: err.message || "Erro ao cadastrar com Google.", type: "error" });
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle]);

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    googleLoading,
    feedback,
    setFeedback,
    focusedInput,
    setFocusedInput,
    resetFeedback,
    handleRegister,
    handleGoogleRegister,
  };
}

export default useRegisterForm;
