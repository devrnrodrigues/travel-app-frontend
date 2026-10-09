import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../auth.styles";
import AnimatedInputContainer from "./AnimatedInputContainer";
import Message from "../../../shared/components/Message";

const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };
const HIT_SLOP_15 = { top: 15, bottom: 15, left: 15, right: 15 };

function RegisterFormComponent({
  name,
  onChangeName,
  email,
  onChangeEmail,
  password,
  onChangePassword,
  confirmPassword,
  onChangeConfirmPassword,
  showPassword,
  onToggleShowPassword,
  showConfirmPassword,
  onToggleShowConfirmPassword,
  loading,
  googleLoading,
  isAnyLoading,
  feedback,
  focusedInput,
  onFocusInput,
  onBlurInput,
  onSubmit,
  onGoogleSubmit,
  onSwitchToLogin,
  onLayout,
  isEditable = true,
}) {
  return (
    <View style={styles.faceContainer} onLayout={onLayout}>
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
          editable={isEditable && !isAnyLoading}
          onFocus={() => onFocusInput("registerName")}
          onBlur={onBlurInput}
          onChangeText={onChangeName}
          value={name}
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
          editable={isEditable && !isAnyLoading}
          onFocus={() => onFocusInput("registerEmail")}
          onBlur={onBlurInput}
          onChangeText={onChangeEmail}
          value={email}
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
          secureTextEntry={!showPassword}
          editable={isEditable && !isAnyLoading}
          onFocus={() => onFocusInput("registerPassword")}
          onBlur={onBlurInput}
          onChangeText={onChangePassword}
          value={password}
        />
        <TouchableOpacity
          onPress={onToggleShowPassword}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_10}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
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
          secureTextEntry={!showConfirmPassword}
          editable={isEditable && !isAnyLoading}
          onFocus={() => onFocusInput("registerConfirmPassword")}
          onBlur={onBlurInput}
          onChangeText={onChangeConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity
          onPress={onToggleShowConfirmPassword}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_10}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={
              focusedInput === "registerConfirmPassword"
                ? "#FFFFFF"
                : "rgba(255, 255, 255, 0.85)"
            }
          />
        </TouchableOpacity>
      </AnimatedInputContainer>

      <TouchableOpacity
        style={[styles.button, isAnyLoading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {loading ? (
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
        onPress={onGoogleSubmit}
        disabled={isAnyLoading}
        activeOpacity={0.8}
      >
        {googleLoading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            <Image
              source={require("../../../../assets/google-icon.png")}
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
          onPress={onSwitchToLogin}
          disabled={isAnyLoading}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_15}
        >
          <Text style={styles.footerLink}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const RegisterForm = memo(RegisterFormComponent);
export default RegisterForm;
